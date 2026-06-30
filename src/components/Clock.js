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
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-xs);
      text-align: left;
      min-width: 0;
      max-width: 100%;
    }

    .greeting {
      color: var(--color-text-muted);
      font-family: var(--font-family-mono);
      font-size: 0.68rem;
      font-weight: var(--font-weight-normal);
      letter-spacing: 0.03em;
    }

    .time {
      color: var(--color-text);
      font-family: var(--font-family-display);
      font-size: clamp(1.65rem, 4.5vw, 2.25rem);
      font-weight: 600;
      letter-spacing: -0.03em;
      line-height: 1;
      font-variant-numeric: tabular-nums;
      max-width: 100%;
    }

    .date {
      color: var(--color-text-subtle);
      font-family: var(--font-family-mono);
      font-size: 0.68rem;
      font-weight: var(--font-weight-normal);
      letter-spacing: 0.01em;
      margin-top: var(--space-xs);
    }
  </style>
  <div class="clock-container">
    <span class="greeting"></span>
    <time class="time"></time>
    <span class="date"></span>
  </div>
`;

export class Clock extends HTMLElement {
  #greeting;
  #time;
  #date;
  #interval;
  #lastHours = -1;
  #lastMinutes = -1;
  #lastDate = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(clockTemplate.content.cloneNode(true));
    this.#greeting = this.shadowRoot.querySelector('.greeting');
    this.#time = this.shadowRoot.querySelector('.time');
    this.#date = this.shadowRoot.querySelector('.date');
    this.#updateClock();
    this.#interval = setInterval(() => this.#updateClock(), 1000);
  }

  disconnectedCallback() {
    if (this.#interval) clearInterval(this.#interval);
  }

  #updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    const greeting = this.#getGreeting(hours);
    const dateStr = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    if (this.#lastHours !== hours || this.#lastMinutes !== minutes) {
      this.#time.textContent = timeStr;
      this.#greeting.textContent = greeting;
      this.#lastHours = hours;
      this.#lastMinutes = minutes;
    }

    if (this.#lastDate !== dateStr) {
      this.#date.textContent = dateStr;
      this.#lastDate = dateStr;
    }
  }

  #getGreeting(hours) {
    if (hours >= 5 && hours < 12) return 'Good morning';
    if (hours >= 12 && hours < 17) return 'Good afternoon';
    if (hours >= 17 && hours < 21) return 'Good evening';
    return 'Good night';
  }
}

customElements.define('clock-component', Clock);
