## ADDED Requirements

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
