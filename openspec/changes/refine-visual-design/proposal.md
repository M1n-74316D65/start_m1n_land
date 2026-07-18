## Why

The current design reads as assembled rather than designed: every zone is a
bordered box, terminal clichés (`>` prompt, blinking cursor, `//` prefixes, kbd
chips) decorate without informing, and the green-black + gold palette with
accent glows feels generated rather than chosen. The goal is an
editorial-minimal startpage — the clock and typography carry the page, chrome
disappears, and one restrained accent does all the work — without changing any
behavior.

## What Changes

- **Palette replacement**: Swap the green-tinted near-black + gold for a
  deliberate neutral scale (true neutral dark, paper off-white light) with a
  single restrained accent used only for live/interactive state. Remove accent
  glow/subtle washes, vignette tokens, and `shadow-panel` theatrics.
- **Unbox the layout**: Remove containing borders from the tabs strip, clock
  zone rules, command grid frame, and search-affordance box. Separate zones with
  whitespace and, at most, a single hairline. Commands keep the grid but drop
  the 1px-gap border trick in favor of quiet cells.
- **Reduce decorative motifs**: Remove `//` meta prefixes, accent left-bars on
  wide tiles, accent-glow key washes, kbd-chip chrome, uppercase micro-labels,
  and full-accent hover inverts. The terminal `>` prompt stays as the single
  deliberate motif (cursor block becomes static).
- **Editorial type hierarchy**: Clock stays huge in Outfit; metadata, tabs, and
  command names get quieter, with a coherent size/weight scale instead of
  uppercase micro-labels everywhere.
- **Interaction states**: Replace invert-on-hover with subtle surface/text
  shifts; focus stays clearly visible for keyboard use. Short, purposeful
  motion; `prefers-reduced-motion` still honored.
- **No behavior change**: Workspace switching, usage-based wide tiles, search
  parsing/modes, PWA caching, and keyboard shortcuts all work exactly as today.

## Capabilities

### New Capabilities

- `visual-system`: Design tokens (color, type, space, motion), zone composition,
  and shared visual language for the startpage shell in both color schemes.
- `command-surface`: Command grid presentation — layout, key/name hierarchy,
  wide-tile treatment, and interaction states.
- `search-experience`: Search affordance and overlay panel presentation (input
  modes, suggestions, hints). Presentation only; parsing behavior unchanged.

### Modified Capabilities

- (none — `openspec/specs/` is empty; the prior `refine-startpage-ux` change was
  implemented but never archived)

## Impact

- **Styles**: `src/styles/variables.css` (token overhaul),
  `src/styles/layout.css` (zone composition, search-affordance),
  `src/pwa-tokens.js` (must stay in sync with new colors)
- **Components**: Scoped styles in
  `src/components/{Clock,Tabs,Commands,Search}.js`; minor template edits where
  decorative elements are removed (e.g., cursor span, `//` prefix
  pseudo-elements)
- **HTML shell**: `index.html` untouched unless zone structure simplifies
- **No new dependencies, no behavior changes, no spec-level UX changes**
