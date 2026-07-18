## ADDED Requirements

### Requirement: Workspace-scoped command grid

The command surface SHALL list only shortcuts belonging to the active workspace and update when the workspace changes.

#### Scenario: Workspace switch refreshes tiles

- **WHEN** the user switches workspace (via tabs or Alt/Meta+digit)
- **THEN** the command grid shows only commands for the newly active workspace

#### Scenario: Empty workspace

- **WHEN** the active workspace has no commands
- **THEN** the grid renders without broken layout (empty state is acceptable)

### Requirement: Tile hierarchy shows key and name clearly

Each command tile SHALL display its keyboard key and display name with a clear visual hierarchy so the key is scannable at a glance and the name remains readable.

#### Scenario: Tile content

- **WHEN** a command is rendered in the grid
- **THEN** the tile shows the command key and the command name

#### Scenario: Focus and hover feedback

- **WHEN** the user hovers or keyboard-focuses a tile
- **THEN** the tile provides a distinct, high-contrast active treatment using accent tokens

### Requirement: Usage-ranked wide tiles

The grid SHALL highlight a small number of high-priority commands as wide tiles based on recent-then-frequent usage without changing the underlying command set.

#### Scenario: Wide tiles for top usage

- **WHEN** usage data exists for commands in the active workspace
- **THEN** up to two top commands (recent-then-frequent) render with the wide-tile treatment

#### Scenario: No usage data

- **WHEN** no usage data is stored
- **THEN** the grid still renders all workspace commands without wide-tile prioritization errors

### Requirement: Activating a tile navigates

Activating a command tile SHALL open the command URL according to configured link-target behavior and record usage.

#### Scenario: Click navigates

- **WHEN** the user activates a command tile
- **THEN** navigation targets that command's URL and usage for that command is recorded
