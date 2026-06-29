import { workspaceManager } from '../lib/WorkspaceManager.js';
import { UsageTracker } from '../lib/UsageTracker.js';
import { CONFIG } from '../config.js';

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
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1px;
      list-style: none;
      margin: 0;
      padding: 0;
      width: 100%;
      background: var(--color-border-subtle);
      border-radius: var(--key-radius);
      overflow: hidden;
      opacity: 0;
      transform: translateY(3px);
      animation: gridFadeIn var(--duration-slow) var(--ease-out) forwards;
      transition: opacity var(--duration-normal) var(--ease-out);
    }

    .commands.switching {
      opacity: 0.6;
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
      gap: var(--space-sm);
      outline: 0;
      padding: 0.5rem 0.55rem;
      position: relative;
      text-decoration: none;
      min-height: 2.35rem;
      min-width: 0;
      align-items: center;
      background: var(--color-surface-elevated);
      border: none;
      border-radius: 0;
      transition: background var(--duration-normal) var(--ease-out);
    }

    .command-wide {
      grid-column: span 2;
    }

    .command:hover {
      color: var(--color-text);
      background: var(--color-focus);
      z-index: 1;
    }

    .command:focus-visible {
      outline: none;
      background: var(--color-accent-subtle);
      box-shadow: inset 0 0 0 1px var(--color-accent);
      z-index: 1;
    }

    .command:active {
      background: var(--color-accent-subtle);
    }

    .command:hover .key,
    .command:focus-visible .key {
      background: var(--color-accent);
      color: var(--color-background);
      border-color: var(--color-accent);
    }

    .key {
      color: var(--color-accent);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.45rem;
      height: 1.45rem;
      font-weight: var(--font-weight-bold);
      font-size: 0.65rem;
      letter-spacing: 0;
      background: var(--color-accent-subtle);
      border: none;
      border-radius: var(--key-radius);
      flex-shrink: 0;
      transition:
        background var(--duration-normal) var(--ease-out),
        color var(--duration-normal) var(--ease-out);
    }

    .name {
      color: var(--color-text);
      letter-spacing: 0.01em;
      font-size: 0.72rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
      flex: 1;
      font-weight: var(--font-weight-normal);
      font-family: var(--font-family-mono);
    }

    @media (max-width: 599px) {
      .command-wide {
        grid-column: span 1;
      }

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

  #getWideCommandKeys() {
    const workspaceCommands = workspaceManager.getCommandsForWorkspace(
      this.#activeWorkspaceId
    );
    const commandKeys = Array.from(workspaceCommands.keys());
    const recent = UsageTracker.getRecentCommands(commandKeys, 4);
    const frequent = UsageTracker.getFrequentCommands(commandKeys, 4);
    const items = recent.length > 0 ? recent : frequent;
    return new Set(items.slice(0, 2).map(({ commandKey }) => commandKey));
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

  createCommandsFragment() {
    const fragment = document.createDocumentFragment();
    const workspaceCommands = workspaceManager.getCommandsForWorkspace(
      this.#activeWorkspaceId
    );
    const wideKeys = this.#getWideCommandKeys();

    for (const [key, { name, url }] of workspaceCommands.entries()) {
      if (!name || !url) continue;
      const commandClone = this.createCommandElement(key, name, url, wideKeys);
      fragment.appendChild(commandClone);
    }
    return fragment;
  }

  createCommandElement(key, name, url, wideKeys) {
    const clone = commandTemplate.content.cloneNode(true);
    const command = clone.querySelector('.command');
    command.href = url;
    if (wideKeys.has(key)) {
      command.classList.add('command-wide');
    }
    if (CONFIG.openLinksInNewTab) command.target = '_blank';
    command.addEventListener('click', () => {
      UsageTracker.recordUsage(key);
    });
    clone.querySelector('.key').innerText = key;
    clone.querySelector('.name').innerText = name;
    return clone;
  }
}

customElements.define('commands-component', Commands);