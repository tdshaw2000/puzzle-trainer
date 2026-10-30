# Design

## Context

`mountL2C` in `src/trainers/l2c/screen.ts` renders the case into `section.case` on "Show case", sets `hidden = false`, disables the button and focuses the section. `newScramble` hides and empties the section and re-enables the button.

## Decisions

### One button that toggles, with a changing label
The existing button flips between "Show case" and "Hide case" and carries `aria-expanded` (false/true) and `aria-controls` pointing at the case section, the standard disclosure pattern. Alternatives: a separate "Hide case" button (two controls for one state, more clutter on a phone) or a fixed label with only `aria-pressed` (the label alone wouldn't tell a sighted user what the next press does).

### Hiding keeps the rendered case; showing again re-renders the same scramble
Hiding only sets `hidden = true`. Showing renders from `current` again, which is deterministic for the same scramble, so the user sees exactly the same case. This keeps one rendering path and avoids caching DOM.

### Focus
Showing moves focus to the case section, as today, so screen readers announce it. Hiding keeps focus on the button that was pressed. Next still returns focus to the toggle if focus was inside the case.

## Risks / Trade-offs

- Focus jumps to the case on show, so a keyboard user hiding it again needs one Shift+Tab. Accepted: it matches today's reveal behaviour and keeps the announcement. Mouse and touch users are unaffected.
