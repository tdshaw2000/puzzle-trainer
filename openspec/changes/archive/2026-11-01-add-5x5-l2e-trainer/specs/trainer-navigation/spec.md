# Spec Delta

## MODIFIED Requirements

### Requirement: Trainers are grouped by puzzle
The app SHALL present its trainers grouped by puzzle. Each puzzle lists the trainers that belong to it. The catalogue SHALL contain one puzzle, "5x5", with two trainers in this order: "Last Two Centres" and "Last Two Edges".

#### Scenario: Home page lists puzzles and their trainers
- **WHEN** the user opens the app's home page
- **THEN** the page shows a "5x5" puzzle group
- **AND** that group contains links named "Last Two Centres" and "Last Two Edges", in that order

#### Scenario: Selecting a trainer opens it
- **WHEN** the user selects "Last Two Edges" under "5x5"
- **THEN** the Last Two Edges trainer screen opens

### Requirement: Each trainer has a stable, bookmarkable address
Each trainer SHALL be reachable at an address made of its puzzle and trainer identifiers, and opening that address directly SHALL open the trainer. The 5x5 Last Two Centres trainer SHALL live at `#/5x5/l2c`, and the 5x5 Last Two Edges trainer at `#/5x5/l2e`.

#### Scenario: Opening the trainer address directly
- **WHEN** the user loads the app at `#/5x5/l2e`
- **THEN** the Last Two Edges trainer screen opens without going through the home page

#### Scenario: Unknown address
- **WHEN** the user loads an address that matches no puzzle or trainer
- **THEN** the app shows a not-found message with a link back to the home page
