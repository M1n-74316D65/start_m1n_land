# M1n startpage design system

## 1. Atmosphere & identity

A quiet personal starting point. Oversized time, generous negative space and an
editorial index of destinations give the page its identity. Live references
inspected on 2026-09-07: https://bakkenbaeck.com (white canvas, compact
navigation, 50px medium sans headline, -1px tracking) and https://obys.agency
(dramatic type scale, asymmetric whitespace, small index labels). These inform
the composition; this is an original startpage, not a portfolio clone.

Existing architecture: five Shadow DOM Web Components, shared CSS tokens,
automatic light/dark palettes, keyboard search and workspace navigation. The
previous design used a 12px monospace base, heavy clock, red accent, frame
borders and CRT textures. This approved redesign replaces that visual treatment.

## 2. Color

| Token                    | Light   | Dark    |
| ------------------------ | ------- | ------- |
| --color-background       | #f8f8f4 | #171916 |
| --color-surface          | #eeefe8 | #22251f |
| --color-surface-elevated | #e5e8dd | #2b3027 |
| --color-text             | #242820 | #f0f1e9 |
| --color-text-subtle      | #535b4c | #b8bfb0 |
| --color-text-muted       | #5e6755 | #a0a995 |
| --color-focus            | #e2e6d8 | #343d2b |
| --color-border           | #d5d9cd | #414839 |
| --color-border-subtle    | #e3e6dc | #32382c |
| --color-accent           | #465c2e | #c0d59b |
| --color-accent-hover     | #30451c | #d6e6bb |

PWA theme/background match the canvas. Accent serves focus and navigation. Muted
text remains legible; no neon readouts or decorative texture overlays.

## 3. Typography

Bundled Outfit 400/500 for interface and display; IBM Plex Mono 400/500 for keys
and metadata. Base 16px, line height 1.5. Scale: xs .6875rem, sm .8125rem, md
1rem, lg 1.25rem, heading 1.75rem. Clock clamp(5rem, 16vw, 11rem), weight 400,
line height .9, tracking -.065em, tabular numerals. Greeting uses heading scale
and -.035em tracking. Body tracking -.015em; metadata .06em. Sentence case for
interface copy, uppercase only for short section indices and keycaps.

## 4. Spacing & layout

4px base: xs 4, sm 8, md 12, lg 16, xl 24, 2xl 40, 3xl 64px. Canvas max 1120px,
responsive horizontal inset clamp(20px, 5vw, 64px). Header is a brand/tab
cluster. Clock and greeting share an asymmetric row above the search trigger.
Sections use a 160px label rail and flexible content at >=900px; stacked below.
Shortcut grid: four columns at >=900px, three at >=600px, two on mobile. Wide
(recent) tiles span two tracks on desktop; mobile retains equal compact touch
targets. News uses two columns above 900px, one below. The document owns
vertical scroll; the modal owns overflow while open. No horizontal clipping to
mask layout bugs.

## 5. Components

Shared geometry tokens: `--control-min-height` 2.75rem (44px touch floor),
`--control-height` 4rem (shortcut/search trigger), `--input-height` 3.5rem,
`--key-size` 1.75rem, `--layout-rail` 10rem, `--layout-search-max` 45rem.
Tracking tokens: `--letter-spacing-heading` -.035em and `--letter-spacing-brand`
-.06em. Small search spacing follows xs/sm/md/lg; input end padding is three lg
steps. Borders are 1px, focus outlines 2px with 2–3px optical offsets; these are
rendering mechanics. Clock colon spacing .015em and link underline offset .2em
are optical font-relative adjustments.

- **Workspace tabs**: existing native buttons in a tablist. Tonal active tab,
  numeric key hints, hover fill, pressed fill, 2px focus outline. Arrow keys
  move focus; existing Alt/Meta number shortcuts remain. Minimum height 44px.
- **Clock**: real time, date, seconds and connection state. Greeting/date form a
  separate typographic block. No decorative animation or live-region ticking.
- **Search trigger**: full-width 64px button, label, slash keycap, arrow glyph.
  Surface background and 8px radius, hover/focus accent, pressed state.
- **Shortcut**: existing anchor with key and name; quiet bottom divider, 64px
  minimum height, elevated tone for ranked destinations, 4px radius. Hover and
  focus use accent; names truncate safely. Same primitive in every workspace.
- **Section heading**: small numbered label and sentence-case heading in left
  rail; remains before content in DOM and in mobile stack.
- **News item**: numbered list, sans title, mono source/points/age/comments.
  Hairline rows, no boxed index gutter. Focus/hover underline title. Error copy
  is calm and readable. Content remains the live Hacker News feed.
- **Search dialog**: native modal with labeled input, clear action, mode preview
  and suggestion buttons. 720px maximum panel, 12px radius, restrained shadow.
  Existing empty, loading, command, path, query and URL modes remain available.
  Escape/backdrop close; focus returns to trigger. Inputs and clear controls are
  at least 44px high, visible focus for all controls.

The existing component page is the state harness; verify component states before
final layout approval at 375, 768 and 1280px.

## 6. Motion & interaction

Existing entry and workspace feedback use opacity/transform. Durations 120/180/
240ms, ease cubic-bezier(.16,1,.3,1). No perpetual decorative motion. Reduced
motion disables animation and transitions. Hover is a color change; focus uses
an outline, so keyboard navigation never relies on color alone.

## 7. Depth & surface

Tonal surfaces, fine section dividers and whitespace. Corners: shortcut 4px,
trigger/tab group 8px, modal 12px. Shadow only on the floating search panel: 0
24px 80px color-mix(in srgb, #171916 18%, transparent). No page frame,
registration marks, scanlines, noise, gradients or invented hero imagery.

## 8. Accessibility constraints & accepted debt

Keyboard-first regular users need shortcuts and clear destination previews.
Touch users need readable labels and 44px controls. Low-vision users need AA
text contrast, scalable fonts and reflow; motion-sensitive users need reduced
motion support. Target WCAG 2.2 AA, body contrast >=4.5:1, large text >=3:1.
Keep native semantic elements, visible focus, automatic light/dark preference,
and meaningful headings. No newly accepted accessibility debt.

Validation scope: build, Prettier, real-browser responsive layout and keyboard/
pointer flows. Keep the existing noindex policy; do not change it to improve an
SEO audit score. No framework or new runtime dependencies.

## Personal-use copy

No visible section headings or descriptive labels. Sections retain accessible
names only. Shortcuts and news use the full content width without a label rail.
No explanatory footer, section indices, workspace subtitles, conversational
search prompt or idle-search instructions. Preserve accessible labels and
destination previews.

## Compact layout revision

With section labels removed, use a 60rem canvas, clock clamp(4.5rem, 13vw,
9rem), 3.5rem controls and 1.5rem section spacing. The header has no divider;
search flows directly into destinations. Shortcut tiles keep equal widths at
4/3/2 columns; recent/frequent destinations retain their tonal highlight and
ordering. News follows a single divider. At mobile, use 1.5rem body padding,
1rem horizontal control padding and a smaller brand. No explanatory copy is
added.
