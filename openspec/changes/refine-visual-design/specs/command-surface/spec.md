## ADDED Requirements

### Requirement: Borderless command grid

Workspace commands SHALL render as a multi-column grid (single column below
600px) of borderless cells separated by uniform gaps. The grid SHALL NOT use an
outer border or the 1px-gap border technique; cells have flat backgrounds with
no drop shadows.

#### Scenario: Grid renders

- **WHEN** the active workspace has commands
- **THEN** commands render in a multi-column grid with even gaps, no outer
  frame, and no per-cell borders

#### Scenario: Mobile single column

- **WHEN** the viewport is below 600px
- **THEN** the grid collapses to a single column

### Requirement: Quiet cell hierarchy

Each command cell SHALL show its key glyph and name in a single row. Key glyphs
SHALL be muted by default; wide (recent/frequent) tiles SHALL be distinguished
by layout span and typographic emphasis only — not by accent bars, glows, or
tinted key wells.

#### Scenario: Resting cells

- **WHEN** the grid renders without interaction
- **THEN** key glyphs are muted/text-colored, names are primary text color, and
  wide tiles differ only in column span and name size

#### Scenario: Wide tiles

- **WHEN** usage data promotes tiles to wide
- **THEN** wide tiles span two columns (above 600px) with a larger name, with no
  accent left-bar or accent-washed key background

### Requirement: Subtle interaction states

Command hover SHALL change the cell background to the focus-surface color and
the key glyph to the accent color; full-cell accent inverts SHALL NOT be used.
Focus-visible SHALL show a 1px accent inset outline. Press states SHALL NOT
translate the cell.

#### Scenario: Hover feedback

- **WHEN** the pointer hovers a command cell
- **THEN** the background shifts to the focus-surface color and the key glyph
  turns accent-colored, with no color inversion of the whole cell

#### Scenario: Keyboard focus

- **WHEN** a command cell receives keyboard focus
- **THEN** a 1px accent inset outline is visible

### Requirement: Workspace tabs as text row

Workspace tabs SHALL render as an unboxed text row. The active tab SHALL be
indicated by text color plus a 1px accent underline; inactive tabs SHALL be
muted. Tab shortcut numbers SHALL render as plain muted text (accent when
active) without boxed chips. Clicking a tab and `Alt/Meta+1-9` switching
behavior SHALL be unchanged.

#### Scenario: Active indication

- **WHEN** a workspace is active
- **THEN** its tab shows primary text color with a 1px accent underline and its
  number is accent-colored, with no containing box around the tab strip

#### Scenario: Switching

- **WHEN** the user clicks an inactive tab or presses its `Alt/Meta+<n>`
  shortcut
- **THEN** the active indication moves to that tab and the command grid
  re-renders for the new workspace
