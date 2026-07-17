const clockTemplate = document.createElement('template');
clockTemplate.innerHTML = `
  <style>
    :host {
      display: block;
      min-width: 0;
      max-width: 100%;
    }

    .clock-container {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 0.35rem var(--space-xl);
      text-align: left;
      min-width: 0;
      max-width: 100%;
    }

    .time {
      color: var(--color-text);
      font-family: var(--font-family-display);
      font-size: clamp(3.6rem, 13vw, 6.25rem);
      font-weight: var(--font-weight-display);
      letter-spacing: -0.05em;
      line-height: 0.9;
      font-variant-numeric: tabular-nums;
      max-width: 100%;
    }

    .time .colon {
      color: var(--color-accent);
      margin: 0 0.01em;
      opacity: 0.95;
      font-weight: var(--font-weight-normal);
    }

    .meta {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.3rem;
      color: var(--color-text-subtle);
      font-family: var(--font-family-mono);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-normal);
      letter-spacing: 0.02em;
      padding-bottom: 0.45rem;
      min-width: 0;
    }

    .meta-row {
      display: flex;
      align-items: baseline;
      gap: var(--space-sm);
    }

    .meta-row::before {
      content: '//';
      color: var(--color-text-muted);
      letter-spacing: 0.04em;
    }

    .greeting {
      color: var(--color-text-muted);
    }

    .date {
      color: var(--color-text-subtle);
    }

    .seconds {
      color: var(--color-accent);
      font-variant-numeric: tabular-nums;
      min-width: 1.2rem;
    }
  </style>
  <div class="clock-container">
    <time class="time"></time>
    <span class="meta">
      <span class="meta-row">
        <span class="greeting"></span>
        <span class="date"></span>
      </span>
      <span class="meta-row">
        <span class="seconds">00</span>
      </span>
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
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    if (this.#lastHours !== hours || this.#lastMinutes !== minutes) {
      this.#time.innerHTML = timeStr;
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
    if (hours >= 5 && hours < 12) return 'morning';
    if (hours >= 12 && hours < 17) return 'afternoon';
    if (hours >= 17 && hours < 21) return 'evening';
    return 'night';
  }
}

customElements.define('clock-component', Clock);
