import { workspaceManager } from '../lib/WorkspaceManager.js';
import { UsageTracker } from '../lib/UsageTracker.js';
import { CONFIG } from '../config.js';

const WIDE_TILE_COUNT = 2;

const commandsTemplate = document.createElement('template');
commandsTemplate.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      min-width: 0;
    }
    .commands-shell {
      width: 100%;
      min-width: 0;
    }
    .commands {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: var(--space-sm) var(--space-lg);
      list-style: none;
      margin: 0;
      padding: 0;
      transition: opacity var(--duration-normal) var(--ease-out);
    }
    .commands > li {
      min-width: 0;
    }
    .commands.switching {
      opacity: 0.55;
    }
    .command {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      min-height: var(--control-height);
      height: 100%;
      padding: var(--space-md);
      box-sizing: border-box;
      text-decoration: none;
      color: var(--color-text);
      border-bottom: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
    }
    .command.wide {
      background: var(--color-surface);
      border-color: transparent;
    }
    .command:hover,
    .command:active {
      background: var(--color-focus);
    }
    .command:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
      background: var(--color-focus);
    }
    .key {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--key-size);
      height: var(--key-size);
      flex-shrink: 0;
      color: var(--color-text-muted);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font: var(--font-size-xs) var(--font-family-mono);
      text-transform: uppercase;
    }
    .name {
      min-width: 0;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: var(--font-size-md);
    }
    .command.wide::after {
      content: '↗';
      color: var(--color-accent);
      font-size: var(--font-size-lg);
    }
    .command:hover .key {
      color: var(--color-accent);
      border-color: var(--color-accent);
    }
    @media (max-width: 899px) {
      .commands {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
    @media (max-width: 599px) {
      .commands {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-sm);
      }
      .command {
        gap: var(--space-sm);
        padding-inline: var(--space-sm);
      }
      .name {
        font-size: var(--font-size-sm);
      }
      .command.wide::after {
        display: none;
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
  <div class="commands-shell">
    <nav aria-label="Workspace shortcuts">
      <menu class="commands"></menu>
    </nav>
  </div>
`;

const commandTemplate = document.createElement('template');
commandTemplate.innerHTML = `
  <li>
    <a class="command" rel="noopener noreferrer">
      <span class="key"></span>
      <span class="name"></span>
    </a>
  </li>
`;

export class Commands extends HTMLElement {
  #activeWorkspaceId;
  #boundWorkspaceChange;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(commandsTemplate.content.cloneNode(true));
    this.#activeWorkspaceId = workspaceManager.activeWorkspaceId;
    this.#initializeEventListeners();
  }

  connectedCallback() {
    this.render();
  }

  #initializeEventListeners() {
    this.#boundWorkspaceChange = (e) => {
      this.#activeWorkspaceId = e.detail.workspaceId;
      this.rerender();
    };
    window.addEventListener('workspacechange', this.#boundWorkspaceChange);
  }

  disconnectedCallback() {
    if (this.#boundWorkspaceChange) {
      window.removeEventListener('workspacechange', this.#boundWorkspaceChange);
    }
  }

  render() {
    const commandsContainer = this.shadowRoot.querySelector('.commands');
    const fragment = this.createCommandsFragment();
    const count = fragment.children.length;

    if (count === 0) {
      commandsContainer.style.display = 'none';
      return;
    }

    commandsContainer.appendChild(fragment);
  }

  rerender() {
    const commandsContainer = this.shadowRoot.querySelector('.commands');
    if (!commandsContainer) return;

    commandsContainer.classList.add('switching');

    requestAnimationFrame(() => {
      const fragment = this.createCommandsFragment();
      const count = fragment.children.length;

      if (count === 0) {
        commandsContainer.style.display = 'none';
        commandsContainer.classList.remove('switching');
        return;
      }

      commandsContainer.replaceChildren(fragment);
      commandsContainer.style.display = 'grid';

      commandsContainer.style.animation = 'none';
      commandsContainer.offsetHeight;
      commandsContainer.style.animation = '';

      requestAnimationFrame(() => {
        commandsContainer.classList.remove('switching');
      });
    });
  }

  /** Top N keys: recent first, fill with frequent. */
  #getWideKeys(commandKeys) {
    const wide = [];
    const seen = new Set();

    for (const { commandKey } of UsageTracker.getRecentCommands(
      commandKeys,
      WIDE_TILE_COUNT
    )) {
      if (!seen.has(commandKey)) {
        wide.push(commandKey);
        seen.add(commandKey);
      }
    }

    if (wide.length < WIDE_TILE_COUNT) {
      for (const { commandKey } of UsageTracker.getFrequentCommands(
        commandKeys,
        WIDE_TILE_COUNT * 2
      )) {
        if (!seen.has(commandKey)) {
          wide.push(commandKey);
          seen.add(commandKey);
          if (wide.length >= WIDE_TILE_COUNT) break;
        }
      }
    }

    return wide;
  }

  createCommandsFragment() {
    const fragment = document.createDocumentFragment();
    const workspaceCommands = workspaceManager.getCommandsForWorkspace(
      this.#activeWorkspaceId
    );

    const entries = [];
    for (const [key, command] of workspaceCommands.entries()) {
      if (!command.name || !command.url) continue;
      entries.push([key, command]);
    }

    const keys = entries.map(([key]) => key);
    const wideKeys = this.#getWideKeys(keys);
    const wideSet = new Set(wideKeys);

    const ordered = [
      ...wideKeys
        .map((key) => entries.find(([k]) => k === key))
        .filter(Boolean),
      ...entries.filter(([key]) => !wideSet.has(key)),
    ];

    for (const [key, { name, url }] of ordered) {
      const commandClone = this.createCommandElement(
        key,
        name,
        url,
        wideSet.has(key)
      );
      fragment.appendChild(commandClone);
    }
    return fragment;
  }

  createCommandElement(key, name, url, isWide = false) {
    const clone = commandTemplate.content.cloneNode(true);
    const li = clone.querySelector('li');
    const command = clone.querySelector('.command');
    command.href = url;
    if (CONFIG.openLinksInNewTab) command.target = '_blank';
    if (isWide) {
      li.classList.add('wide');
      command.classList.add('wide');
      command.setAttribute('data-featured', 'true');
    }
    command.addEventListener('click', () => {
      UsageTracker.recordUsage(key);
    });
    clone.querySelector('.key').innerText = key;
    clone.querySelector('.name').innerText = name;
    return clone;
  }
}

customElements.define('commands-component', Commands);
