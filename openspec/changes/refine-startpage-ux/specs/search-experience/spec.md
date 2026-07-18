## ADDED Requirements

### Requirement: Keyboard-first open and close

The user SHALL be able to open search from the keyboard and dismiss it without using the pointer.

#### Scenario: Open with slash

- **WHEN** the user presses `/` while search is closed and focus is not in another editable field
- **THEN** the search overlay opens with an empty query ready for input

#### Scenario: Open seeded by printable key

- **WHEN** the user presses a printable key while search is closed (and not a reserved shortcut)
- **THEN** the search overlay opens with that character seeded into the input

#### Scenario: Dismiss

- **WHEN** the user presses Escape or otherwise cancels the overlay while search is open
- **THEN** the overlay closes and focus returns to a sensible page state

### Requirement: Input modes resolve predictably

Search SHALL support bare command keys (navigate), `key` + search delimiter + query (command search template), `key` + path delimiter + path (origin + path), and fall back to the configured default search template when no command matches.

#### Scenario: Bare command key

- **WHEN** the user submits a known command key with no query
- **THEN** the system navigates to that command's URL

#### Scenario: Command search query

- **WHEN** the user submits a known command key, the search delimiter, and a non-empty query
- **THEN** the system navigates using that command's search template with the query substituted

#### Scenario: Path suffix

- **WHEN** the user submits a known command key, the path delimiter, and a path
- **THEN** the system navigates to the command origin combined with that path

#### Scenario: Default search fallback

- **WHEN** the user submits input that does not match a command navigation pattern
- **THEN** the system uses the configured default search template

### Requirement: Mode and match feedback

While the overlay is open, the UI SHALL indicate enough context for the user to know what Enter will do (e.g. active workspace, matched command, or default search).

#### Scenario: Matched command visible

- **WHEN** the current input resolves to a known command
- **THEN** the overlay surfaces that command identity before submit

#### Scenario: Workspace context visible

- **WHEN** search is open
- **THEN** the active workspace is indicated in the overlay chrome

### Requirement: Suggestions are keyboard navigable

When suggestions are shown, the user SHALL be able to move selection with the keyboard and submit the selected suggestion.

#### Scenario: Arrow navigation

- **WHEN** suggestions are visible and the user presses ArrowDown or ArrowUp
- **THEN** the selected suggestion changes accordingly and remains visually distinct

#### Scenario: Submit selected suggestion

- **WHEN** a suggestion is selected and the user submits
- **THEN** the system navigates using that suggestion's target behavior

### Requirement: Suggestion source and limit

Autocomplete suggestions from the remote provider SHALL respect the configured suggestion limit, and provider failures MUST NOT break the overlay.

#### Scenario: Limit respected

- **WHEN** the provider returns more results than the configured limit
- **THEN** at most the configured number of suggestions are shown

#### Scenario: Provider failure

- **WHEN** the autocomplete request fails or the user is offline
- **THEN** the search overlay remains usable for direct submit without suggestions
