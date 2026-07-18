## ADDED Requirements

### Requirement: Quiet search affordance

The search affordance under the clock SHALL render as a single hairline-bordered
row with no background fill at rest. The `>` prompt glyph SHALL be
accent-colored; the label SHALL be muted; keyboard hint text SHALL be plain
muted text without boxed kbd chips. The cursor block, if present, SHALL be
static (no blink animation). Clicking it or pressing `/` SHALL open the search
overlay as today.

#### Scenario: Resting affordance

- **WHEN** the page renders
- **THEN** the affordance is a hairline-outlined row with transparent
  background, accent `>` glyph, and no blinking element

#### Scenario: Affordance hover/focus

- **WHEN** the affordance is hovered or focused
- **THEN** it gains a subtle surface background and visible focus outline

### Requirement: Editorial search panel

The search overlay SHALL present a flat panel — no heavy drop shadow — over a
dimmed, blurred backdrop. The panel header and mode rows SHALL use sentence-case
text without uppercase micro-labels, and hint keys SHALL be plain text. Input,
mode feedback, suggestions, and keyboard navigation behavior SHALL be unchanged.

#### Scenario: Overlay opens

- **WHEN** the user opens search
- **THEN** the panel appears over a dimmed blurred backdrop with a flat
  (shadowless or near-shadowless) surface and sentence-case header text

#### Scenario: Mode feedback

- **WHEN** the user types a bare key, `key<space>query`, or `key/path`
- **THEN** the mode row shows the same kind/detail information as before, styled
  in sentence case without uppercase transformation

### Requirement: Suggestion list restraint

Suggestion rows SHALL use plain row separators or whitespace, muted secondary
text, and a subtle selected-row background; accent-tinted selection backgrounds
or glows SHALL NOT be used.

#### Scenario: Navigating suggestions

- **WHEN** the user arrows through autocomplete suggestions
- **THEN** the selected row is indicated by a subtle surface background shift,
  not an accent wash
