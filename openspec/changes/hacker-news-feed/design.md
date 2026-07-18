## Context

The shell mounts four components from `src/main.js` on `DOMContentLoaded`. The
feed joins them as a fifth, mounted below `<commands-component>` in
`index.html`. It follows the same conventions: class with private fields,
Shadow DOM, `<template>` in `index.html`, tokens from `variables.css`.

## Decisions

- **API**: `https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=8`.
  CORS-open, no key, one request returns everything needed (title, url, points,
  `created_at_i`, `objectID` for the comments link).
- **Row anatomy**: headline (Outfit, `--font-size-md`, wraps to 2 lines max via
  `line-clamp`) → meta line (source domain · points · relative age, IBM Plex
  Mono, `--color-text-muted`). Comments link (`news.ycombinator.com/item?id=`)
  is the meta separator target or a trailing item; the row itself links to the
  story. Rows are plain `<a>` elements — keyboard-focusable, middle-clickable.
- **Zone header**: "Hacker News" sentence-case, muted, matching the visual
  weight of tab/workspace labels.
- **Refresh**: `setInterval` at 10 min, stored id, `clearInterval` in
  `disconnectedCallback`; `AbortController` per fetch so overlapping intervals
  can't race. Also refetch on `visibilitychange` → visible if stale (>10 min).
- **Failure/empty**: on fetch error keep the last successful render; if none,
  render one muted line ("Couldn't load Hacker News") and retry next interval.
  No layout space reserved before first data — section fades in once.
- **No skeletons, no loading spinner** — the page's aesthetic is instant and
  quiet; appearing late is fine.
- **PWA**: add `^https://hn\.algolia\.com/` to `runtimeCaching` in
  `pwa.config.js` with `NetworkOnly`, mirroring the DuckDuckGo rule.

## Risks / Trade-offs

- Algolia's front_page snapshot lags HN by a few minutes — acceptable for a
  startpage glance.
- Third-party request on every page load. Mitigated by `NetworkOnly` (no cache
  staleness) and failure being silent. No alternative without a key/proxy.

## Migration Plan

Additive only. Build → preview → verify dark/light, mobile width, offline
behavior (open devtools offline, confirm the rest of the page is unaffected).
