import { CONFIG } from '../config.js';

const API_URL = 'https://news.m1n.land/api/feed?limit=5&hours=24';
const WIRE_URL = 'https://news.m1n.land/';
const REFRESH_INTERVAL = 10 * 60 * 1000;
const SOURCE_ORDER = [
  'hn',
  'verge',
  'arstechnica',
  'register',
  'phoronix',
  'wired',
  'engadget',
  'slashdot',
  'appleinsider',
  'daringfireball',
  'lwn',
  'bleepingcomputer',
  'hackaday',
  'cloudflare',
  'bbc',
  'npr',
  'guardian',
  'aljazeera',
  'reuters',
  'cnbc',
  'fortune',
  'wsj',
  'nature',
  'quantamag',
  'newscientist',
  'sciencedaily',
  'polygon',
  'pcgamer',
  'gamespot',
  'avclub',
  'variety',
  'newyorker',
  'politico',
  'thehill',
  'vox',
  'elpais',
  'elpais-espana',
  'eldiario',
  'lavanguardia',
  'elmundo',
  'elespanol',
  '20minutos',
  'europapress',
  'xataka',
  'genbeta',
];

const newsTemplate = document.createElement('template');
newsTemplate.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      min-width: 0;
    }
    [hidden] {
      display: none !important;
    }
    .news-header {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--space-sm) var(--space-lg);
      padding-bottom: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }
    .wordmark {
      margin: 0;
      font: italic 400 2.5rem/1 var(--font-family-reading);
      letter-spacing: -0.04em;
    }
    .news-window {
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
      font-variant-numeric: tabular-nums;
    }
    .stories {
      display: grid;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .story {
      min-width: 0;
      padding: var(--space-lg) 0;
      border-bottom: 1px solid var(--color-border);
    }
    .story-top {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-xs) var(--space-md);
      margin-bottom: var(--space-sm);
    }
    .source {
      display: inline-flex;
      align-items: center;
      min-width: 0;
      min-height: 1.5rem;
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
      text-decoration: none;
    }
    .source:visited,
    .source:hover {
      color: var(--color-text-muted);
    }
    .source:hover {
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }
    .source-dot {
      width: 0.4rem;
      height: 0.4rem;
      margin-right: var(--space-sm);
      flex: none;
      background: var(--source-color, var(--color-text-muted));
    }
    .source-name {
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .title {
      display: block;
      color: var(--color-text);
      font: var(--font-size-news)/1.4 var(--font-family-reading);
      letter-spacing: -0.015em;
      text-decoration: none;
      text-wrap: pretty;
      overflow-wrap: break-word;
    }
    .title:visited {
      color: var(--color-text-muted);
    }
    .title:hover {
      color: var(--color-accent);
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }
    .meta {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .meta a {
      display: inline-flex;
      align-items: center;
      min-height: 1.5rem;
      color: inherit;
      text-decoration: none;
    }
    .meta a:hover {
      color: var(--color-accent);
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }
    .source:focus-visible,
    .title:focus-visible,
    .meta a:focus-visible,
    .desk-link:focus-visible,
    .retry:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 3px;
    }
    .desk-link {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      min-height: var(--control-min-height);
      margin-top: var(--space-lg);
      color: var(--color-text);
      font-size: var(--font-size-sm);
      text-decoration: none;
    }
    .desk-link::after {
      content: '↗';
      color: var(--color-accent);
      font-size: var(--font-size-md);
    }
    .desk-link:hover {
      color: var(--color-accent);
    }
    .loading-story {
      pointer-events: none;
    }
    .loading-source,
    .loading-title {
      display: block;
      background: var(--color-surface);
    }
    .loading-source {
      width: 7rem;
      height: 0.85rem;
      margin-bottom: var(--space-md);
    }
    .loading-title {
      width: 92%;
      height: 1.15rem;
    }
    .loading-title + .loading-title {
      width: 64%;
      margin-top: var(--space-sm);
    }
    .news-message {
      padding: var(--space-2xl) 0;
      border-bottom: 1px solid var(--color-border);
    }
    .news-message p {
      max-width: 42ch;
      margin: 0;
      color: var(--color-text-subtle);
      font-size: var(--font-size-sm);
    }
    .news-message .error-text {
      color: var(--color-danger);
    }
    .news-message--refresh {
      padding: var(--space-lg) 0;
    }
    .retry {
      min-height: var(--control-min-height);
      margin-top: var(--space-lg);
      padding: var(--space-sm) var(--space-lg);
      border: 1px solid var(--color-text);
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--color-text);
      font: 500 var(--font-size-sm) var(--font-family-display);
      cursor: pointer;
    }
    .retry:hover {
      background: var(--color-text);
      color: var(--color-background);
    }
    @media (pointer: coarse) {
      .source,
      .title,
      .meta a,
      .desk-link {
        min-height: var(--control-min-height);
      }
      .source,
      .title,
      .desk-link {
        display: flex;
        align-items: center;
      }
    }
    @media (forced-colors: active) {
      .source-dot {
        border: 1px solid CanvasText;
        background: CanvasText;
      }
      .retry {
        border-color: ButtonText;
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
  <div class="news">
    <header class="news-header">
      <h2 class="wordmark">wire</h2>
      <span class="news-window">Last 24 hours</span>
    </header>
    <div class="news-content" aria-busy="true">
      <ol class="stories" data-state="loading" aria-label="Loading latest headlines">
        <li class="story loading-story" aria-hidden="true"><span class="loading-source"></span><span class="loading-title"></span><span class="loading-title"></span></li>
        <li class="story loading-story" aria-hidden="true"><span class="loading-source"></span><span class="loading-title"></span><span class="loading-title"></span></li>
        <li class="story loading-story" aria-hidden="true"><span class="loading-source"></span><span class="loading-title"></span><span class="loading-title"></span></li>
        <li class="story loading-story" aria-hidden="true"><span class="loading-source"></span><span class="loading-title"></span><span class="loading-title"></span></li>
        <li class="story loading-story" aria-hidden="true"><span class="loading-source"></span><span class="loading-title"></span><span class="loading-title"></span></li>
      </ol>
      <ol class="stories" data-state="success" role="list" hidden></ol>
      <div class="news-message news-message--refresh" data-state="refresh-error" role="alert" hidden>
        <p class="error-text">Couldn't refresh. Showing earlier headlines.</p>
        <button class="retry" type="button">Retry</button>
      </div>
      <div class="news-message" data-state="empty" hidden>
        <p>Nothing in this window. Open wire to choose another section.</p>
        <button class="retry" type="button">Retry</button>
      </div>
      <div class="news-message" data-state="error" role="alert" hidden>
        <p class="error-text">Wire is unavailable right now. Try again.</p>
        <button class="retry" type="button">Retry</button>
      </div>
    </div>
    <a class="desk-link" href="https://news.m1n.land/" rel="noopener noreferrer">Open wire</a>
  </div>
`;

const storyTemplate = document.createElement('template');
storyTemplate.innerHTML = `
  <li class="story">
    <div class="story-top">
      <a class="source" rel="noopener noreferrer">
        <span class="source-dot" aria-hidden="true"></span>
        <span class="source-name"></span>
      </a>
      <span class="meta"><time></time></span>
    </div>
    <a class="title" rel="noopener noreferrer"></a>
  </li>
`;

function formatAge(publishedAt) {
  const minutes = Math.floor(Math.max(0, Date.now() - publishedAt) / 60000);
  if (minutes < 60) return `${Math.max(1, minutes)}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function safeHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function hashSlug(slug) {
  let hash = 0;
  for (let index = 0; index < slug.length; index++) {
    hash = (hash * 31 + slug.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function sourceColor(slug) {
  const sourceIndex = SOURCE_ORDER.indexOf(slug);
  const hue =
    (((sourceIndex >= 0 ? sourceIndex : hashSlug(slug)) * 137.508) % 360) / 30;
  const saturation = 0.45;
  const lightness = 0.55;
  const chroma = saturation * Math.min(lightness, 1 - lightness);
  const channel = (offset) => {
    const k = (hue + offset) % 12;
    const value = lightness - chroma * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(value * 255)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`;
}

export class NewsFeed extends HTMLElement {
  #intervalId;
  #abortController;
  #lastFetch = 0;
  #hasContent = false;
  #boundVisibilityChange;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(newsTemplate.content.cloneNode(true));
    this.shadowRoot.querySelectorAll('.retry').forEach((button) => {
      button.addEventListener('click', () => this.#fetchStories());
    });
    const deskLink = this.shadowRoot.querySelector('.desk-link');
    if (CONFIG.openLinksInNewTab) deskLink.target = '_blank';
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

  #setState(state) {
    this.shadowRoot
      .querySelector('.news-content')
      .setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');
    this.shadowRoot.querySelectorAll('[data-state]').forEach((element) => {
      element.hidden =
        element.dataset.state === 'refresh-error' ||
        element.dataset.state !== state;
    });
  }

  async #fetchStories() {
    this.#abortController?.abort();
    this.#abortController = new AbortController();
    this.#lastFetch = Date.now();
    if (!this.#hasContent) this.#setState('loading');
    this.shadowRoot.querySelector('[data-state="refresh-error"]').hidden = true;

    try {
      const response = await fetch(API_URL, {
        signal: this.#abortController.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.headlines)) throw new Error('Invalid response');
      this.#render(data.headlines);
    } catch (error) {
      if (error.name === 'AbortError') return;
      if (this.#hasContent) {
        this.shadowRoot.querySelector('[data-state="refresh-error"]').hidden =
          false;
      } else {
        this.#setState('error');
      }
    }
  }

  #render(headlines) {
    const fragment = document.createDocumentFragment();
    let count = 0;

    for (const headline of headlines) {
      if (!headline || typeof headline !== 'object') continue;
      const articleUrl = safeHttpUrl(headline.url);
      const publishedDate = new Date(headline.publishedAt);
      if (
        !articleUrl ||
        typeof headline.title !== 'string' ||
        !Number.isFinite(publishedDate.getTime())
      ) {
        continue;
      }

      const sourceSlug = String(headline.sourceSlug || 'unknown');
      const clone = storyTemplate.content.cloneNode(true);
      const source = clone.querySelector('.source');
      source.href = `${WIRE_URL}source/${encodeURIComponent(sourceSlug)}`;
      source.style.setProperty('--source-color', sourceColor(sourceSlug));
      source.setAttribute(
        'aria-label',
        `${headline.sourceName || sourceSlug} on wire`
      );
      if (CONFIG.openLinksInNewTab) source.target = '_blank';
      clone.querySelector('.source-name').textContent =
        headline.sourceName || sourceSlug;

      const title = clone.querySelector('.title');
      title.href = articleUrl;
      title.textContent = headline.title;
      if (CONFIG.openLinksInNewTab) title.target = '_blank';

      const time = clone.querySelector('time');
      time.dateTime = publishedDate.toISOString();
      time.textContent = formatAge(headline.publishedAt);

      const discussionUrl = safeHttpUrl(headline.hnUrl);
      if (discussionUrl) {
        const meta = clone.querySelector('.meta');
        const discussion = document.createElement('a');
        discussion.href = discussionUrl;
        discussion.textContent = 'hn';
        discussion.setAttribute(
          'aria-label',
          `Hacker News discussion: ${headline.title}`
        );
        if (CONFIG.openLinksInNewTab) discussion.target = '_blank';
        meta.appendChild(discussion);
      }

      fragment.appendChild(clone);
      count++;
    }

    this.#hasContent = count > 0;
    if (!this.#hasContent) {
      this.#setState('empty');
      return;
    }

    this.shadowRoot
      .querySelector('[data-state="success"]')
      .replaceChildren(fragment);
    this.#setState('success');
  }
}

customElements.define('newsfeed-component', NewsFeed);
