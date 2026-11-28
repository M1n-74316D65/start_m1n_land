const clockTemplate = document.createElement('template');
clockTemplate.innerHTML = `
  <style>
    :host {
      display: block;
      min-width: 0;
    }
    .clock-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-lg);
    }
    .time {
      font: var(--font-weight-display) var(--font-size-clock)/0.9
        var(--font-family-display);
      letter-spacing: var(--letter-spacing-display);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .colon {
      margin: 0 0.015em;
    }
    .meta {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: var(--space-xs);
    }
    .meta-row {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--space-sm);
    }
    .greeting {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-normal);
      letter-spacing: var(--letter-spacing-heading);
      line-height: 1.3;
    }
    .date {
      color: var(--color-text-subtle);
      font-size: var(--font-size-sm);
    }
    .seconds {
      color: var(--color-text-muted);
      font: var(--font-size-xs) var(--font-family-display);
      font-variant-numeric: tabular-nums;
    }
    .seconds::after {
      content: ' s';
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
  <div class="clock-container">
    <time class="time"></time>
    <span class="meta">
      <span class="meta-row">
        <span class="greeting"></span>
        <span class="seconds" aria-hidden="true">00</span>
      </span>
      <span class="date"></span>
    </span>
  </div>
`;

export class Clock extends HTMLElement {
  #greeting;
  #time;
  #date;
  #seconds;
  #interval;
  #lastHours = -1;
  #lastMinutes = -1;
  #lastSeconds = -1;
  #lastDate = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(clockTemplate.content.cloneNode(true));
    this.#greeting = this.shadowRoot.querySelector('.greeting');
    this.#time = this.shadowRoot.querySelector('.time');
    this.#date = this.shadowRoot.querySelector('.date');
    this.#seconds = this.shadowRoot.querySelector('.seconds');
    this.#updateClock();
    this.#interval = setInterval(() => this.#updateClock(), 1000);
  }

  disconnectedCallback() {
    if (this.#interval) clearInterval(this.#interval);
  }

  #updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeStr = `${hours}<span class="colon">:</span>${minutes}`;
    const greeting = this.#getGreeting(now.getHours());
    const dateStr = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    if (this.#lastHours !== hours || this.#lastMinutes !== minutes) {
      this.#time.innerHTML = timeStr;
      this.#time.dateTime = now.toISOString();
      this.#greeting.textContent = greeting;
      this.#lastHours = hours;
      this.#lastMinutes = minutes;
    }

    if (this.#lastSeconds !== seconds) {
      this.#seconds.textContent = seconds;
      this.#lastSeconds = seconds;
    }

    if (this.#lastDate !== dateStr) {
      this.#date.textContent = dateStr;
      this.#lastDate = dateStr;
    }
  }

  #getGreeting(hours) {
    if (hours >= 5 && hours < 12) return 'Good morning.';
    if (hours >= 12 && hours < 17) return 'Good afternoon.';
    if (hours >= 17 && hours < 21) return 'Good evening.';
    return 'Up late.';
  }
}

customElements.define('clock-component', Clock);
