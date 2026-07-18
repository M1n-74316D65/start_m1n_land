## 1. Component

- [x] 1.1 Create `src/components/NewsFeed.js`: custom element
      `<newsfeed-component>`, Shadow DOM, private fields, fetch on
      `connectedCallback`, 10-minute interval + `visibilitychange` refetch,
      `AbortController` + cleanup in `disconnectedCallback`
- [x] 1.2 Render: zone header "Hacker News", flat list of 8 rows (title +
      domain · points · age meta, comments link), tokens from
      `variables.css`, error fallback = keep last render or one muted line
- [x] 1.3 Add `<template id="newsfeed-template">` and
      `<newsfeed-component>` mount point below `<commands-component>` in
      `index.html`
- [x] 1.4 Register the dynamic import in `src/main.js` alongside the other
      four components

## 2. Layout & PWA

- [x] 2.1 `src/styles/layout.css`: whitespace + single hairline separating the
      news zone, consistent with the existing command-grid rule; mobile
      (<600px) single-column behavior
- [x] 2.2 `pwa.config.js`: add `NetworkOnly` runtimeCaching rule for
      `^https://hn\.algolia\.com/`

## 3. Verification

- [x] 3.1 `bun run build` succeeds; `bunx prettier --write .` run
- [ ] 3.2 `bun run preview`: verify dark + light schemes, keyboard focus on
      rows, mobile width, offline fallback (zone degrades silently, rest of
      page unaffected), and that `sw.js` contains the Algolia NetworkOnly rule
