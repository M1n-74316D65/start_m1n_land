## Context

The page is three zones — workspace tabs, clock + search affordance, command
grid — plus a search overlay. Today every zone is wrapped in borders, the
palette is green-tinted near-black with a gold accent and glow washes, and
decoration (glows, invert-hovers, uppercase micro-labels, `//` prefixes) does no
informational work. User direction: **editorial minimal** — strip chrome, keep
the huge clock / command grid / workspace tabs / dual color schemes, and let
type and whitespace carry the composition. Prior change `refine-startpage-ux` is
fully implemented (this is its successor) but was never archived; no main specs
exist.

## Goals / Non-Goals

**Goals:**

- One neutral palette (neutral dark, paper light) + one restrained accent for
  live/interactive state only
- Zero decorative boxes: zones separated by whitespace and at most one hairline
- A coherent type scale; uppercase micro-labels become sentence-case text
- Subtle interaction states; strong keyboard focus visibility
- `src/pwa-tokens.js` and `index.html` `theme-color` stay in sync with new
  tokens

**Non-Goals:**

- No behavior changes (parsing, workspace switching, usage tracking, shortcuts,
  PWA caching)
- No layout restructuring (zones, grid, and clock scale stay)
- No new fonts or dependencies; Outfit + IBM Plex Mono stay
- No light-mode-only or dark-mode-only divergence beyond token values

## Decisions

### Palette: neutral ink/paper + vermillion accent

Replace the green-tinted scale with true neutrals and swap gold for a restrained
vermillion — a classic editorial spot color that works in both schemes and reads
as chosen, not generated.

- Dark: background `#0f0f0f`, surface `#161616`, elevated `#1c1c1c`, text
  `#d6d6d6`, subtle `#8a8a8a`, muted `#5c5c5c`, border `#262626` / subtle
  `#1e1e1e`, focus `#1a1a1a`
- Light: background `#f5f3ee` (warm paper), surface `#faf8f4`, elevated
  `#ffffff`, text `#191919`, subtle `#6b6b6b`, muted `#9a9a9a`, border `#ddd9d2`
  / subtle `#e7e4de`, focus `#eceae4`
- Accent: `#c24a2e` dark / `#a83c24` light; hover/dim variants derived, no
  glow/subtle rgba washes
- Alternatives considered: keep gold and just mute it (rejected — gold-on-black
  is the trope being removed); monochrome with no accent (rejected — accent is
  needed for focus/active/live seconds, and a single spot color is the editorial
  signature)

Accent budget: clock colon, seconds, active-tab indicator, `>` prompt glyph,
focus rings, hover/focus on command keys. Nothing else.

### Unbox the layout

- **Tabs**: remove the containing strip border and background. Tabs become a
  quiet text row; active = text color + 1px accent underline, inactive = muted.
  Number chips keep a hairline box (functional shortcut hint) or go plain —
  decision: plain text `1` in muted, accent when active.
- **Clock zone**: remove top/bottom rules; separate with `--space-2xl` rhythm.
  One hairline above the command grid is allowed if the page floats.
- **Command grid**: drop the outer border + 1px-gap border trick. Cells are
  borderless with `--space-xs` gaps; each cell is a flat surface row (key +
  name). Grid structure and wide-tile spanning stay.
- **Search affordance**: keep the row but remove the boxed look — hairline
  border only, no background fill until hover.

### Typography

- Clock unchanged in role: Outfit, `clamp(3.6rem, 13vw, 6.25rem)`, tabular-nums.
  Colon keeps accent.
- Meta row: single quiet line, sentence case, no `//` prefix; seconds join the
  meta line instead of standing alone.
- Kill uppercase + `letter-spacing-label` micro-labels everywhere (tabs, search
  header, offline badge stays uppercase — it's a status badge, not a label).
- Scale: `xs 0.72rem / sm 0.8rem / md 0.9rem` (raise the floor — current 0.62rem
  is unreadably small), weights 400/500 only.

### Interaction states

- Command hover/focus: background shifts to `--color-focus` (or accent for the
  key glyph only); no full-cell accent invert, no `translateY(1px)` press.
- Focus-visible: 1px accent inset outline everywhere — the one allowed accent
  flourish, required for keyboard use.
- Cursor block in the affordance: static, no blink animation.
- Motion: keep fadeIn/gridFadeIn, durations unchanged, reduced-motion honored.

### Tokens

Prune dead tokens as styles are rewritten: `--color-accent-glow`,
`--color-accent-subtle`, `--color-vignette`, `--shadow-card`, `--shadow-sm`,
`--transition-bounce` candidates for removal; keep only what the new styles
reference. Update `src/pwa-tokens.js` and the hardcoded `theme-color` in
`index.html` (`#050605` → new dark background).

## Risks / Trade-offs

- Borderless grid reads as unstructured on first paint → Mitigate with generous
  outer rhythm, hairline separation above the grid, and consistent cell padding;
  verify at 34rem and 48rem widths.
- Vermillion contrast in light mode → `#a83c24` on `#f5f3ee` ≈ 5.9:1 for text
  uses; accent is never used for body text, only glyphs/indicators ≥ this ratio.
- Removing hover inverts may feel less responsive → Key glyph flips to accent on
  hover so feedback is immediate but quiet.
- Token pruning may break a stray reference → Grep all pruned token names across
  `src/` before deleting; build + visual check in both schemes.
