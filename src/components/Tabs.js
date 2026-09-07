import { workspaceManager } from '../lib/WorkspaceManager.js';

const tabsTemplate = document.createElement('template');
tabsTemplate.innerHTML = `
  <style>
    :host {
      display: block;
      min-width: 0;
    }
    .tabs-container {
      display: flex;
      gap: var(--space-xs);
      padding: var(--space-xs);
      background: var(--color-surface);
      border-radius: var(--radius-md);
    }
    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-md);
      min-height: var(--control-min-height);
      padding: var(--space-sm) var(--space-xl);
      border: 0;
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--color-text-subtle);
      font: inherit;
      font-size: var(--font-size-sm);
      cursor: pointer;
    }
    .tab:hover,
    .tab:active {
      background: var(--color-focus);
      color: var(--color-text);
    }
    .tab.active {
      color: var(--color-text);
      background: var(--color-background);
    }
    .tab:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }
    .tab-key {
      font: var(--font-size-xs) var(--font-family-mono);
      color: var(--color-text-muted);
    }
    .tab-name {
      white-space: nowrap;
    }
    @media (max-width: 599px) {
      .tab {
        padding-inline: var(--space-md);
        gap: var(--space-sm);
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
