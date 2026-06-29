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
      gap: 2px;
      background: var(--color-focus);
      border-radius: var(--border-radius-full);
      overflow: hidden;
      position: relative;
      width: 100%;
      max-width: 100%;
      padding: 2px;
      box-shadow: inset 0 0 0 1px var(--color-border-subtle);
    }

    .tab {
      background: transparent;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      font-family: var(--font-family-mono);
      font-size: 0.68rem;
      font-weight: var(--font-weight-normal);
      letter-spacing: 0.01em;
      padding: 0.3rem 0.5rem;
      border-radius: var(--border-radius-full);
      flex: 1 1 0;
      min-width: 0;
      position: relative;
      transition:
        color var(--duration-normal) var(--ease-out),
        background var(--duration-normal) var(--ease-out);
      outline: 0;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      z-index: 1;
    }

    .tab:hover {
      color: var(--color-text);
      background: var(--color-focus);
    }

    .tab:focus-visible {
      outline: none;
    }

    .tab:focus-visible::after {
      content: '';
      position: absolute;
      inset: 2px;
      border: 1px solid var(--color-accent);
      border-radius: var(--border-radius-sm);
      pointer-events: none;
    }

    .tab:active {
      transform: scale(0.98);
      transition: transform var(--duration-fast) var(--ease-spring);
    }

    .tab.active {
      color: var(--color-text);
      background: var(--color-surface-elevated);
      box-shadow: var(--shadow-sm);
    }

    .tab-indicator {
      display: none;
    }

    .tab-key {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 0.95rem;
      height: 0.95rem;
      font-size: 0.55rem;
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      opacity: 0.7;
    }

    .tab.active .tab-key {
      color: var(--color-accent);
      opacity: 1;
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
  #indicator;
  #boundWorkspaceChange;
  #boundResize;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(tabsTemplate.content.cloneNode(true));
    this.#tabsContainer = this.shadowRoot.querySelector('.tabs-container');
    this.#indicator = document.createElement('div');
    this.#indicator.className = 'tab-indicator';
    this.#tabsContainer.appendChild(this.#indicator);
    this.#renderTabs();
    this.#initializeEventListeners();

    requestAnimationFrame(() => this.#updateIndicator());
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

    this.#boundResize = () => {
      this.#updateIndicator();
    };
    window.addEventListener('resize', this.#boundResize);
  }

  disconnectedCallback() {
    if (this.#boundWorkspaceChange) {
      window.removeEventListener('workspacechange', this.#boundWorkspaceChange);
    }
    if (this.#boundResize) {
      window.removeEventListener('resize', this.#boundResize);
    }
  }

  #updateActiveTab(workspaceId) {
    this.#tabsContainer.querySelectorAll('.tab').forEach((tab) => {
      const isActive = tab.dataset.workspaceId === workspaceId;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    requestAnimationFrame(() => this.#updateIndicator());
  }

  #updateIndicator() {
    const activeTab = this.#tabsContainer.querySelector('.tab.active');
    if (activeTab) {
      const tabRect = activeTab.getBoundingClientRect();
      const containerRect = this.#tabsContainer.getBoundingClientRect();
      requestAnimationFrame(() => {
        this.#indicator.style.left = `${tabRect.left - containerRect.left}px`;
        this.#indicator.style.width = `${tabRect.width}px`;
      });
    }
  }

  switchToWorkspace(workspaceId) {
    workspaceManager.switchTo(workspaceId);
  }
}

customElements.define('tabs-component', Tabs);
