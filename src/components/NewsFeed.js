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
    }
    .news[hidden] {
      display: none;
    }
    .stories {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: var(--space-2xl);
      list-style: none;
      margin: 0;
      padding: 0;
      counter-reset: story;
    }
    .story {
      display: grid;
      grid-template-columns: var(--space-xl) minmax(0, 1fr);
      gap: var(--space-sm);
      padding: var(--space-lg) 0;
      border-top: 1px solid var(--color-border-subtle);
      counter-increment: story;
    }
    .story::before {
      content: counter(story, decimal-leading-zero);
      padding-top: var(--space-xs);
      color: var(--color-text-muted);
      font: var(--font-size-xs) var(--font-family-mono);
    }
    .story-body {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-sm);
      min-width: 0;
    }
    .title {
      color: var(--color-text);
      font: var(--font-size-md)/1.4 var(--font-family-display);
      text-decoration: none;
      overflow-wrap: anywhere;
    }
    .title:hover {
      color: var(--color-accent);
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }
    .title:focus-visible,
    .meta a:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 3px;
    }
    .meta {
      max-width: 100%;
      color: var(--color-text-muted);
      font: var(--font-size-xs)/1.7 var(--font-family-mono);
      overflow-wrap: anywhere;
    }
    .meta a {
      color: inherit;
      text-decoration: none;
    }
    .meta a:hover {
      color: var(--color-accent);
      text-decoration: underline;
    }
    .news-empty {
      grid-column: 1 / -1;
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
      margin: 0;
      padding: var(--space-lg) 0;
    }
    @media (max-width: 899px) {
      .stories {
        grid-template-columns: minmax(0, 1fr);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
      }
    }
  </style>
  <div class="news" hidden>
    <ol class="stories"></ol>
  </div>
`;

const storyTemplate = document.createElement('template');
storyTemplate.innerHTML = `
  <li class="story">
    <div class="story-body">
      <a class="title" rel="noopener noreferrer"></a>
      <span class="meta"></span>
    </div>
  </li>
`;

function formatAge(createdAtI) {
  const seconds = Math.max(0, Date.now() / 1000 - createdAtI);
  const hours = Math.floor(seconds / 3600);
  if (hours >= 24) return `${Math.floor(hours / 24)}D`;
  if (hours >= 1) return `${hours}H`;
  return `${Math.max(1, Math.floor(seconds / 60))}M`;
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
      parts.push(`${hit.points ?? 0} PTS`);
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
    empty.innerText = 'The feed is unavailable right now. Check back later.';
    list.appendChild(empty);
    news.hidden = false;
  }
}

customElements.define('newsfeed-component', NewsFeed);
