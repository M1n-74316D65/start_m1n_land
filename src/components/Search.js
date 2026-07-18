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
      background: color-mix(in srgb, var(--color-background) 90%, transparent);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
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
      box-shadow: var(--shadow-panel);
      overflow: hidden;
    }

    .search-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-sm);
      padding: 0.5rem var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .search-panel-label {
      color: var(--color-text-subtle);
      font-family: var(--font-family-mono);
      font-size: var(--font-size-xs);
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .search-workspace {
      color: var(--color-text);
      font-weight: var(--font-weight-bold);
      margin-left: 0.35rem;
    }

    .search-panel-hint {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      color: var(--color-text-muted);
      font-family: var(--font-family-mono);
      font-size: var(--font-size-xs);
      flex-shrink: 0;
    }

    .search-panel-hint kbd {
      font-family: inherit;
      color: var(--color-text-subtle);
    }

    .search-mode {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: 0.45rem var(--space-lg);
      border-bottom: 1px solid var(--color-border-subtle);
      font-family: var(--font-family-mono);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      min-height: 1.75rem;
      box-sizing: border-box;
    }

    .search-mode[data-kind='go'],
    .search-mode[data-kind='search-cmd'],
    .search-mode[data-kind='path'] {
      color: var(--color-text-subtle);
    }

    .search-mode-kind {
      color: var(--color-text);
      font-weight: var(--font-weight-bold);
      flex-shrink: 0;
    }

    .search-mode-detail {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--color-text);
    }

    .input-container {
      position: relative;
      padding: var(--space-lg);
    }

    .input {
      color: var(--color-text);
      font-family: var(--font-family-mono);
      font-size: clamp(0.95rem, 2.5vw, 1.1rem);
      font-weight: var(--font-weight-normal);
      padding: var(--space-sm) 2rem var(--space-sm) var(--space-md);
      text-align: left;
      width: 100%;
      box-sizing: border-box;
      background: var(--color-focus);
      border: none;
      box-shadow: inset 0 0 0 1px var(--color-border);
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

    .clear-btn[visible] {
      opacity: 1;
      pointer-events: auto;
    }

    .clear-btn:hover {
      background: var(--color-focus);
      color: var(--color-text);
    }

    .clear-btn:focus-visible {
      outline: none;
      box-shadow: inset 0 0 0 1px var(--color-accent);
      color: var(--color-text);
    }

    .spinner {
      position: absolute;
      right: calc(var(--space-lg) + var(--space-sm));
      top: 50%;
      transform: translateY(-50%);
      width: 0.9rem;
      height: 0.9rem;
      border: 2px solid var(--color-border);
      border-top-color: var(--color-accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--duration-fast) var(--ease-out);
    }

    .spinner[visible] {
      opacity: 1;
    }

    @keyframes spin {
      to { transform: translateY(-50%) rotate(360deg); }
    }

    .suggestions-wrapper {
      border-top: 1px solid var(--color-border);
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
    }

    .suggestions li + li {
      border-top: 1px solid var(--color-border-subtle);
    }

    .suggestion {
      color: var(--color-text-subtle);
      cursor: pointer;
      font-family: var(--font-family-mono);
      font-size: var(--font-size-sm);
      padding: 0.55rem var(--space-lg);
      width: 100%;
      box-sizing: border-box;
      text-align: left;
      transition: background var(--duration-normal) var(--ease-out);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      outline: 0;
      background: transparent;
      border: none;
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
      background: var(--color-focus);
    }

    .suggestion .key {
      display: inline-block;
      color: var(--color-text-subtle);
      font-weight: var(--font-weight-bold);
      min-width: 1.1rem;
      margin-right: 0.35rem;
    }

    .match {
      color: var(--color-text);
      font-weight: var(--font-weight-bold);
    }
  </style>
  <dialog class="dialog">
    <form autocomplete="off" class="form" method="dialog" spellcheck="false">
      <div class="search-panel">
        <div class="search-panel-header">
          <span class="search-panel-label">Search <span class="search-workspace"></span></span>
          <span class="search-panel-hint"><kbd>esc</kbd> close</span>
        </div>
        <div class="search-mode" data-kind="idle" aria-live="polite">
          <span class="search-mode-kind"></span>
          <span class="search-mode-detail"></span>
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
  #workspaceLabel;
  #modeEl;
  #modeKind;
  #modeDetail;
  #activeWorkspaceId;
  #previousFocus;
  #isLoading = false;
  #affordance;
  #affordanceHost;
  #boundAffordanceClick;
  #boundWorkspaceChange;

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
    this.#workspaceLabel = this.shadowRoot.querySelector('.search-workspace');
    this.#modeEl = this.shadowRoot.querySelector('.search-mode');
    this.#modeKind = this.shadowRoot.querySelector('.search-mode-kind');
    this.#modeDetail = this.shadowRoot.querySelector('.search-mode-detail');
    this.#activeWorkspaceId = workspaceManager.activeWorkspaceId;
    this.#updateWorkspaceLabel();
    this.#updateModeFeedback('');
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
      <span class="search-affordance-label">command, url, or query<span class="search-affordance-cursor" aria-hidden="true"></span></span>
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
    if (this.#affordance && this.#affordance.parentNode) {
      this.#affordance.parentNode.removeChild(this.#affordance);
    }
    this.#affordance = null;
  }

  #removeEventListeners() {
    if (this.#boundWorkspaceChange) {
      window.removeEventListener('workspacechange', this.#boundWorkspaceChange);
    }
  }

  #initializeEventListeners() {
    this.#dialog.addEventListener('click', (e) => {
      if (e.target === this.#dialog) this.#close();
    });

    this.#dialog.addEventListener('close', () => {
      if (this.#previousFocus) this.#previousFocus.focus();
    });

    this.#input.addEventListener('input', () => this.#handleInput());
    this.#input.addEventListener('keydown', (e) => this.#handleKeyDown(e));

    this.#clearBtn.addEventListener('click', () => {
      this.#input.value = '';
      this.#input.focus();
      this.#clearSuggestions();
      this.#updateClearButton();
      this.#updateModeFeedback('');
    });

    this.#suggestions.addEventListener('click', (e) => {
      const suggestion = e.target.closest('.suggestion');
      if (!suggestion) return;
      this.#selectSuggestion(suggestion);
    });

    document.addEventListener('keydown', (e) => this.#handleGlobalKeyDown(e));

    this.#boundWorkspaceChange = (e) => {
      this.#activeWorkspaceId = e.detail.workspaceId;
      this.#updateWorkspaceLabel();
      this.#updateModeFeedback(this.#input.value.trim());
    };
    window.addEventListener('workspacechange', this.#boundWorkspaceChange);
  }

  #updateWorkspaceLabel() {
    const workspace = workspaceManager.activeWorkspace;
    this.#workspaceLabel.textContent = workspace ? `// ${workspace.name}` : '';
  }

  #normalizeKey(key) {
    return CONFIG.commandCaseSensitive ? key : key.toUpperCase();
  }

  #workspaceCommands() {
    return workspaceManager.getCommandsForWorkspace(this.#activeWorkspaceId);
  }

  /** Preview of what Enter will do — mirrors #executeSearch resolution. */
  #resolveMode(value) {
    if (!value) {
      return { kind: 'idle', label: 'type', detail: 'command, url, or query' };
    }

    const commands = this.#workspaceCommands();
    const searchDelimiterIndex = value.indexOf(CONFIG.commandSearchDelimiter);

    if (searchDelimiterIndex !== -1) {
      const key = value.slice(0, searchDelimiterIndex).trim();
      const query = value.slice(searchDelimiterIndex + 1).trim();
      const command = commands.get(this.#normalizeKey(key));
      if (command?.searchTemplate && query) {
        return {
          kind: 'search-cmd',
          label: 'search',
          detail: `${command.name} · ${query}`,
        };
      }
    }

    const pathDelimiterIndex = value.indexOf(CONFIG.commandPathDelimiter);
    if (pathDelimiterIndex !== -1 && searchDelimiterIndex === -1) {
      const key = value.slice(0, pathDelimiterIndex).trim();
      const path = value.slice(pathDelimiterIndex + 1).trim();
      const command = commands.get(this.#normalizeKey(key));
      if (command?.url && path) {
        return {
          kind: 'path',
          label: 'path',
          detail: `${command.name} / ${path}`,
        };
      }
    }

    const directCommand = commands.get(this.#normalizeKey(value));
    if (directCommand) {
      return {
        kind: 'go',
        label: 'go',
        detail: directCommand.name,
      };
    }

    if (this.#isUrl(value)) {
      return {
        kind: 'url',
        label: 'open',
        detail: value.startsWith('http') ? value : `https://${value}`,
      };
    }

    return {
      kind: 'search',
      label: 'search',
      detail: value,
    };
  }

  #updateModeFeedback(value) {
    const mode = this.#resolveMode(value);
    this.#modeEl.dataset.kind = mode.kind;
    this.#modeKind.textContent = mode.label;
    this.#modeDetail.textContent = mode.detail;
  }

  #handleGlobalKeyDown(event) {
    // Dialog open: ignore. Shadow retargeting makes event.target the host, not the input.
    if (this.#dialog.open) return;
    if (this.#isEditableTarget(event)) return;

    if (event.key === '/') {
      event.preventDefault();
      this.#open('');
      return;
    }

    if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault();
      this.#open(event.key);
    }
  }

  #isEditableTarget(event) {
    const path =
      typeof event.composedPath === 'function' ? event.composedPath() : [];
    for (const el of path) {
      if (!el || el.nodeType !== 1) continue;
      const tag = el.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable) {
        return true;
      }
    }
    const t = event.target;
    if (!t || !t.tagName) return false;
    return (
      t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable
    );
  }

  #open(initialValue) {
    if (this.#dialog.open) return;
    this.#previousFocus = document.activeElement;
    this.#dialog.showModal();
    this.#input.value = initialValue;
    this.#input.focus();
    this.#updateClearButton();
    this.#updateModeFeedback(initialValue.trim());
    if (initialValue) {
      this.#handleInput();
    } else {
      this.#clearSuggestions();
    }
  }

  #close() {
    if (!this.#dialog.open) return;
    this.#dialog.close();
  }

  #handleInput() {
    const value = this.#input.value.trim();
    this.#updateClearButton();
    this.#updateModeFeedback(value);

    if (!value) {
      this.#clearSuggestions();
      return;
    }

    this.#fetchSuggestions(value);
  }

  #updateClearButton() {
    const hasValue = this.#input.value.length > 0;
    this.#clearBtn.toggleAttribute('visible', hasValue && !this.#isLoading);
  }

  #handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#close();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const activeSuggestion = this.#suggestions.querySelector(
        '.suggestion:focus-visible, .suggestion:focus'
      );
      if (activeSuggestion) {
        this.#selectSuggestion(activeSuggestion);
      } else {
        this.#executeSearch(this.#input.value.trim());
      }
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.#navigateSuggestions(event.key === 'ArrowDown' ? 1 : -1);
    }
  }

  #navigateSuggestions(direction) {
    const suggestions = Array.from(
      this.#suggestions.querySelectorAll('.suggestion')
    );
    if (suggestions.length === 0) return;

    const activeIndex = suggestions.findIndex(
      (s) => s === this.shadowRoot.activeElement || s === document.activeElement
    );
    let nextIndex;

    if (activeIndex === -1) {
      nextIndex = direction > 0 ? 0 : suggestions.length - 1;
    } else {
      nextIndex = activeIndex + direction;
      if (nextIndex < 0) nextIndex = suggestions.length - 1;
      if (nextIndex >= suggestions.length) nextIndex = 0;
    }

    suggestions[nextIndex].focus();
  }

  #clearSuggestions() {
    this.#suggestions.replaceChildren();
  }

  #setLoading(isLoading) {
    this.#isLoading = isLoading;
    this.#spinner.toggleAttribute('visible', isLoading);
    this.#updateClearButton();
  }

  async #fetchSuggestions(value) {
    const workspaceCommands = this.#workspaceCommands();
    const matchingCommands = this.#findMatchingCommands(
      value,
      workspaceCommands
    );
    const commandSuggestions = matchingCommands.slice(
      0,
      CONFIG.suggestionLimit
    );

    const query = this.#extractQuery(value);
    const searchSuggestions = query
      ? await this.#fetchDuckDuckGoSuggestions(query)
      : [];

    const allSuggestions = [
      ...commandSuggestions,
      ...searchSuggestions.slice(
        0,
        Math.max(0, CONFIG.suggestionLimit - commandSuggestions.length)
      ),
    ];

    this.#renderSuggestions(allSuggestions, value);
  }

  #findMatchingCommands(value, workspaceCommands) {
    const lowerValue = value.toLowerCase();
    const matches = [];

    for (const [key, command] of workspaceCommands.entries()) {
      const keyLower = key.toLowerCase();
      const nameLower = command.name.toLowerCase();

      if (keyLower === lowerValue || nameLower === lowerValue) {
        matches.unshift({
          type: 'command',
          key,
          name: command.name,
          url: command.url,
          searchTemplate: command.searchTemplate,
          exact: true,
        });
      } else if (
        keyLower.startsWith(lowerValue) ||
        nameLower.includes(lowerValue)
      ) {
        matches.push({
          type: 'command',
          key,
          name: command.name,
          url: command.url,
          searchTemplate: command.searchTemplate,
          exact: false,
        });
      }
    }

    return matches;
  }

  #extractQuery(value) {
    const delimiterIndex = value.indexOf(CONFIG.commandSearchDelimiter);
    if (delimiterIndex === -1) return value;
    return value.slice(delimiterIndex + 1).trim();
  }

  async #fetchDuckDuckGoSuggestions(query) {
    if (!query) return [];

    try {
      this.#setLoading(true);
      const response = await fetch(
        `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return (data[1] || []).map((suggestion) => ({
        type: 'search',
        query: suggestion,
      }));
    } catch (error) {
      console.warn('Failed to fetch suggestions:', error);
      return [];
    } finally {
      this.#setLoading(false);
    }
  }

  #renderSuggestions(suggestions, inputValue) {
    this.#clearSuggestions();
    if (suggestions.length === 0) return;

    const fragment = document.createDocumentFragment();

    suggestions.forEach((suggestion) => {
      const clone = suggestionTemplate.content.cloneNode(true);
      const button = clone.querySelector('.suggestion');
      button.dataset.type = suggestion.type;

      if (suggestion.type === 'command') {
        button.dataset.key = suggestion.key;
        button.dataset.url = suggestion.url;
        if (suggestion.searchTemplate) {
          button.dataset.searchTemplate = suggestion.searchTemplate;
        }
        button.innerHTML = `<span class="key">${suggestion.key}</span> ${this.#highlightMatch(suggestion.name, inputValue)}`;
      } else {
        button.dataset.query = suggestion.query;
        button.textContent = suggestion.query;
      }

      fragment.appendChild(clone);
    });

    this.#suggestions.appendChild(fragment);
  }

  #highlightMatch(text, query) {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1 || !query) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);

    const matchSpan = matchTemplate.content
      .cloneNode(true)
      .querySelector('.match');
    matchSpan.textContent = match;

    return `${before}${matchSpan.outerHTML}${after}`;
  }

  #selectSuggestion(suggestion) {
    const type = suggestion.dataset.type;

    if (type === 'command') {
      const key = suggestion.dataset.key;
      const url = suggestion.dataset.url;
      UsageTracker.recordUsage(key);
      this.#navigateTo(url);
    } else {
      const query = suggestion.dataset.query;
      this.#executeSearch(query);
    }
  }

  #executeSearch(value) {
    if (!value) return;

    const workspaceCommands = this.#workspaceCommands();
    const searchDelimiterIndex = value.indexOf(CONFIG.commandSearchDelimiter);

    if (searchDelimiterIndex !== -1) {
      const key = value.slice(0, searchDelimiterIndex).trim();
      const query = value.slice(searchDelimiterIndex + 1).trim();
      const normKey = this.#normalizeKey(key);
      const command = workspaceCommands.get(normKey);

      if (command && command.searchTemplate) {
        UsageTracker.recordUsage(normKey);
        this.#navigateTo(
          command.url +
            command.searchTemplate.replace('{}', encodeURIComponent(query))
        );
        return;
      }
    }

    const pathDelimiterIndex = value.indexOf(CONFIG.commandPathDelimiter);
    if (pathDelimiterIndex !== -1) {
      const key = value.slice(0, pathDelimiterIndex).trim();
      const path = value.slice(pathDelimiterIndex + 1).trim();
      const normKey = this.#normalizeKey(key);
      const command = workspaceCommands.get(normKey);

      if (command && command.url) {
        UsageTracker.recordUsage(normKey);
        const separator = command.url.endsWith('/') ? '' : '/';
        this.#navigateTo(`${command.url}${separator}${path}`);
        return;
      }
    }

    const normValue = this.#normalizeKey(value);
    const directCommand = workspaceCommands.get(normValue);
    if (directCommand) {
      UsageTracker.recordUsage(normValue);
      this.#navigateTo(directCommand.url);
      return;
    }

    if (this.#isUrl(value)) {
      this.#navigateTo(value.startsWith('http') ? value : `https://${value}`);
      return;
    }

    this.#navigateTo(
      CONFIG.defaultSearchTemplate.replace('{}', encodeURIComponent(value))
    );
  }

  #isUrl(value) {
    return /^(https?:\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i.test(
      value
    );
  }

  #navigateTo(url) {
    this.#close();
    if (CONFIG.openLinksInNewTab) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  }
}

customElements.define('search-component', Search);
