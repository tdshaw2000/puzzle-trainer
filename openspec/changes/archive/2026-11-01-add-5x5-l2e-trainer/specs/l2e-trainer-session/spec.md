# Spec Delta

## Purpose

Defines the practice loop on the 5x5 Last Two Edges screen: show a scramble, let the user reveal (and hide again) the case and the solution, then move on to the next scramble. It behaves like the Last Two Centres screen.

## ADDED Requirements

### Requirement: A scramble is shown on arrival
When the Last Two Edges screen opens, it SHALL show a freshly generated scramble in a large, readable font, with the reminder to hold the cube with yellow on top and green in front. The case and the solution SHALL be hidden.

#### Scenario: Opening the trainer
- **WHEN** the user opens 5x5 › Last Two Edges
- **THEN** a scramble is displayed
- **AND** the toggles read "Show case" and "Show solution"

### Requirement: The case can be revealed
The screen SHALL offer a "Show case" toggle. Showing the case SHALL reveal:
- a top-down picture of the U layer as it is after the scramble, seen with green at the bottom of the picture, like the guide's "birds eye view". It shows the U face's 5x5 stickers plus the side sticker of each U-layer edge piece on all four sides. Only the stickers of the case's edge pieces are coloured; all other stickers are neutral;
- the rotation hint (none, y, y2 or y') and where the guide's front edge is (e.g. "guide's front edge at UR");
- the case number ("Case N of 12");
- the guide's picture for the case: the same edges after the hinted rotation, with the guide's front edge at the bottom, in the case's real colours.

While the case is shown, the toggle SHALL read "Hide case", and using it SHALL hide the case. Using it again SHALL show the same case for the same scramble. The toggle SHALL never be disabled.

#### Scenario: Revealing and hiding the case
- **WHEN** the user selects "Show case"
- **THEN** the picture, rotation hint, case number and guide picture are shown
- **AND** the toggle reads "Hide case"
- **WHEN** the user then selects "Hide case"
- **THEN** the case is hidden and the toggle reads "Show case"

#### Scenario: Picture matches the scramble
- **WHEN** the case is revealed
- **THEN** every coloured sticker in the picture has the colour that position has after applying the scramble to a solved cube held yellow-top, green-front

### Requirement: The solution can be shown on demand
The screen SHALL offer a "Show solution" toggle, separate from "Show case". Using it SHALL show only the case's alg, with no picture or case number. It is the alg defined for the case (the guide's alg as printed, with the case 1 exception in `l2e-scramble-generation`). For case 1, a short note under it SHALL say that the guide prints `M' U' R' U R' F R F' M`. For case 6, whose printed alg ends with the cube turned (white no longer on D), a note SHALL say that x puts white back on the bottom. While shown, the toggle SHALL read "Hide solution", and using it SHALL hide the solution. It SHALL work independently of "Show case".

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

### Requirement: Slice notation is explained
When the displayed scramble contains M or S, the screen SHALL show a note that on the 5x5, M and S turn only the central slice (M like L, S like F). The note SHALL list only the slices that appear.

#### Scenario: Scramble with a slice
- **WHEN** the displayed scramble contains M, M' or M2
- **THEN** the note explains M
- **AND** no note is shown for a scramble with no slice moves

### Requirement: Usable on a phone
The screen SHALL be usable 375px wide with no horizontal scrolling, with the case and solution both shown.

#### Scenario: Narrow viewport
- **WHEN** the screen is viewed 375px wide with the case and solution shown
- **THEN** the scramble, buttons, solution and case fit without horizontal scrolling
