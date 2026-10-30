## ADDED Requirements

### Requirement: The solution can be shown on demand
The screen SHALL offer a "Show solution" action, separate from "Show case". Using it SHALL show only the solution moves for the current scramble, with no case picture, case number or face labels. The solution SHALL be the case's alg exactly as printed on the CubeSkills sheet.

The action SHALL be a toggle: while the solution is shown it SHALL read "Hide solution" and using it SHALL hide the solution again. It SHALL work independently of "Show case". Each new scramble SHALL start with the solution hidden and the action reading "Show solution".

#### Scenario: Opening the trainer
- **WHEN** the user opens 5x5 › Last Two Centres
- **THEN** the solution is hidden and the action reads "Show solution"

#### Scenario: Showing the solution
- **WHEN** the user selects "Show solution"
- **THEN** the solution moves for the current scramble are shown
- **AND** the case is not shown unless it was already shown
- **AND** the action reads "Hide solution"

#### Scenario: Hiding the solution
- **WHEN** the solution is shown and the user selects "Hide solution"
- **THEN** the solution is hidden and the action reads "Show solution"

#### Scenario: The solution is the sheet's alg
- **WHEN** the solution is shown for a scramble of case N
- **THEN** it reads exactly as case N's alg on the sheet, e.g. `(Rw U Rw') U' (Rw U Rw')`

#### Scenario: Next hides the solution
- **WHEN** the solution is shown and the user selects "Next" or presses space
- **THEN** a new scramble is shown with the solution hidden and the action reading "Show solution"

#### Scenario: Narrow viewport
- **WHEN** the screen is viewed 375px wide with both the solution and the case shown
- **THEN** the buttons, solution and case fit without horizontal scrolling
