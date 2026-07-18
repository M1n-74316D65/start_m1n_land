import { CONFIG } from '../config.js';

const API_URL =
  'https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=8';
const REFRESH_INTERVAL = 10 * 60 * 1000;

const newsTemplate = document.createElement('template');
newsTemplate.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      min-width: 0;
      max-width: 100%;
    }

    .news {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      width: 100%;
      min-width: 0;
      opacity: 0;
      transform: translateY(2px);
      animation: newsFadeIn var(--duration-slow) var(--ease-out) forwards;
    }

    @keyframes newsFadeIn {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .news-header {
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
      margin: 0;
    }

    .stories {
      display: flex;
      flex-direction: column;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .story {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .title {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      padding: var(--space-sm) var(--space-md) 0;
      color: var(--color-text);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-normal);
      text-decoration: none;
      transition:
        background var(--duration-fast) var(--ease-out),
        color var(--duration-fast) var(--ease-out),
        box-shadow var(--duration-fast) var(--ease-out);
    }

    .title:hover {
      background: var(--color-focus);
      color: var(--color-accent);
    }

    .title:focus-visible {
      outline: none;
      background: var(--color-focus);
      color: var(--color-accent);
      box-shadow: inset 0 0 0 1px var(--color-accent);
    }

    .meta {
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
      padding: 0 var(--space-md) var(--space-sm);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .meta a {
      color: inherit;
      text-decoration: none;
    }

    .meta a:hover,
    .meta a:focus-visible {
      color: var(--color-text-subtle);
      text-decoration: underline;
      outline: none;
    }

    .news-empty {
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
      margin: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .news {
        animation: none;
        opacity: 1;
        transform: none;
      }
    }
  </style>
  <div class="news" hidden>
    <p class="news-header">Hacker News</p>
    <ol class="stories"></ol>
  </div>
`;

const storyTemplate = document.createElement('template');
storyTemplate.innerHTML = `
  <li class="story">
    <a class="title" rel="noopener noreferrer"></a>
    <span class="meta"></span>
  </li>
`;

function formatAge(createdAtI) {
  const seconds = Math.max(0, Date.now() / 1000 - createdAtI);
  const hours = Math.floor(seconds / 3600);
  if (hours >= 24) return `${Math.floor(hours / 24)}d`;
  if (hours >= 1) return `${hours}h`;
  return `${Math.max(1, Math.floor(seconds / 60))}m`;
}

export class NewsFeed extends HTMLElement {
  #intervalId;
  #abortController;
  #lastFetch = 0;
  #hasRendered = false;
  #boundVisibilityChange;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(newsTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    this.#fetchStories();
    this.#intervalId = setInterval(
      () => this.#fetchStories(),
      REFRESH_INTERVAL
    );
    this.#boundVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        Date.now() - this.#lastFetch > REFRESH_INTERVAL
      ) {
        this.#fetchStories();
      }
    };
    document.addEventListener('visibilitychange', this.#boundVisibilityChange);
  }

  disconnectedCallback() {
    clearInterval(this.#intervalId);
    this.#abortController?.abort();
    if (this.#boundVisibilityChange) {
      document.removeEventListener(
        'visibilitychange',
        this.#boundVisibilityChange
      );
    }
  }

  async #fetchStories() {
    this.#abortController?.abort();
    this.#abortController = new AbortController();
    this.#lastFetch = Date.now();

    try {
      const response = await fetch(API_URL, {
        signal: this.#abortController.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.#render(data.hits ?? []);
    } catch (error) {
      if (error.name === 'AbortError') return;
      if (!this.#hasRendered) this.#renderError();
    }
  }

  #render(hits) {
    const stories = hits.filter((hit) => hit.title);
    if (stories.length === 0) {
      if (!this.#hasRendered) this.#renderError();
      return;
    }

    const list = this.shadowRoot.querySelector('.stories');
    const fragment = document.createDocumentFragment();

    for (const hit of stories) {
      const clone = storyTemplate.content.cloneNode(true);
      const link = clone.querySelector('.title');
      link.href =
        hit.url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`;
      if (CONFIG.openLinksInNewTab) link.target = '_blank';
      link.innerText = hit.title;

      const meta = clone.querySelector('.meta');
      const parts = [];
      if (hit.url) {
        try {
          parts.push(new URL(hit.url).hostname.replace(/^www\./, ''));
        } catch {
          /* malformed url */
        }
      }
      parts.push(`${hit.points ?? 0} points`);
      parts.push(formatAge(hit.created_at_i));
      meta.innerText = parts.join(' · ');

      const comments = document.createElement('a');
      comments.href = `https://news.ycombinator.com/item?id=${hit.objectID}`;
      comments.innerText = 'comments';
      meta.appendChild(document.createTextNode(' · '));
      meta.appendChild(comments);

      fragment.appendChild(clone);
    }

    list.replaceChildren(fragment);
    this.shadowRoot.querySelector('.news').hidden = false;
    this.#hasRendered = true;
  }

  #renderError() {
    const news = this.shadowRoot.querySelector('.news');
    const list = this.shadowRoot.querySelector('.stories');
    list.replaceChildren();
    const empty = document.createElement('p');
    empty.className = 'news-empty';
    empty.innerText = "Couldn't load Hacker News";
    list.appendChild(empty);
    news.hidden = false;
  }
}

customElements.define('newsfeed-component', NewsFeed);
