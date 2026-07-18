## ADDED Requirements

### Requirement: Shared design tokens drive the shell

The startpage SHALL express color, spacing, type, radius, and motion through CSS custom properties in the global stylesheet so components share one visual language in both dark and light color schemes.

#### Scenario: Dark scheme default

- **WHEN** the user prefers a dark color scheme (or no preference is set and dark is the default)
- **THEN** the page background, surfaces, text, borders, and accent resolve from the dark token set

#### Scenario: Light scheme parity

- **WHEN** the user prefers a light color scheme
- **THEN** the same token names resolve to light values with readable contrast for text, borders, and accent

#### Scenario: Components avoid hard-coded palette values

- **WHEN** a component styles chrome (background, text, border, accent, focus)
- **THEN** it MUST use shared CSS custom properties rather than one-off hex colors for those roles

### Requirement: Page composition has clear visual hierarchy

The shell SHALL present three zones — workspace header, moment (clock), and actions (commands) — with spacing and separators that make the clock the primary focal point and shortcuts secondary.

#### Scenario: Initial load hierarchy

- **WHEN** the startpage loads
- **THEN** the clock is visually dominant relative to workspace tabs and the command grid

#### Scenario: Constrained width

- **WHEN** the viewport is narrower than the layout max width
- **THEN** zones remain full-width within horizontal inset padding without horizontal overflow

### Requirement: Motion is purposeful and accessible

Transitions for state changes SHALL be short and MUST be suppressed or non-essential motion removed when the user prefers reduced motion.

#### Scenario: Reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** entrance transforms and non-essential animations do not run (opacity-only or instantaneous state change is acceptable)

### Requirement: Theme chrome stays in sync

Browser/PWA theme colors SHALL stay aligned with the page background tokens.

#### Scenario: Theme color matches background

- **WHEN** the active color scheme is dark or light
- **THEN** the document theme-color (and related PWA token values) match the page background for that scheme
