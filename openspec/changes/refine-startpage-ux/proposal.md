## Why

The startpage works, but the visual system and search/command experience feel like incremental assembly rather than a deliberate product: sharp zero-radius chrome, a dense command grid, and a functional-but-plain search overlay. A focused redesign will make the page feel intentional on open, faster to scan, and more satisfying to drive from the keyboard — without abandoning the vanilla web-component architecture.

## What Changes

- **Visual system**: Rethink spacing, type hierarchy, color roles, and surface treatment so clock, workspace tabs, command tiles, and search share one coherent language (still dark-first with light-mode parity).
- **Layout / composition**: Rebalance the three zones (header / moment / actions) so the clock anchors the page, shortcuts scan cleanly, and empty/search affordances feel designed rather than bolted on.
- **Command tiles**: Improve tile density, key/name hierarchy, wide-tile (frequent/recent) treatment, and hover/focus feedback; keep usage-based wide tiles.
- **Search overlay**: Refine panel chrome, suggestion list, keyboard navigation cues, and mode feedback (bare key / search query / path).
- **Command UX**: Clearer parsing feedback, better suggestion ranking/display, and tighter integration with the active workspace.
- **Motion**: Keep transitions short and purposeful; respect `prefers-reduced-motion`.
- No framework migration, no TypeScript, no new backend. PWA caching model stays as-is unless theme tokens require sync.

## Capabilities

### New Capabilities

- `visual-system`: Design tokens, layout composition, and shared visual language for the startpage shell (zones, type, color, motion).
- `command-surface`: Command grid presentation, wide-tile ranking display, workspace-scoped tiles, and tile interaction states.
- `search-experience`: Search overlay UI, input modes (navigate / search / path), suggestions, and keyboard-driven flow.

### Modified Capabilities

- (none — no existing specs under `openspec/specs/`)

## Impact

- **Styles**: `src/styles/variables.css`, `src/styles/layout.css`, component-scoped styles in `Clock.js`, `Tabs.js`, `Commands.js`, `Search.js`
- **Components**: `src/components/{Clock,Tabs,Commands,Search}.js` — markup/structure may shift; behavior stays web-component + Shadow DOM
- **Config / libs**: `src/config.js`, `WorkspaceManager.js`, `UsageTracker.js` only if command/search UX needs new config knobs
- **PWA tokens**: `src/pwa-tokens.js` if theme colors change (must stay in sync with CSS variables)
- **HTML shell**: `index.html` zone structure may be lightly adjusted
- **No new dependencies** expected
