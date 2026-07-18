## Context

M1n Startpage is a vanilla JS, Vite-built PWA: four Shadow DOM web components (`Clock`, `Tabs`, `Commands`, `Search`), config-driven shortcuts in `src/config.js`, workspace switching via `WorkspaceManager`, and usage-ranked wide tiles via `UsageTracker`. Styles live in CSS custom properties (`variables.css`) plus zone layout (`layout.css`) and per-component shadow styles.

The current look is intentionally minimal (zero radius, mono UI, gold accent on near-black) but the hierarchy is flat: zones read as stacked strips, command tiles are uniform and dense, and search is a capable overlay that doesn't fully signal mode (navigate vs search vs path). This redesign stays on the same stack and deepens the existing aesthetic rather than swapping identity.

## Goals / Non-Goals

**Goals:**

- One coherent visual language across shell + components (tokens first).
- Clearer page hierarchy: time is the anchor; shortcuts are scannable; search is the primary action.
- Better keyboard-first search/command feedback without changing core parse rules unless UX requires it.
- Preserve workspaces, usage wide-tiles, DuckDuckGo suggestions, Brave default search, offline badge, PWA install.
- Light/dark parity and reduced-motion respect.

**Non-Goals:**

- Framework or TypeScript migration.
- Runtime user-editable command config (still code in `config.js`).
- New data sources, accounts, or backend.
- Rewriting the Workbox/PWA cache strategy.
- Adding lint/test infrastructure solely for this change.

## Decisions

### 1. Token-first visual redesign (keep sharp aesthetic)

- **Choice**: Evolve the existing sharp, mono + Outfit system instead of introducing soft/rounded "card UI".
- **Rationale**: Matches the current brand (gold accent, near-black, terminal-adjacent). Redesign = hierarchy, contrast, rhythm — not a different product.
- **Alternatives**: Soft rounded neo-brutalism; pure terminal green-on-black. Rejected as identity breaks.

### 2. Composition stays three-zone; refine proportions

- **Choice**: Keep `zone-header` / `zone-moment` / `zone-actions` in `index.html`; adjust spacing, borders, and clock scale so moment dominates and actions breathe.
- **Rationale**: Structure already maps to mental model (workspace → time → shortcuts). No need for a new shell.
- **Alternatives**: Full-bleed centered card; bento grid. Rejected as overkill for a startpage.

### 3. Command surface: hierarchy without new components

- **Choice**: Keep `<commands-component>` grid + wide tiles (top 2 by recent-then-frequent). Improve key badge vs name weight, active/hover/focus, and workspace switch transition only.
- **Rationale**: UsageTracker + wide tiles already encode priority; presentation is the gap.
- **Alternatives**: Separate "favorites" row; icons per command. Icons deferred (config bloat, asset maintenance).

### 4. Search: richer mode feedback, same parser

- **Choice**: Keep existing parse modes (`key`, `key query`, `key/path`, default search). Surface active mode + matched command in the panel header/hint area. Polish suggestion list and selection states.
- **Rationale**: Parser is solid; users need clearer confirmation of what Enter will do.
- **Alternatives**: Rewrite parser with a formal grammar; command palette with fuzzy match across all workspaces. Fuzzy can be a follow-up; not required for redesign.

### 5. Styles stay split: global tokens/layout + shadow styles

- **Choice**: Put shared tokens in `variables.css`, page geometry in `layout.css`, component-specific rules in each component's `<style>` template.
- **Rationale**: Existing pattern; avoids leaking shadow internals. Theme color sync with `pwa-tokens.js` remains a manual invariant.
- **Alternatives**: CSS modules or constructable stylesheets shared across components. Deferred — adds machinery without clear win.

### 6. Motion budget

- **Choice**: Short open/close for search, subtle grid fade on workspace switch; no decorative continuous animation. Honor `prefers-reduced-motion`.
- **Rationale**: Startpages should feel instant; motion only for state change.

## Risks / Trade-offs

- **[Risk] Token churn breaks PWA theme-color / icon contrast** → Mitigation: update `pwa-tokens.js` and `index.html` meta theme-color whenever `--pwa-*` changes; re-run `npm run icons` only if `icon.svg` changes.
- **[Risk] Shadow DOM style duplication drifts between components** → Mitigation: prefer shared tokens; avoid hard-coded hex in components.
- **[Risk] Visual density changes hurt muscle memory for tile positions** → Mitigation: keep grid auto-fit behavior and key labels; don't reorder commands alphabetically differently than today.
- **[Risk] Scope creep into command-set content edits** → Mitigation: command URL/key inventory is out of scope unless a UI change requires a config knob.
- **[Trade-off] No automated visual regression** → Accept manual check in dark/light + narrow/wide; repo has no test suite by design.

## Migration Plan

1. Land token + layout changes first (visual baseline).
2. Restyle Tabs / Clock / Commands against tokens.
3. Restyle Search + mode feedback.
4. Manual pass: keyboard shortcuts (`/`, printable seed, Alt/Meta+1-9, Escape), workspace switch, offline badge, light mode.
5. `npm run build` to confirm PWA manifest/theme still generate.
6. Deploy via existing SourceHut → pgs.sh pipeline on merge.

Rollback: revert the change commit; no data migration (localStorage keys unchanged unless we intentionally rename — we will not).

## Open Questions

- How aggressive should the clock scale be on mobile vs desktop? (Default: keep clamp-based fluid type, tighten meta line.)
- Should search open with a visible "mode chip" always, or only when a command key is recognized?
- Any desire to show commands from *all* workspaces in search suggestions, or keep current workspace-scoped behavior? (Default: keep workspace-scoped.)
