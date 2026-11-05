# 6x6-l2c-trainer-session Specification

## Purpose

Defines the practice loop on the 6x6 Last Two Centres screen: show a scramble, let the user reveal (and hide again) the case and the solution, then move on to the next scramble. It behaves like the 5x5 Last Two Centres screen.

## Requirements

### Requirement: A scramble is shown on arrival
When the screen opens, it SHALL show a freshly generated scramble in a large, readable font, with the reminder to hold the cube with yellow on top and green in front. The case and the solution SHALL be hidden and the toggles read "Show case" and "Show solution".

#### Scenario: Opening the trainer
- **WHEN** the user opens 6x6 › Last Two Centres
- **THEN** a scramble is displayed and the case and solution are hidden

### Requirement: The case can be revealed
The screen SHALL offer a "Show case" toggle. Showing the case SHALL reveal: a picture of the two case faces as they are after the scramble (centres coloured, outer ring neutral), side by side as seen looking at their shared vertical edge with yellow on top and white at the bottom; the face colours and which plays the sheet's top and front; the rotation hint (none, y, y2 or y') that brings the left face to the front; the case number and sheet name ("Case N of 32: name"); and the sheet's picture in the colours of the faces playing those roles. While shown the toggle SHALL read "Hide case"; using it hides the case and using it again shows the same case. It SHALL never be disabled.

#### Scenario: Revealing and hiding the case
- **WHEN** the user selects "Show case"
- **THEN** the picture, labels, rotation hint, case number and name and sheet picture are shown and the toggle reads "Hide case"
- **WHEN** the user then selects "Hide case"
- **THEN** the case is hidden and the toggle reads "Show case"

#### Scenario: Picture matches the scramble
- **WHEN** the case is revealed
- **THEN** every centre sticker in the picture has the colour that position has after applying the scramble to a solved cube held yellow-top, green-front

#### Scenario: Rotation hint
- **WHEN** the case is on the pair green/orange, orange/blue, blue/red or red/green (left face first)
- **THEN** the rotation hint is none, y, y2 or y' respectively

### Requirement: The solution can be shown on demand
The screen SHALL offer a "Show solution" toggle, separate from "Show case". Using it SHALL show only the case's algs exactly as printed on the sheet, all of them when the case has more than one, one per line, with no picture or number. While shown it SHALL read "Hide solution". It SHALL work independently of "Show case". Each new scramble SHALL start with the solution hidden.

#### Scenario: The solution is the sheet's alg
- **WHEN** the solution is shown for a scramble of case 19
- **THEN** it reads exactly `3R U' Rw U 3Rw'`

### Requirement: Moving to the next scramble
The screen SHALL offer a "Next" action, also reachable with the space bar, that shows a new scramble and hides both the case and the solution. A single press of space SHALL produce exactly one new scramble, even when the Next button has focus.

#### Scenario: Next scramble
- **WHEN** the user selects "Next" or presses space
- **THEN** a new scramble is shown with the case and solution hidden and both toggles reset

### Requirement: Usable on a phone
The screen SHALL be usable 375px wide with no horizontal scrolling, with the case and solution both shown, and the scramble (up to about 20 moves) wrapping rather than overflowing.

#### Scenario: Narrow viewport
- **WHEN** the screen is viewed 375px wide with the case and solution shown
- **THEN** everything fits without horizontal scrolling
