import { FACE_COLOUR } from '../../cube/colours';
import { stickerAt, type Cube } from '../../cube/cube';
import { frameRotation } from '../../cube/rotation';
import type { Face } from '../../cube/notation';
import type { Random } from '../../lib/random';
import type { Vec } from '../../cube/geometry';
import { renderTopView } from './render';
import { generateL2EScramble, type L2EScramble } from './scramble';

/** What differs between the L2E screens of different puzzles. */
export interface L2EScreenConfig {
  generate(random: Random): L2EScramble;
  caseCount: number;
  /** Draws the cube with `front` at the bottom, colouring only the `highlight` pieces. */
  render(cube: Cube, front: Face, highlight: Vec[], fill: (s: Face) => string): SVGSVGElement;
  /** Caption under the picture of the scrambled cube. */
  pictureCaption: string;
  /** Spoken description of the case pieces. */
  describe(s: L2EScramble): string;
  /** The rotation line, e.g. "Rotation: y". */
  rotationText(s: L2EScramble): string;
  /** Notes for slice moves that may appear in a scramble. */
  sliceNotes: Record<string, string>;
  /** Name of the source in captions and notes, e.g. "guide" or "sheet". */
  source: string;
  /** Extra class on the screen, for puzzle-specific styles. */
  className?: string;
}


function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

const SLICE_NOTES: Record<string, string> = {
  M: 'M turns only the central slice, the same way as L.',
  S: 'S turns only the central slice, the same way as F.',
};

const fill = (f: keyof typeof FACE_COLOUR) => FACE_COLOUR[f].hex;

/** Spoken description of the case edges: each piece as top colour / side colour, left to right. */
function describeEdges(s: L2EScramble): string {
  const { vec } = frameRotation('U', s.position);
  const edge = (z: number, label: string) => {
    const pieces = [-1, 0, 1].map((x) => {
      const pos = vec([x, 2, z]);
      const name = (n: readonly [number, number, number]) => FACE_COLOUR[stickerAt(s.cube, pos, vec(n)) as Face].name;
      return `${name([0, 1, 0])}/${name([0, 0, Math.sign(z)])}`;
    });
    return `${label}: left wing ${pieces[0]}, midge ${pieces[1]}, right wing ${pieces[2]}`;
  };
  return `${edge(2, "guide's front edge")}; ${edge(-2, "guide's back edge")}`;
}

const FIVE: L2EScreenConfig = {
  generate: generateL2EScramble,
  caseCount: 12,
  render: renderTopView,
  pictureCaption: 'From above, green side at the bottom',
  describe: describeEdges,
  rotationText: (s) => `Rotation: ${s.yHint || 'no rotation'} (guide's front edge at U${s.position})`,
  sliceNotes: SLICE_NOTES,
  source: 'guide',
};

/** Mounts the 5x5 Last Two Edges trainer. Returns a cleanup function. */
export function mountL2E(container: HTMLElement, random: Random = Math.random): () => void {
  return mountL2EScreen(container, FIVE, random);
}

