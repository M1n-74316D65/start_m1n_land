## Why

The startpage covers time, commands, and search, but not the "what's new"
glance a startpage is for. A compact Hacker News section below the command grid
gives one-look awareness of top stories without leaving the page or adding
visual noise — same editorial-minimal language as the rest of the shell.

## What Changes

- **New `NewsFeed` Web Component** (`<newsfeed-component>`): fetches top
  stories from the Algolia HN API (`/api/v1/search?tags=front_page`), renders a
  flat list of ~8 headlines with title, source domain, points, and age. Links
  open the story; the HN comments link is secondary. No thumbnails, no boxes —
  title carries the row, metadata is muted.
- **Layout**: new zone below the command grid, separated by whitespace plus the
  single hairline motif already used above the grid. Zone header in the same
  quiet sentence-case style as other meta text.
- **Fetching**: plain `fetch` on component connect, client-side only, no API
  key. Refreshes every 10 minutes while the page is open; aborts on disconnect.
- **Failure states**: offline/slow → the zone renders nothing (or a single
  muted line) and retries on next interval. Never blocks or shifts the rest of
  the page; the section reserves no layout space until data arrives.
- **PWA**: the Algolia API origin is added to `pwa.config.js` as `NetworkOnly`
  (same treatment as the DuckDuckGo autocomplete endpoint) so the service
  worker never serves stale news.
- **Workspace-agnostic**: the feed is not part of the workspace system; it
  shows in both workspaces.

## Capabilities

### New Capabilities

- `news-feed`: Hacker News front-page section — data source, presentation,
  refresh, and failure behavior.

### Modified Capabilities

- (none)

## Impact

- **New files**: `src/components/NewsFeed.js`
- **Touched**: `src/main.js` (register component), `index.html` (mount point),
  `src/styles/layout.css` (zone rhythm), `pwa.config.js` (NetworkOnly rule)
- **No new dependencies, no changes to existing components or search behavior**
