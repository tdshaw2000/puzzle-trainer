# trainer-navigation Specification

## Purpose
Organises the app's trainers under the puzzle they belong to, so new puzzles and trainers can be added over time without restructuring navigation.

## Requirements

### Requirement: Trainers are grouped by puzzle
The app SHALL present its trainers grouped by puzzle. Each puzzle lists the trainers that belong to it. The catalogue SHALL contain two puzzles in this order: "5x5", with the trainers "Last Two Centres" and "Last Two Edges" in that order, and "4x4", with the trainer "Last Two Edges".

#### Scenario: Home page lists puzzles and their trainers
- **WHEN** the user opens the app's home page
- **THEN** the page shows a "5x5" puzzle group followed by a "4x4" puzzle group
- **AND** the 5x5 group contains links named "Last Two Centres" and "Last Two Edges", in that order
- **AND** the 4x4 group contains a link named "Last Two Edges"

#### Scenario: Selecting a trainer opens it
- **WHEN** the user selects "Last Two Edges" under "4x4"
- **THEN** the 4x4 Last Two Edges trainer screen opens

### Requirement: Each trainer has a stable, bookmarkable address
Each trainer SHALL be reachable at an address made of its puzzle and trainer identifiers, and opening that address directly SHALL open the trainer. The 5x5 Last Two Centres trainer SHALL live at `#/5x5/l2c`, the 5x5 Last Two Edges trainer at `#/5x5/l2e`, and the 4x4 Last Two Edges trainer at `#/4x4/l2e`.

#### Scenario: Opening the trainer address directly
- **WHEN** the user loads the app at `#/4x4/l2e`
- **THEN** the 4x4 Last Two Edges trainer screen opens without going through the home page

#### Scenario: Unknown address
- **WHEN** the user loads an address that matches no puzzle or trainer
- **THEN** the app shows a not-found message with a link back to the home page

### Requirement: Trainer screens show where they sit in the hierarchy
Every trainer screen SHALL show its puzzle and trainer names (for example "5x5 › Last Two Centres"), and the puzzle part SHALL lead back to the home page.

#### Scenario: Breadcrumb on the L2C screen
- **WHEN** the Last Two Centres trainer screen is open
- **THEN** it shows "5x5 › Last Two Centres"
- **AND** selecting "5x5" returns to the home page
