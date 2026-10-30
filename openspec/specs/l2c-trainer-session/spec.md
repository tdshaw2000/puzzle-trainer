# l2c-trainer-session Specification

## Purpose
Defines the practice loop on the 5x5 Last Two Centres screen: show a scramble, let the user reveal (and hide again) the target case after solving, then move on to the next scramble.

## Requirements

### Requirement: A scramble is shown on arrival
When the Last Two Centres screen opens, it SHALL show a freshly generated scramble, together with the reminder to hold the cube with yellow on top and green in front.

#### Scenario: Opening the trainer
- **WHEN** the user opens 5x5 › Last Two Centres
- **THEN** a scramble is displayed in a large, readable font
- **AND** the case is not yet shown

### Requirement: The target case can be revealed
The screen SHALL offer a "Show case" action. Using it SHALL reveal the case for the current scramble:
- a picture of the two case faces as they look after the scramble (centres coloured, the outer ring neutral), drawn side by side as seen looking at their shared vertical edge with yellow on top and white at the bottom;
- the face positions and colours, and which face plays the sheet's top (U) face and which the sheet's front (F) face;
- the y rotation (none, y, y' or y2) that brings the left face of the pair (the left one in the picture) to the front;
- the sheet's reference picture (sheet top face above sheet front face, in the colours of the faces playing those roles) and its alg.

The action SHALL be a toggle. While the case is shown it SHALL read "Hide case", and using it SHALL hide the case again; using it once more SHALL show the same case for the same scramble. The action SHALL stay available (never disabled) in both states.

#### Scenario: Revealing the case
- **WHEN** the user selects "Show case"
- **THEN** the case picture, face labels, rotation hint and reference alg for the current scramble are shown
- **AND** the action now reads "Hide case"

#### Scenario: Hiding the case again
- **WHEN** the case is shown and the user selects "Hide case"
- **THEN** the case is hidden
- **AND** the action reads "Show case" again

#### Scenario: Showing the same case again
- **WHEN** the user hides the case and then selects "Show case" again without moving to the next scramble
- **THEN** the same case is shown as before

#### Scenario: Rotation hint
- **WHEN** the case is on the pair green/orange, orange/blue, blue/red or red/green (left face first)
- **THEN** the rotation hint is none, y, y2 or y' respectively

#### Scenario: Sheet roles are shown
- **WHEN** the case is revealed
- **THEN** the screen says which face colour plays the sheet's top face and which plays the sheet's front face

#### Scenario: Picture matches the scramble
- **WHEN** the case is revealed
- **THEN** every centre sticker in the picture has the colour that face position has after applying the scramble to a solved cube held yellow-top, green-front

### Requirement: Lookalike cases are named
Some sheet cases are the same physical state once each face may be turned and either face may play the sheet's top (cases 1 and 2, cases 4 and 6). When the revealed case has such a lookalike, the reveal SHALL name the lookalike case and its alg.

#### Scenario: Revealing a case with a lookalike
- **WHEN** the case for a scramble of case 1 is revealed
- **THEN** the reveal says it looks the same as case 2 and shows case 2's alg

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

### Requirement: Moving to the next scramble
The screen SHALL offer a "Next" action that replaces the current scramble with a new one and hides the case again, with the toggle reading "Show case". Next SHALL also be reachable with the space bar.

#### Scenario: Next scramble
- **WHEN** the user selects "Next" or presses space
- **THEN** a new scramble is shown
- **AND** the case is hidden and the toggle reads "Show case"
- **AND** a single press of space produces exactly one new scramble, even when the Next button has focus

### Requirement: Slice notation is explained
When a scramble contains an E move, the screen SHALL show a note that on the 5x5 E means only the central slice, turning like D.

#### Scenario: Scramble with a slice
- **WHEN** the displayed scramble contains E, E' or E2
- **THEN** the slice note is visible
- **AND** it is not shown for scrambles without E

### Requirement: Usable on a phone
The screen SHALL be usable on a phone-sized screen with no horizontal scrolling, so it can sit next to the cube.

#### Scenario: Narrow viewport
- **WHEN** the screen is viewed 375px wide
- **THEN** the scramble, buttons and revealed case fit without horizontal scrolling
