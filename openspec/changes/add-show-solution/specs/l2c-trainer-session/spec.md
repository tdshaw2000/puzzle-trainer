## ADDED Requirements

### Requirement: The solution can be shown on demand
The screen SHALL offer a "Show solution" action, separate from "Show case". Using it SHALL show only the solution moves for the current scramble, with no case picture, case number or face labels. The solution SHALL be executable straight after the scramble with the cube held as scrambled (yellow top, green front): it SHALL start with the case's y rotation when one is needed (the same rotation the case reveal names), and SHALL contain no other cube rotations. The moves after the rotation SHALL be the outer face turns that line the two faces up with the sheet's picture followed by the sheet's alg for the case, rewritten for that hold.

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

#### Scenario: The solution solves the scramble
- **WHEN** the scramble, then the solution's y rotation, then its moves are applied to a solved cube held yellow-top, green-front
- **THEN** every centre on every face is the colour of its face
- **AND** this holds for every case, face pair and face orientation the generator can produce

#### Scenario: Only a y rotation
- **WHEN** the solution is shown
- **THEN** it contains no x or z rotation, and a y rotation only as its first step and only when the case's rotation hint is not "no rotation"

#### Scenario: Next hides the solution
- **WHEN** the solution is shown and the user selects "Next" or presses space
- **THEN** a new scramble is shown with the solution hidden and the action reading "Show solution"

#### Scenario: Narrow viewport
- **WHEN** the screen is viewed 375px wide with both the solution and the case shown
- **THEN** the buttons, solution and case fit without horizontal scrolling
