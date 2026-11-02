# trainer-navigation Specification

## Purpose
Organises the app's trainers under the puzzle they belong to, so new puzzles and trainers can be added over time without restructuring navigation.

## Requirements

### Requirement: Trainers are grouped by puzzle
The app SHALL present its trainers grouped by puzzle. Each puzzle lists the trainers that belong to it. The catalogue SHALL contain two puzzles in this order: "4x4", with the trainer "Last Two Edges", and "5x5", with the trainers "Last Two Centres", "Last 3 Edges" and "Last Two Edges" in that order.

#### Scenario: Home page lists puzzles and their trainers
- **WHEN** the user opens the app's home page
- **THEN** the page shows a "4x4" puzzle group followed by a "5x5" puzzle group
- **AND** the 5x5 group contains links named "Last Two Centres", "Last 3 Edges" and "Last Two Edges", in that order
- **AND** the 4x4 group contains a link named "Last Two Edges"

#### Scenario: Selecting a trainer opens it
- **WHEN** the user selects "Last 3 Edges" under "5x5"
- **THEN** the Last 3 Edges trainer screen opens
### Requirement: Each trainer has a stable, bookmarkable address
Each trainer SHALL be reachable at an address made of its puzzle and trainer identifiers, and opening that address directly SHALL open the trainer. The 5x5 Last Two Centres trainer SHALL live at `#/5x5/l2c`, the 5x5 Last 3 Edges trainer at `#/5x5/l3e`, the 5x5 Last Two Edges trainer at `#/5x5/l2e`, and the 4x4 Last Two Edges trainer at `#/4x4/l2e`.

#### Scenario: Opening the trainer address directly
- **WHEN** the user loads the app at `#/5x5/l3e`
- **THEN** the Last 3 Edges trainer screen opens without going through the home page

#### Scenario: Unknown address
- **WHEN** the user loads an address that matches no puzzle or trainer
- **THEN** the app shows a not-found message with a link back to the home page
### Requirement: Trainer screens show where they sit in the hierarchy
Every trainer screen SHALL show its puzzle and trainer names (for example "5x5 › Last Two Centres"), and the puzzle part SHALL lead back to the home page.

#### Scenario: Breadcrumb on the L2C screen
- **WHEN** the Last Two Centres trainer screen is open
- **THEN** it shows "5x5 › Last Two Centres"
- **AND** selecting "5x5" returns to the home page

### Requirement: Every page shows the site title as a link home
Every page of the app (the home page, every trainer screen and the not-found page) SHALL show the title "Puzzle Trainer" at the top, in the same place and style on every page and in every skin. The title SHALL be a link to the home page (`#/`). On the home page the title SHALL be the page's main heading. The title SHALL stay readable and SHALL NOT overlap the skin menu at a 375px-wide viewport.

#### Scenario: Title on a trainer screen leads home
- **WHEN** the 4x4 Last Two Edges trainer screen is open
- **THEN** "Puzzle Trainer" is shown at the top of the page
- **AND** selecting it returns to the home page

#### Scenario: Title on the home page
- **WHEN** the user opens the home page
- **THEN** "Puzzle Trainer" is shown as the page's main heading and is a link to the home page

#### Scenario: Title on the not-found page
- **WHEN** the user loads an address that matches no puzzle or trainer
- **THEN** "Puzzle Trainer" is shown at the top of the page as a link to the home page

#### Scenario: Title at phone width in every skin
- **WHEN** any page is shown at 375px wide in any skin
- **THEN** the title is fully visible, does not overlap the skin menu, and causes no horizontal scrolling
