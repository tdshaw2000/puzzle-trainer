# 4x4-l2e-trainer-session Specification

## Purpose

Defines the practice loop on the 4x4 Last Two Edges screen: show a scramble, let the user reveal (and hide again) the case and the solution, then move on to the next scramble. It behaves like the 5x5 Last Two Edges screen.

## Requirements

### Requirement: A scramble is shown on arrival
When the 4x4 Last Two Edges screen opens, it SHALL show a freshly generated scramble in a large, readable font, with the reminder to hold the cube with yellow on top and green in front. The case and the solution SHALL be hidden.

#### Scenario: Opening the trainer
- **WHEN** the user opens 4x4 › Last Two Edges
- **THEN** a scramble is displayed
- **AND** the toggles read "Show case" and "Show solution"

### Requirement: The case can be revealed
The screen SHALL offer a "Show case" toggle. Showing the case SHALL reveal:
- a picture of the cube as it is after the scramble: the U face, with the F, R, B and L faces folded out around it, green at the bottom. Only the stickers of the case's edge pieces are coloured; all other stickers are neutral;
- the rotation hint (none, y, y2 or y');
- the case number ("Case N of 5");
- the sheet's picture for the case: the same drawing after the hinted rotation, in the case's real colours.

While the case is shown, the toggle SHALL read "Hide case", and using it SHALL hide the case. Using it again SHALL show the same case for the same scramble. The toggle SHALL never be disabled.

#### Scenario: Revealing and hiding the case
- **WHEN** the user selects "Show case"
- **THEN** the picture, rotation hint, case number and sheet picture are shown
- **AND** the toggle reads "Hide case"
- **WHEN** the user then selects "Hide case"
- **THEN** the case is hidden and the toggle reads "Show case"

#### Scenario: Picture matches the scramble
- **WHEN** the case is revealed
- **THEN** every coloured sticker in the picture has the colour that position has after applying the scramble to a solved cube held yellow-top, green-front

### Requirement: The solution can be shown on demand
The screen SHALL offer a "Show solution" toggle, separate from "Show case". Using it SHALL show only the case's alg as defined in `4x4-l2e-scramble-generation` (the sheet's, with missing spaces put back), with no picture or case number. While shown, the toggle SHALL read "Hide solution", and using it SHALL hide the solution. It SHALL work independently of "Show case".

#### Scenario: Showing the solution
- **WHEN** the user selects "Show solution" for a scramble of case N
- **THEN** case N's alg is shown, and the case is not shown unless it already was
- **AND** the toggle reads "Hide solution"

### Requirement: Moving to the next scramble
The screen SHALL offer a "Next" action, also reachable with the space bar, that shows a new scramble and hides both the case and the solution, resetting both toggles.

#### Scenario: Next scramble
- **WHEN** the user selects "Next" or presses space
- **THEN** a new scramble is shown with the case and solution hidden
- **AND** a single press of space produces exactly one new scramble, even when the Next button has focus

### Requirement: Usable on a phone
The screen SHALL be usable 375px wide with no horizontal scrolling, with the case and solution both shown.

#### Scenario: Narrow viewport
- **WHEN** the screen is viewed 375px wide with the case and solution shown
- **THEN** the scramble, buttons, solution and case fit without horizontal scrolling
