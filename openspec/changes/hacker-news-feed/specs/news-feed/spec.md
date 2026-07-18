# news-feed Specification

## Purpose

Surface Hacker News front-page stories on the startpage as a quiet,
read-and-leave list below the command grid.

## Requirements

### Requirement: Story list

The system SHALL render up to 8 front-page stories fetched from the Algolia HN
API. Each row SHALL show the story title (linking to the story URL), the
source domain, points, relative age, and a link to the HN comments page.

#### Scenario: Successful load

- **WHEN** the component connects and the fetch succeeds
- **THEN** up to 8 rows appear below the command grid without shifting other
  zones' content

#### Scenario: Story interaction

- **WHEN** the user clicks a title (or focuses it with the keyboard)
- **THEN** the story opens in the browser; the comments link opens the HN item
  page

### Requirement: Refresh

The system SHALL refetch every 10 minutes and when the tab becomes visible
with data older than 10 minutes. In-flight requests SHALL be aborted on
disconnect and MUST NOT race with newer ones.

### Requirement: Failure behavior

- **WHEN** a fetch fails
- **THEN** the last successful render is kept; if there is none, a single
  muted line is shown; the rest of the page MUST remain unaffected and no
  layout space is reserved before first data

### Requirement: PWA caching

Requests to `hn.algolia.com` SHALL be handled `NetworkOnly` by the service
worker; stale cached news MUST never be served.

### Requirement: Visual consistency

The section SHALL use only existing design tokens, whitespace plus at most one
hairline as zone separator, and sentence-case meta text — no boxes, borders,
or new accent usage. It SHALL appear in both workspaces and both color
schemes.
