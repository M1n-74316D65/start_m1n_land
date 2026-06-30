import { workspaceManager } from '../lib/WorkspaceManager.js';
import { UsageTracker } from '../lib/UsageTracker.js';
import { CONFIG } from '../config.js';

const searchTemplate = document.createElement('template');
searchTemplate.innerHTML = `
  <style>
    :host {
      position: fixed;
      inset: 0;
      z-index: 100;
      pointer-events: none;
    }

    input,
    button {
      appearance: none;
      background: transparent;
      border: 0;
      display: block;
      outline: 0;
      font-family: inherit;
    }

    .dialog {
      align-items: center;
      background: transparent;
      border: none;
      display: none;
      flex-direction: column;
      height: 100%;
      justify-content: center;
      left: 0;
      padding: var(--layout-inset-y) var(--layout-inset-x);
      top: 0;
      width: 100%;
      opacity: 0;
      transform: translateY(8px);
      transition:
        opacity var(--duration-slow) var(--ease-out),
        transform var(--duration-slow) var(--ease-out);
    }

    .dialog::backdrop {
      background: color-mix(in srgb, var(--color-background) 72%, transparent);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      opacity: 0;
      transition: opacity var(--duration-normal) var(--ease-out);
    }

    .dialog[open]::backdrop {
      opacity: 1;
    }

    .dialog[open] {
      display: flex;
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    @media (prefers-reduced-motion: reduce) {
      .dialog,
      .dialog[open] {
        transform: none;
      }

      .suggestion {
        animation: none;
        opacity: 1;
      }
    }

    .form {
      width: 100%;
      max-width: var(--layout-max);
      margin: 0;
    }

    .search-panel {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--zone-radius);
      box-shadow: var(--shadow-panel);
      overflow: hidden;
    }

    .search-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-sm);
      padding: var(--zone-pad-block) var(--zone-pad-inline);
      border-bottom: 1px solid var(--color-border-subtle);
    }

    .search-panel-label {
      color: var(--color-text-subtle);
      font-family: var(--font-family-mono);
      font-size: 0.68rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .search-panel-hint {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      color: var(--color-text-muted);
      font-family: var(--font-family-mono);
      font-size: 0.62rem;
    }

    .search-panel-hint kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.2rem;
      padding: 0.05rem 0.3rem;
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-sm);
      background: var(--color-focus);
      color: var(--color-text-subtle);
      font-family: inherit;
      font-size: 0.58rem;
      line-height: 1.3;
    }

    .input-container {
      position: relative;
      padding: var(--zone-pad-block) var(--zone-pad-inline);
    }

    .input {
      color: var(--color-text);
      font-family: var(--font-family-mono);
      font-size: clamp(0.9rem, 2.5vw, 1.05rem);
      font-weight: var(--font-weight-normal);
      padding: var(--space-sm) 2rem var(--space-sm) var(--space-md);
      text-align: left;
      width: 100%;
      box-sizing: border-box;
      letter-spacing: 0.01em;
      background: var(--color-focus);
      border: none;
      border-radius: var(--key-radius);
      box-shadow: inset 0 0 0 1px var(--color-border-subtle);
      transition:
        box-shadow var(--duration-normal) var(--ease-out),
        background var(--duration-normal) var(--ease-out);
    }

    .input:focus {
      background: var(--color-surface-elevated);
      box-shadow: inset 0 0 0 1px var(--color-accent);
      outline: none;
    }

    .input::placeholder {
      color: var(--color-text-muted);
    }

    .clear-btn {
      position: absolute;
      right: calc(var(--space-lg) + var(--space-sm));
      top: 50%;
      transform: translateY(-50%);
      width: 1.35rem;
      height: 1.35rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--key-radius);
      color: var(--color-text-muted);
      background: transparent;
      cursor: pointer;
      opacity: 0;
      pointer-events: none;
      transition:
        opacity var(--duration-fast) var(--ease-out),
        background var(--duration-fast) var(--ease-out),
        color var(--duration-fast) var(--ease-out);
    }

    .clear-btn:visible {
      opacity: 1;
      pointer-events: auto;
    }

    .clear-btn:hover {
      background: var(--color-accent-subtle);
      color: var(--color-accent);
    }

    .clear-btn:active {
      transform: translateY(-50%) scale(0.95);
    }

    .spinner {
      position: absolute;
      right: calc(var(--space-lg) + var(--space-sm));
      top: 50%;
      transform: translateY(-50%);
      width: 0.9rem;
      height: 0.9rem;
      border: 2px solid var(--color-border-subtle);
      border-top-color: var(--color-accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--duration-fast) var(--ease-out);
    }

    .spinner:visible {
      opacity: 1;
    }

    @keyframes spin {
      to { transform: translateY(-50%) rotate(360deg); }
    }

    .suggestions-wrapper {
      border-top: 1px solid var(--color-border-subtle);
      min-height: 0;
    }

    .suggestions-wrapper:has(.suggestion) {
      min-height: 2.5rem;
    }

    .suggestions {
      display: flex;
      flex-direction: column;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 1px;
      background: var(--color-border-subtle);
    }

    .suggestion {
      color: var(--color-text-subtle);
      cursor: pointer;
      font-family: var(--font-family-mono);
      font-size: 0.75rem;
      padding: 0.5rem var(--space-lg);
      width: 100%;
      box-sizing: border-box;
      text-align: left;
      transition: background var(--duration-normal) var(--ease-out);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      outline: 0;
      background: var(--color-surface-elevated);
      border: none;
      border-radius: 0;
      letter-spacing: 0.01em;
      opacity: 0;
      animation: suggestionIn var(--duration-normal) var(--ease-out) forwards;
      touch-action: manipulation;
    }

    .suggestion:nth-child(1) { animation-delay: 0.03s; }
    .suggestion:nth-child(2) { animation-delay: 0.06s; }
    .suggestion:nth-child(3) { animation-delay: 0.09s; }
    .suggestion:nth-child(4) { animation-delay: 0.12s; }

    @keyframes suggestionIn {
      to { opacity: 1; }
    }

    .suggestion:focus-visible,
    .suggestion:hover {
      color: var(--color-text);
      background: var(--color-focus);
    }

    .suggestion:focus-visible {
      box-shadow: inset 0 0 0 1px var(--color-accent);
      outline: none;
    }

    .suggestion:active {
      background: var(--color-accent-subtle);
    }

    .match {
      color: var(--color-accent);
      font-weight: var(--font-weight-bold);
    }
  </style>
  <dialog class="dialog">
    <form autocomplete="off" class="form" method="dialog" spellcheck="false">
      <div class="search-panel">
        <div class="search-panel-header">
          <span class="search-panel-label">Search</span>
          <span class="search-panel-hint"><kbd>esc</kbd> close</span>
        </div>
        <div class="input-container">
          <input
            class="input"
            aria-label="Search"
            title="search"
            type="text"
            placeholder="Command, URL, or query"
          />
          <button type="button" class="clear-btn" aria-label="Clear">×</button>
          <div class="spinner" aria-hidden="true"></div>
        </div>
        <div class="suggestions-wrapper">
          <menu class="suggestions"></menu>
        </div>
      </div>
    </form>
  </dialog>
`;

