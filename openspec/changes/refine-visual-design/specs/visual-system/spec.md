## ADDED Requirements

### Requirement: Neutral dual-scheme palette with single accent

The startpage SHALL define its color system as CSS custom properties in
`src/styles/variables.css` using a true-neutral scale (no hue tint on grays)
with one warm accent color, and SHALL provide both dark and light schemes via
`@media (prefers-color-scheme: light)`. The dark scheme SHALL use a near-black
neutral background and the light scheme SHALL use a warm off-white (paper)
background. The accent SHALL be the same hue family in both schemes, adjusted
for contrast.

#### Scenario: Dark scheme default

- **WHEN** the page loads without a light color-scheme preference
- **THEN** the background is a neutral near-black with no green or blue tint and
  accent elements render in the accent color

#### Scenario: Light scheme

- **WHEN** the OS reports `prefers-color-scheme: light`
- **THEN** the background is a warm off-white, text is near-black, and accent
  elements remain legible at a contrast ratio of at least 4.5:1 against their
  background

### Requirement: Accent budget

The accent color SHALL appear only on: the clock colon, the clock seconds, the
active workspace tab indicator, the search-affordance `>` prompt glyph,
focus-visible outlines, and hover/focus treatment of command key glyphs.
Decorative accent glows, washes, and background tints SHALL NOT be used
anywhere.

#### Scenario: Accent-free surfaces

- **WHEN** the page renders in its resting state (no hover, no focus)
- **THEN** no element uses accent-tinted backgrounds, glows, or gradient washes

#### Scenario: Focus visibility

- **WHEN** a user navigates by keyboard to any interactive element
- **THEN** the focused element shows a clearly visible 1px accent outline or
  underline

### Requirement: Editorial typography

The clock SHALL remain the dominant element, set in the display font (Outfit) at
a fluid size with tabular numerals. All UI text SHALL use sentence case;
uppercase micro-label styling (uppercase + expanded letter-spacing below
0.75rem) SHALL NOT be used for labels. The base type scale SHALL use no size
below 0.72rem.

#### Scenario: Clock dominance

- **WHEN** the page renders
- **THEN** the clock time is visually dominant, set in Outfit with tabular-nums,
  and no other text competes at a comparable size or weight

#### Scenario: Sentence-case labels

- **WHEN** workspace tabs, search panel labels, and hints render
- **THEN** none use `text-transform: uppercase`

### Requirement: Borderless zone composition

Zones (tabs, clock + affordance, commands) SHALL be separated by whitespace
rather than containing boxes. Containing borders or backgrounds on the tabs
strip and clock zone SHALL be removed; at most one hairline rule MAY separate
the command grid from the content above it.

#### Scenario: Resting layout

- **WHEN** the page renders in its resting state
- **THEN** neither the workspace tabs nor the clock zone are enclosed by
  bordered or filled containers

### Requirement: Purposeful motion

Entry animations (page fade, grid fade) SHALL remain short (≤ 220ms) and
decorative looping animations (such as the blinking cursor) SHALL be removed.
All motion SHALL be disabled under `prefers-reduced-motion: reduce`.

#### Scenario: Reduced motion

- **WHEN** the OS reports `prefers-reduced-motion: reduce`
- **THEN** the page and grid render at full opacity with no animation

### Requirement: Browser chrome token sync

The PWA tokens in `src/pwa-tokens.js` and the `theme-color` meta in `index.html`
SHALL match the dark-scheme background and theme colors defined in
`src/styles/variables.css`.

#### Scenario: Token consistency

- **WHEN** the design tokens change
- **THEN** `src/pwa-tokens.js` values and the `theme-color` meta tag equal the
  corresponding CSS custom property values
