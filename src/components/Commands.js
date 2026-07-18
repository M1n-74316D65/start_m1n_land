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
      max-width: 100%;
    }

    .commands-shell {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: 0;
    }

    .commands {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
      gap: var(--space-xs);
      list-style: none;
      margin: 0;
      padding: 0;
      width: 100%;
      opacity: 0;
      transform: translateY(2px);
      animation: gridFadeIn var(--duration-slow) var(--ease-out) forwards;
      transition: opacity var(--duration-normal) var(--ease-out);
    }

    .commands > li {
      min-width: 0;
    }

    .commands.switching {
      opacity: 0.55;
    }

    @keyframes gridFadeIn {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .command {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      outline: 0;
      position: relative;
      text-decoration: none;
      min-height: 2.4rem;
      min-width: 0;
      width: 100%;
      height: 100%;
      padding: 0 var(--space-md);
      box-sizing: border-box;
      background: var(--color-surface);
      border: none;
      transition:
        background var(--duration-fast) var(--ease-out),
        color var(--duration-fast) var(--ease-out),
        box-shadow var(--duration-fast) var(--ease-out);
    }

    .command.wide {
      min-height: 2.7rem;
    }

    .command:hover {
      background: var(--color-focus);
    }

    .command:focus-visible {
      outline: none;
      background: var(--color-focus);
      box-shadow: inset 0 0 0 1px var(--color-accent);
      z-index: 1;
    }

    .command:hover .key,
    .command:focus-visible .key {
      color: var(--color-accent);
    }

    .key {
      color: var(--color-text-subtle);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-xs);
      flex-shrink: 0;
      transition: color var(--duration-fast) var(--ease-out);
    }

    .name {
      color: var(--color-text);
      font-size: var(--font-size-sm);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
      flex: 1;
      font-weight: var(--font-weight-normal);
      font-family: var(--font-family-mono);
    }

    .command.wide .name {
      font-size: var(--font-size-md);
    }

    @media (min-width: 600px) {
      .commands > li.wide {
        grid-column: span 2;
      }
    }

    @media (max-width: 599px) {
      .commands {
        grid-template-columns: 1fr;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .commands {
        animation: none;
        opacity: 1;
        transform: none;
      }

      .commands.switching {
        opacity: 1;
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
