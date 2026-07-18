## 1. Design tokens

- [x] 1.1 Rewrite color tokens in `src/styles/variables.css`: neutral dark scale
      (bg `#0f0f0f`, surface `#161616`, elevated `#1c1c1c`, text `#d6d6d6`,
      subtle `#8a8a8a`, muted `#5c5c5c`, border `#262626`/`#1e1e1e`, focus
      `#1a1a1a`) and light paper scale (bg `#f5f3ee`, surface `#faf8f4`,
      elevated `#ffffff`, text `#191919`, subtle `#6b6b6b`, muted `#9a9a9a`,
      border `#ddd9d2`/`#e7e4de`, focus `#eceae4`)
- [x] 1.2 Replace gold accent with vermillion (`#c24a2e` dark, `#a83c24` light)
      plus hover/dim variants; delete `--color-accent-glow`,
      `--color-accent-subtle`, `--color-vignette`, `--shadow-card`,
      `--shadow-sm`, `--transition-bounce` and any token left unreferenced after
      the rewrite
- [x] 1.3 Update type scale tokens: floor at 0.72rem
      (`xs 0.72 / sm 0.8 / md 0.9`); remove reliance on `--letter-spacing-label`
      for labels
- [x] 1.4 Sync `src/pwa-tokens.js` and the `theme-color` meta in `index.html`
      with the new dark background/theme colors

## 2. Layout shell

- [x] 2.1 In `src/styles/layout.css`, remove bordered/filled zone chrome;
      establish whitespace-based zone rhythm and at most one hairline above the
      command grid
- [x] 2.2 Restyle `.search-affordance`: hairline border, transparent at rest,
      accent `>` glyph, static (non-blinking) cursor or none, plain-text hint
      without kbd chip boxes
- [x] 2.3 Remove the blink keyframes and any glow/inset-shadow decoration; keep
      reduced-motion block consistent

## 3. Components

- [x] 3.1 `src/components/Clock.js`: remove `//` meta prefixes; merge seconds
      into the meta line; keep Outfit fluid clock with accent colon and seconds
- [x] 3.2 `src/components/Tabs.js`: unbox the tab strip (no container
      border/background); active = text color + 1px accent underline; shortcut
      numbers plain muted text (accent when active); drop uppercase
      transformation
- [x] 3.3 `src/components/Commands.js`: remove outer border + 1px-gap border
      technique; borderless cells with uniform gaps; muted key glyphs; wide
      tiles distinguished only by span + name size (no accent bar/glow); hover =
      focus-surface bg + accent key glyph; focus-visible = 1px accent inset
      outline; remove translateY press
- [x] 3.4 `src/components/Search.js`: flatten panel (remove heavy shadow),
      sentence-case header/mode/hint text (no uppercase micro-labels),
      plain-text hint keys, subtle (non-accent) suggestion selection

## 4. Verification

- [x] 4.1 Grep `src/` for references to deleted tokens and confirm none remain
- [x] 4.2 `npm run build` succeeds; `npx prettier --write .` run
- [ ] 4.3 `npm run preview`: visually verify dark + light schemes, keyboard
      focus visibility on tabs/commands/search, wide-tile rendering, and search
      overlay at mobile (<600px) and desktop widths
