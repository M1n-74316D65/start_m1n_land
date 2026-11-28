# M1n startpage design system

## 1. The daily desk

The startpage is one personal desk for two repeated tasks: launch a destination
and scan the latest reading. A 5:7 desktop grid puts time, search, and shortcuts
on the left and wire's chronological headlines on the right. On phones, search
comes first, wire second, and shortcuts last so a headline enters the first
short viewport.

The system expands the existing restrained editorial direction with wire's quiet
reading surface. It is not a dashboard, news portal, terminal, or engagement
feed. No cards, hero images, rankings, badges, gradients, or decorative texture.

## 2. Color

| Token                    | Light   | Dark    |
| ------------------------ | ------- | ------- |
| --color-background       | #f5f7f8 | #0e1114 |
| --color-surface          | #e7ecef | #1a2229 |
| --color-surface-elevated | #dde3e8 | #243038 |
| --color-text             | #12171c | #e8eef2 |
| --color-text-subtle      | #5c6a75 | #8a98a4 |
| --color-text-muted       | #5c6a75 | #8a98a4 |
| --color-focus            | #e7ecef | #1a2229 |
| --color-border           | #dde3e8 | #243038 |
| --color-border-subtle    | #e7ecef | #1a2229 |
| --color-field            | #7d8a96 | #54656f |
| --color-accent           | #0e6b5c | #2dd4bf |
| --color-accent-hover     | #095247 | #70e4d4 |
| --color-danger           | #b42318 | #ff7b72 |

One cool grey family and one teal interaction accent. Source identity squares
retain wire's deterministic data colors; error red is semantic. PWA and browser
chrome colors stay synchronized with `src/pwa-tokens.js` and `index.html`.
Selection, caret, and focus use the accent. Target WCAG 2.2 AA.

## 3. Typography

- **Outfit 400/500:** interface, controls, clock, metadata, and timestamps.
- **Playfair Display 400 and 400 italic:** headline reading and the wire
  wordmark. Georgia and Times are fallbacks.
- **IBM Plex Mono 400/500:** shortcut keys and keycaps only.

The clock is `clamp(4rem, 6rem + 2vw, 7rem)`, weight 400, line-height .9, with
tabular numerals. Headlines are 1.25rem/1.4 with natural wrapping and pretty
text wrapping. Metadata is .75rem with tabular numerals. Interface copy uses
sentence case.

## 4. Layout

The canvas is at most 80rem with responsive outer insets. At 900px and above,
named grid areas are `moment news / actions news`; wire spans both left-column
rows and is separated by one vertical hairline. Below 900px, areas are
`moment / news / actions` in actual DOM order, with horizontal hairlines between
regions. No CSS `order` property or overflow masking changes the reading
sequence.

Shortcuts use two columns throughout. Controls are at least 44px high on touch.
Long headlines and source names wrap at 320px without horizontal scrolling. The
document owns vertical scrolling; the native search dialog owns its own overflow
while open.

## 5. Components

- **Workspace tabs:** quiet text buttons with numeric hints, neutral active
  wash, visible focus, and existing Alt/Meta number shortcuts.
- **Clock:** real local time, greeting, date, and subtle seconds. No live-region
  ticking or decorative animation. Offline state remains the global badge.
- **Search trigger:** square outlined field with slash hint and teal arrow.
- **Shortcuts:** two-column hairline rows with bracketed keys. Usage ranking
  still selects two tonal destinations. `D` opens wire; command keys must be
  unique across the single global `COMMANDS` Map, not only within a workspace.
- **Wire:** italic wordmark, factual 24-hour window, five chronological rows,
  source identity, relative age, optional Hacker News discussion, and one Open
  wire link. No points, ranking, or engagement metadata.
- **Search dialog:** the existing native modal and command parser, now using the
  shared cool palette. The floating panel alone uses a 12px radius and shadow.

Page controls and reading rows are square. Structure uses 1px rules rather than
cards or elevation. Icons are text arrows only; no emoji or mixed icon library.

## 6. Wire data and states

`NewsFeed.js` fetches `https://news.m1n.land/api/feed?limit=5&hours=24`, a
read-only CORS-enabled endpoint backed by the same `getFeed({ topic: "home" })`
query as wire. It maps `title`, `url`, `publishedAt`, `hnUrl`, `sourceSlug`, and
`sourceName` directly; it does not regroup or rank stories. Requests refresh
every ten minutes and on stale visibility, use abort handling, and remain
NetworkOnly in the service worker.

Loading shows five static placeholders matching story geometry. Empty explains
that the window has no headlines. Failure shows an inline error and a working
Retry button. Every state retains the full wire link. Refresh failure preserves
already rendered stories; malformed items and non-HTTP(S) links are skipped.

## 7. Motion and validation

Existing short opacity/transform feedback remains; no perpetual motion or
animated reading content. Reduced motion disables animation and transitions.
Focus is always outlined, never color-only.

Validation covers production builds, Prettier, wire tests/lint/build, real
Chromium desktop/mobile rendering, light/dark themes, loading/success/empty/
error/retry, long content at 320px, a headline within 320×568, 44px touch
targets, printable-key search, `D` destination preview, Alt+1/2 workspaces,
Escape, and focus return. No framework or additional runtime dependency.
