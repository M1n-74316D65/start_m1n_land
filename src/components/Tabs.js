import { workspaceManager } from '../lib/WorkspaceManager.js';

const tabsTemplate = document.createElement('template');
tabsTemplate.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      min-width: 0;
      max-width: 100%;
    }

    .tabs-container {
      display: flex;
      align-items: stretch;
      gap: 0;
      width: 100%;
      max-width: 100%;
      background: var(--color-border);
    }

    .tab {
      flex: 1;
      background: var(--color-surface);
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      font-family: var(--font-family-mono);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      letter-spacing: var(--letter-spacing-label);
      text-transform: uppercase;
      padding: 0.65rem var(--space-md);
      min-width: 0;
      position: relative;
      transition:
        color var(--duration-normal) var(--ease-out),
        background var(--duration-normal) var(--ease-out);
      outline: 0;
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.45rem;
    }

    .tab + .tab {
      margin-left: 1px;
    }

    .tab:hover {
      color: var(--color-text);
      background: var(--color-focus);
    }

    .tab:focus-visible {
      outline: none;
      box-shadow: inset 0 0 0 1px var(--color-accent);
      z-index: 1;
    }

    .tab.active {
      color: var(--color-text);
      background: var(--color-background);
    }

    .tab.active::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background: var(--color-accent);
    }

    .tab-key {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .tab-key::before {
      content: '[';
      color: var(--color-border);
    }

    .tab-key::after {
      content: ']';
      color: var(--color-border);
    }

    .tab.active .tab-key {
      color: var(--color-accent);
    }

    .tab.active .tab-key::before,
    .tab.active .tab-key::after {
      color: var(--color-accent);
    }

    .tab-name {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  </style>
  <nav class="tabs-container" role="tablist" aria-label="Workspaces"></nav>
`;

const tabTemplate = document.createElement('template');
tabTemplate.innerHTML = `
  <button class="tab" type="button" role="tab" aria-selected="false">
    <span class="tab-key" aria-hidden="true"></span>
    <span class="tab-name"></span>
  </button>
`;

export class Tabs extends HTMLElement {
  #tabsContainer;
  #boundWorkspaceChange;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(tabsTemplate.content.cloneNode(true));
    this.#tabsContainer = this.shadowRoot.querySelector('.tabs-container');
    this.#renderTabs();
    this.#initializeEventListeners();
  }

  #renderTabs() {
    const activeId = workspaceManager.activeWorkspaceId;

    workspaceManager.workspaces.forEach((workspace, index) => {
      const clone = tabTemplate.content.cloneNode(true);
      const tab = clone.querySelector('.tab');
      const tabKey = clone.querySelector('.tab-key');
      const tabName = clone.querySelector('.tab-name');

      tab.dataset.workspaceId = workspace.id;
      tabKey.textContent = index + 1;
      tabName.textContent = workspace.name;

      if (workspace.id === activeId) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.setAttribute('aria-selected', 'false');
      }

      this.#tabsContainer.appendChild(clone);
    });
  }

  #initializeEventListeners() {
    this.#tabsContainer.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab');
      if (!tab) return;

      const workspaceId = tab.dataset.workspaceId;
      this.switchToWorkspace(workspaceId);
    });

    this.#tabsContainer.addEventListener('keydown', (e) => {
      const tab = e.target.closest('.tab');
      if (!tab) return;

      const index = Array.from(
        this.#tabsContainer.querySelectorAll('.tab')
      ).indexOf(tab);
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const tabs = this.#tabsContainer.querySelectorAll('.tab');
        const prevTab = tabs[index - 1] || tabs[tabs.length - 1];
        if (prevTab) prevTab.focus();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const tabs = this.#tabsContainer.querySelectorAll('.tab');
        const nextTab = tabs[index + 1] || tabs[0];
        if (nextTab) nextTab.focus();
      }
    });

    this.#boundWorkspaceChange = (e) => {
      this.#updateActiveTab(e.detail.workspaceId);
    };
    window.addEventListener('workspacechange', this.#boundWorkspaceChange);
  }

  disconnectedCallback() {
    if (this.#boundWorkspaceChange) {
      window.removeEventListener('workspacechange', this.#boundWorkspaceChange);
    }
  }

  #updateActiveTab(workspaceId) {
    this.#tabsContainer.querySelectorAll('.tab').forEach((tab) => {
      const isActive = tab.dataset.workspaceId === workspaceId;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  switchToWorkspace(workspaceId) {
    workspaceManager.switchTo(workspaceId);
  }
}

customElements.define('tabs-component', Tabs);
