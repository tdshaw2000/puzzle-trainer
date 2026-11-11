# pairing-trainer-session Specification

## Purpose

Defines the practice loop on the 4x4 Edge Pairing screen: show a scramble, let the user reveal (and hide) the case, then move on. There is no solution.

## Requirements

### Requirement: A scramble is shown on arrival
When the screen opens it SHALL show a freshly generated scramble in a large, readable font, with the reminder to hold the cube with yellow on top and green in front. The case SHALL be hidden.

#### Scenario: Opening the trainer
- **WHEN** the user opens 4x4 › Edge Pairing
- **THEN** a scramble is displayed
- **AND** the toggle reads "Show case"
- **AND** there is no "Show solution" control

### Requirement: The case can be revealed
The screen SHALL offer a "Show case" toggle. Showing the case SHALL reveal a picture of the cube after the scramble (U face with F, R, B, L folded out, green at the bottom) in which only the wings of the unpaired edges are coloured, and a line giving how many edges are to be paired (for example "6 edges to pair"). While shown, the toggle SHALL read "Hide case". The toggle SHALL never be disabled.

#### Scenario: Revealing and hiding the case
- **WHEN** the user selects "Show case"
- **THEN** the picture and the count are shown and the toggle reads "Hide case"
- **WHEN** the user then selects "Hide case"
- **THEN** the case is hidden and the toggle reads "Show case"

#### Scenario: Picture matches the scramble
- **WHEN** the case is revealed
- **THEN** every coloured sticker has the colour that position has after applying the scramble to a solved cube held yellow-top, green-front

### Requirement: Moving to the next scramble
The screen SHALL offer a "Next" action, also reachable with the space bar, that shows a new scramble and hides the case. A single press of space SHALL produce exactly one new scramble, even when the Next button has focus.

#### Scenario: Next scramble
- **WHEN** the user selects "Next" or presses space
- **THEN** a new scramble is shown with the case hidden

### Requirement: Usable on a phone
The screen SHALL be usable 375px wide with no horizontal scrolling, with the case shown.

#### Scenario: Narrow viewport
- **WHEN** the screen is viewed 375px wide with the case shown
- **THEN** the scramble, buttons and case fit without horizontal scrolling