/** Mounts a Last Two Edges trainer screen. Returns a cleanup function. */
export function mountL2EScreen(container: HTMLElement, config: L2EScreenConfig, random: Random = Math.random): () => void {
  const screen = el('section', config.className ? `l2e ${config.className}` : 'l2e');
  const heading = el('h1', undefined, 'Last Two Edges');
  const hold = el('p', 'hold', 'Scramble holding yellow on top, green in front.');
  const scrambleText = el('p', 'scramble');
  scrambleText.setAttribute('aria-live', 'polite');
  const sliceNote = el('p', 'slice-note');
  const show = el('button', 'show', 'Show case');
  const showSolution = el('button', 'show-solution', 'Show solution');
  const next = el('button', 'next primary', 'Next');
  const actions = el('div', 'actions');
  actions.append(show, showSolution, next);
  const solution = el('section', 'solution-block');
  solution.id = 'l2e-solution';
  solution.setAttribute('aria-live', 'polite');
  showSolution.setAttribute('aria-controls', solution.id);
  const caseSection = el('section', 'case');
  caseSection.id = 'l2e-case';
  caseSection.tabIndex = -1;
  show.setAttribute('aria-controls', caseSection.id);
  screen.append(heading, hold, scrambleText, sliceNote, actions, solution, caseSection);
  container.append(screen);

  let current: L2EScramble;

  function renderCase(s: L2EScramble) {
    const picture = config.render(s.cube, 'F', s.casePieces, fill);
    picture.classList.add('scrambled');
    picture.setAttribute('aria-label', `${config.pictureCaption}, after the scramble. ${config.describe(s)}`);
    const scrambled = el('figure', 'scrambled-block');
    scrambled.append(picture, el('figcaption', 'face-labels', config.pictureCaption));

    const details = el('ul', 'details');
    details.append(
      el('li', undefined, `Case ${s.caseNumber} of ${config.caseCount}`),
      el('li', undefined, config.rotationText(s)),
    );

    const guide = config.render(s.cube, s.position, s.casePieces, fill);
    guide.classList.add('reference');
    const Source = config.source[0].toUpperCase() + config.source.slice(1);
    guide.setAttribute('aria-label', `${Source} picture of case ${s.caseNumber}. ${config.describe(s)}`);
    const refBlock = el('figure', 'reference-block');
    refBlock.append(guide, el('figcaption', undefined, `${Source} picture in this case's colours, after the rotation`));

    caseSection.replaceChildren(el('h2', undefined, 'Case'), scrambled, details, refBlock);
  }

  function setSolutionShown(shown: boolean) {
    solution.replaceChildren();
    if (shown) {
      solution.append(el('p', 'solution', current.caseAlg));
      if (current.printedAlg) solution.append(el('p', 'solution-note', `The ${config.source} prints ${current.printedAlg}, which solves a different case.`));
      if (current.regrip) solution.append(el('p', 'solution-note', `This alg ends with the cube turned: ${current.regrip} puts white back on the bottom.`));
    }
    solution.hidden = !shown;
    showSolution.textContent = shown ? 'Hide solution' : 'Show solution';
    showSolution.setAttribute('aria-expanded', String(shown));
  }

  function setShown(shown: boolean) {
    caseSection.hidden = !shown;
    show.textContent = shown ? 'Hide case' : 'Show case';
    show.setAttribute('aria-expanded', String(shown));
  }

  function newScramble() {
    const focusWasInCase = caseSection.contains(document.activeElement);
    current = config.generate(random);
    scrambleText.textContent = current.text;
    const slices = Object.keys(config.sliceNotes).filter((s) => new RegExp(`\\b${s}`).test(current.text));
    sliceNote.textContent = slices.map((s) => config.sliceNotes[s]).join(' ');
    sliceNote.hidden = slices.length === 0;
    setShown(false);
    caseSection.replaceChildren();
    setSolutionShown(false);
    if (focusWasInCase) show.focus();
  }

  show.addEventListener('click', () => {
    if (caseSection.hidden) {
      renderCase(current);
      setShown(true);
      caseSection.focus();
    } else {
      setShown(false);
      show.focus();
    }
  });
  showSolution.addEventListener('click', () => setSolutionShown(solution.hidden));
  next.addEventListener('click', newScramble);

  // Space inside the skin menu opens it or picks a skin, so it isn't Next there.
  const isSpace = (e: KeyboardEvent) =>
    (e.key === ' ' || e.code === 'Space') &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.altKey &&
    !(e.target instanceof Element && e.target.closest('.skin-picker'));
  const onKeyDown = (e: KeyboardEvent) => {
    if (!isSpace(e)) return;
    e.preventDefault();
    if (!e.repeat) newScramble();
  };
  // Stops a focused button from also turning the space press into a click.
  const onKeyUp = (e: KeyboardEvent) => {
    if (isSpace(e)) e.preventDefault();
  };
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  newScramble();
  return () => {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  };
}
