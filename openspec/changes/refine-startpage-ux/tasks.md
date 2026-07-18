## 1. Visual system tokens & shell

- [x] 1.1 Audit and refine CSS tokens in `src/styles/variables.css` (color roles, spacing scale, type scale, motion) for dark + light
- [x] 1.2 Rebalance zone composition and hierarchy in `src/styles/layout.css` and `index.html` if needed
- [x] 1.3 Sync `src/pwa-tokens.js` and theme-color meta with any background/theme token changes
- [x] 1.4 Verify `prefers-reduced-motion` paths in global + component styles

## 2. Command surface

- [x] 2.1 Restyle command grid and tiles in `src/components/Commands.js` (key/name hierarchy, hover/focus, borders)
- [x] 2.2 Preserve workspace filtering and wide-tile (top 2 recent-then-frequent) behavior with improved wide-tile treatment
- [x] 2.3 Restyle workspace tabs in `src/components/Tabs.js` to match the refined token language
- [x] 2.4 Confirm tile activation still navigates and records usage

## 3. Moment (clock) polish

- [x] 3.1 Refine clock typography/meta layout in `src/components/Clock.js` so it anchors the page without crowding shortcuts
- [x] 3.2 Align search affordance styling under the moment zone with the new hierarchy

## 4. Search experience

- [x] 4.1 Restyle search overlay panel, header, input, and suggestions in `src/components/Search.js`
- [x] 4.2 Surface mode/match feedback (active workspace, matched command or default search) before submit
- [x] 4.3 Keep open/close keyboard flows (`/`, printable seed, Escape) and suggestion arrow navigation working
- [x] 4.4 Confirm parse modes still work: bare key, key+query, key/path, default search fallback; graceful suggestion failure

## 5. Verification

- [x] 5.1 Manual pass: dark + light, narrow + wide, workspace switch (tabs + Alt/Meta+1-9)
- [x] 5.2 Manual pass: search modes, suggestions online/offline, offline badge, reduced motion
- [x] 5.3 Run `npm run build` and spot-check production preview