const suggestionTemplate = document.createElement('template');
suggestionTemplate.innerHTML = `
  <li>
    <button class="suggestion" type="button"></button>
  </li>
`;

const matchTemplate = document.createElement('template');
matchTemplate.innerHTML = `<span class="match"></span>`;

export class Search extends HTMLElement {
  #dialog;
  #form;
  #input;
  #suggestions;
  #clearBtn;
  #spinner;
  #activeWorkspaceId;
  #previousFocus;
  #isLoading = false;
  #affordance;
  #affordanceHost;
  #boundAffordanceClick;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(searchTemplate.content.cloneNode(true));
    this.#dialog = this.shadowRoot.querySelector('.dialog');
    this.#form = this.shadowRoot.querySelector('.form');
    this.#input = this.shadowRoot.querySelector('.input');
    this.#suggestions = this.shadowRoot.querySelector('.suggestions');
    this.#clearBtn = this.shadowRoot.querySelector('.clear-btn');
    this.#spinner = this.shadowRoot.querySelector('.spinner');
    this.#activeWorkspaceId = workspaceManager.activeWorkspaceId;
    this.#initializeEventListeners();
  }

  connectedCallback() {
    this.#mountAffordance();
  }

  disconnectedCallback() {
    this.#removeEventListeners();
    this.#unmountAffordance();
  }

  #mountAffordance() {
    this.#affordanceHost = document.getElementById('search-affordance');
    if (!this.#affordanceHost || this.#affordance) return;

    this.#affordance = document.createElement('button');
    this.#affordance.type = 'button';
    this.#affordance.className = 'search-affordance';
    this.#affordance.setAttribute('aria-label', 'Open search');
    this.#affordance.innerHTML = `
      <span class="search-affordance-label">Search or go to URL</span>
      <span class="search-affordance-hint"><kbd>/</kbd></span>
    `;

    this.#boundAffordanceClick = () => this.#open('');
    this.#affordance.addEventListener('click', this.#boundAffordanceClick);
    this.#affordanceHost.appendChild(this.#affordance);
  }

  #unmountAffordance() {
    if (this.#affordance && this.#boundAffordanceClick) {
      this.#affordance.removeEventListener('click', this.#boundAffordanceClick);
    }
    if (this.#affordanceHost) {
      this.#affordanceHost.replaceChildren();
    }
    this.#affordance = null;
    this.#affordanceHost = null;
    this.#boundAffordanceClick = null;
  }

  #boundSubmit = this.#onSubmit.bind(this);
  #boundInput = Search.#debounce(this.#onInput.bind(this), 300);
  #boundSuggestionClick = this.#onSuggestionClick.bind(this);
  #boundKeydown = this.#onKeydown.bind(this);
  #boundClear = this.#onClear.bind(this);
  #boundWorkspaceChange = (e) => {
    this.#activeWorkspaceId = e.detail.workspaceId;
  };

  #initializeEventListeners() {
    this.#form.addEventListener('submit', this.#boundSubmit, false);
    this.#input.addEventListener('input', this.#boundInput);
    this.#suggestions.addEventListener('click', this.#boundSuggestionClick);
    this.#clearBtn.addEventListener('click', this.#boundClear);
    document.addEventListener('keydown', this.#boundKeydown);
    window.addEventListener('workspacechange', this.#boundWorkspaceChange);
  }

  #removeEventListeners() {
    this.#form.removeEventListener('submit', this.#boundSubmit);
    this.#input.removeEventListener('input', this.#boundInput);
    this.#suggestions.removeEventListener('click', this.#boundSuggestionClick);
    this.#clearBtn.removeEventListener('click', this.#boundClear);
    document.removeEventListener('keydown', this.#boundKeydown);
    window.removeEventListener('workspacechange', this.#boundWorkspaceChange);
  }

  static #debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  static async #fetchDuckDuckGoSuggestions(search) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(
        `https://duckduckgo.com/ac/?q=${encodeURIComponent(search)}&type=list`,
        {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) return [];

      const data = await response.json();

      if (!Array.isArray(data) || data.length < 2) return [];

      const suggestions = data[1];
      if (!Array.isArray(suggestions)) return [];

      return suggestions
        .filter((item) => item.toLowerCase() !== search.toLowerCase())
        .slice(0, CONFIG.suggestionLimit);
    } catch {
      return [];
    }
  }

  static #formatSearchUrl(template, search) {
    return template.replace(/{}/g, encodeURIComponent(search));
  }

  static #hasProtocol(s) {
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(s);
  }

  static #isUrl(s) {
    return /^(https?:\/\/)?[\w-]+(\.[\w-]+)+/.test(s);
  }

  static #compareKey(key) {
    return CONFIG.commandCaseSensitive ? key : key.toLowerCase();
  }

  static #isEditableTarget(target) {
    if (!(target instanceof HTMLElement)) return false;

    if (target.isContentEditable) return true;

    return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
  }

  static #isPrintableKey(event) {
    return (
      event.key.length === 1 &&
      event.key !== ' ' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    );
  }

  static #getCommandWithKey(key, workspaceCommands) {
    if (CONFIG.commandCaseSensitive) {
      const command = workspaceCommands.get(key);
      return command ? { command, key } : undefined;
    } else {
      const lowerKey = key.toLowerCase();
      for (const [cmdKey, value] of workspaceCommands) {
        if (cmdKey.toLowerCase() === lowerKey) {
          return { command: value, key: cmdKey };
        }
      }
      return undefined;
    }
  }

  #parseQuery(raw) {
    const workspaceCommands = workspaceManager.getCommandsForWorkspace(
      this.#activeWorkspaceId
    );
    const query = raw.trim();
    const compareQuery = Search.#compareKey(query);

    if (Search.#isUrl(query)) {
      const url = Search.#hasProtocol(query) ? query : `https://${query}`;
      return { query, url };
    }

    const result = Search.#getCommandWithKey(query, workspaceCommands);
    if (result) {
      return { key: result.key, query, url: result.command.url };
    }

    const [commandPart, searchPart] = query.split(
      new RegExp(`${CONFIG.commandSearchDelimiter}(.*)`)
    );
    const commandPartResult = Search.#getCommandWithKey(
      commandPart,
      workspaceCommands
    );
    if (commandPartResult) {
      const search = searchPart ? searchPart.trim() : '';
      const template = new URL(
        commandPartResult.command.searchTemplate ?? '',
        commandPartResult.command.url
      );
      const url = Search.#formatSearchUrl(decodeURI(template.href), search);
      return { key: commandPartResult.key, query, search, url };
    }

    const [pathKey, path] = query.split(
      new RegExp(`${CONFIG.commandPathDelimiter}(.*)`)
    );
    const pathKeyResult = Search.#getCommandWithKey(pathKey, workspaceCommands);
    if (pathKeyResult) {
      const url = `${new URL(pathKeyResult.command.url).origin}/${path || ''}`;
      return { key: pathKeyResult.key, path, query, url };
    }

    const url = Search.#formatSearchUrl(CONFIG.defaultSearchTemplate, query);
    return { query, search: query, url };
  }

  #setLoading(loading) {
    this.#isLoading = loading;
    this.#spinner.toggleAttribute('visible', loading);
  }

  #updateClearBtn() {
    this.#clearBtn.toggleAttribute('visible', this.#input.value.length > 0);
  }

  #close() {
    this.#input.value = '';
    this.#updateClearBtn();
    this.#setLoading(false);
    this.#input.blur();
    this.#dialog.style.opacity = '0';
    this.#dialog.style.transform = 'translateY(6px)';

    setTimeout(() => {
      this.#dialog.close();
      this.#dialog.style.opacity = '';
      this.#dialog.style.transform = '';
      this.#suggestions.replaceChildren();
      if (
        this.#previousFocus &&
        this.#previousFocus.isConnected &&
        typeof this.#previousFocus.focus === 'function'
      ) {
        this.#previousFocus.focus();
        this.#previousFocus = null;
      }
    }, 150);
  }

  #open(initialValue = '') {
    this.#previousFocus = document.activeElement;
    if (!this.#dialog.open) {
      this.#dialog.showModal();
    }

    this.#input.value = initialValue;
    this.#updateClearBtn();
    this.#input.focus();

    if (initialValue) {
      this.#input.setSelectionRange(initialValue.length, initialValue.length);
      this.#onInput();
    } else {
      this.#suggestions.replaceChildren();
    }
  }

  #execute(query) {
    const parsedQuery = this.#parseQuery(query);
    if (parsedQuery.key) {
      UsageTracker.recordUsage(parsedQuery.key);
    }
    const target = CONFIG.openLinksInNewTab ? '_blank' : '_self';
    window.open(parsedQuery.url, target, 'noopener noreferrer');
    this.#close();
  }

  #focusNextSuggestion(previous = false) {
    const active = this.shadowRoot.activeElement;
    let nextIndex;

    if (active.dataset.index) {
      const activeIndex = Number(active.dataset.index);
      nextIndex = previous ? activeIndex - 1 : activeIndex + 1;
    } else {
      nextIndex = previous ? this.#suggestions.childElementCount - 1 : 0;
    }

    const next = this.#suggestions.children[nextIndex];
    if (next) next.querySelector('.suggestion').focus();
    else this.#input.focus();
  }

  async #onInput() {
    this.#updateClearBtn();

    const workspaceCommands = workspaceManager.getCommandsForWorkspace(
      this.#activeWorkspaceId
    );
    const inputValue = this.#input.value;
    const parsedQuery = this.#parseQuery(inputValue);

    if (!parsedQuery.query) {
      this.#close();
      return;
    }

    const result = Search.#getCommandWithKey(
      parsedQuery.key || parsedQuery.query,
      workspaceCommands
    );
    let suggestions = result?.command?.suggestions ?? [];

    if (parsedQuery.search && suggestions.length < CONFIG.suggestionLimit) {
      this.#setLoading(true);
      const ddgSuggestions = await Search.#fetchDuckDuckGoSuggestions(
        parsedQuery.search
      );

      // Re-check input hasn't changed during async fetch
      if (
        Search.#compareKey(this.#input.value) !== Search.#compareKey(inputValue)
      ) {
        this.#setLoading(false);
        return;
      }

      suggestions = suggestions.concat(
        parsedQuery.key
          ? ddgSuggestions.map(
              (s) => `${parsedQuery.key}${CONFIG.commandSearchDelimiter}${s}`
            )
          : ddgSuggestions
      );
      this.#setLoading(false);
    }

    const filteredSuggestions = CONFIG.commandCaseSensitive
      ? suggestions
      : suggestions.filter((s) =>
          Search.#compareKey(s).startsWith(
            Search.#compareKey(parsedQuery.query)
          )
        );

    this.#renderSuggestions(filteredSuggestions, parsedQuery.query);
  }

  #onKeydown(e) {
    if (!this.#dialog.open) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (Search.#isEditableTarget(e.target)) return;

      if (e.key === '/') {
        e.preventDefault();
        this.#open('');
        return;
      }

      if (!Search.#isPrintableKey(e)) return;

      e.preventDefault();
      this.#open(e.key);
      return;
    }

    if (e.key === 'Escape') {
      if (this.#input.value) {
        this.#onClear();
      } else {
        this.#close();
      }
      return;
    }

    const modifierPrefixedKey = this.#getModifierPrefixedKey(e);

    if (/^(ArrowDown|Tab|ctrl-n)$/.test(modifierPrefixedKey)) {
      e.preventDefault();
      this.#focusNextSuggestion();
      return;
    }

    if (/^(ArrowUp|ctrl-p|shift-Tab)$/.test(modifierPrefixedKey)) {
      e.preventDefault();
      this.#focusNextSuggestion(true);
    }
  }

  #getModifierPrefixedKey(e) {
    const alt = e.altKey ? 'alt-' : '';
    const ctrl = e.ctrlKey ? 'ctrl-' : '';
    const meta = e.metaKey ? 'meta-' : '';
    const shift = e.shiftKey ? 'shift-' : '';
    return `${alt}${ctrl}${meta}${shift}${e.key}`;
  }

  #onClear() {
    this.#input.value = '';
    this.#updateClearBtn();
    this.#suggestions.replaceChildren();
    this.#input.focus();
  }

  #onSubmit() {
    this.#execute(this.#input.value);
  }

  #onSuggestionClick(e) {
    const ref = e.target.closest('.suggestion');
    if (!ref) return;
    this.#execute(ref.dataset.suggestion);
  }

  #renderSuggestions(suggestions, query) {
    this.#suggestions.replaceChildren();

    const fragment = document.createDocumentFragment();
    suggestions
      .slice(0, CONFIG.suggestionLimit)
      .forEach((suggestion, index) => {
        const clone = suggestionTemplate.content.cloneNode(true);
        const ref = clone.querySelector('.suggestion');
        ref.dataset.index = index;
        ref.dataset.suggestion = suggestion;

        const compareQuery = Search.#compareKey(query);
        const compareSuggestion = Search.#compareKey(suggestion);
        const matchIndex = compareSuggestion.indexOf(compareQuery);

        if (matchIndex !== -1) {
          const pre = suggestion.slice(0, matchIndex);
          const match = suggestion.slice(matchIndex, matchIndex + query.length);
          const post = suggestion.slice(matchIndex + query.length);

          const matchClone = matchTemplate.content.cloneNode(true);
          const matchRef = matchClone.querySelector('.match');
          matchRef.textContent = match;

          ref.append(
            document.createTextNode(pre),
            matchClone,
            document.createTextNode(post)
          );
        } else {
          ref.textContent = suggestion;
        }

        fragment.appendChild(clone);
      });

    this.#suggestions.appendChild(fragment);
  }
}

customElements.define('search-component', Search);
