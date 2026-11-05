# Spec Delta

## MODIFIED Requirements

### Requirement: Trainers are grouped by puzzle
The app SHALL present its trainers grouped by puzzle, in this order: "4x4" (trainer "Last Two Edges"), "5x5" (trainers "Last Two Centres", "Last 3 Edges", "Last Two Edges" in that order) and "6x6" (trainer "Last Two Centres").

#### Scenario: Home page lists puzzles and their trainers
- **WHEN** the user opens the home page
- **THEN** the page shows the groups "4x4", "5x5" and "6x6" in that order
- **AND** the 6x6 group contains a link named "Last Two Centres"

#### Scenario: Selecting a trainer opens it
- **WHEN** the user selects "Last Two Centres" under "6x6"
- **THEN** the 6x6 Last Two Centres trainer screen opens, with the breadcrumb "6x6 › Last Two Centres"

### Requirement: Each trainer has a stable, bookmarkable address
The existing addresses stay, and the 6x6 Last Two Centres trainer SHALL live at `#/6x6/l2c`. Opening it directly SHALL open the trainer. The site title link home and the not-found page behave as for every other trainer.

#### Scenario: Opening the trainer address directly
- **WHEN** the user loads the app at `#/6x6/l2c`
- **THEN** the 6x6 Last Two Centres trainer screen opens without going through the home page
