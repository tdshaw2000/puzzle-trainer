import { FACE_COLOUR } from '../../cube/colours';
import { stickerAt } from '../../cube/cube';
import { frameRotation } from '../../cube/rotation';
import type { Face } from '../../cube/notation';
import type { Random } from '../../lib/random';
import { renderTopView } from './render';
import { generateL2EScramble, type L2EScramble } from './scramble';


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

/** Mounts the 5x5 Last Two Edges trainer. Returns a cleanup function. */
export function mountL2E(container: HTMLElement, random: Random = Math.random): () => void {
  const screen = el('section', 'l2e');
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
    const picture = renderTopView(s.cube, 'F', s.casePieces, fill);
    picture.classList.add('scrambled');
    picture.setAttribute('aria-label', `Top layer after the scramble, green side at the bottom. ${describeEdges(s)}`);
    const scrambled = el('figure', 'scrambled-block');
    scrambled.append(picture, el('figcaption', 'face-labels', 'From above, green side at the bottom'));

    const details = el('ul', 'details');
    details.append(
      el('li', undefined, `Case ${s.caseNumber} of 12`),
      el('li', undefined, `Rotation: ${s.yHint || 'no rotation'} (guide's front edge at U${s.position})`),
    );

    const guide = renderTopView(s.cube, s.position, s.casePieces, fill);
    guide.classList.add('reference');
    guide.setAttribute('aria-label', `Guide picture of case ${s.caseNumber}. ${describeEdges(s)}`);
    const refBlock = el('figure', 'reference-block');
    refBlock.append(guide, el('figcaption', undefined, "Guide picture in this case's colours, after the rotation"));

    caseSection.replaceChildren(el('h2', undefined, 'Case'), scrambled, details, refBlock);
  }

  function setSolutionShown(shown: boolean) {
    solution.replaceChildren();
    if (shown) {
      solution.append(el('p', 'solution', current.caseAlg));
      if (current.printedAlg) solution.append(el('p', 'solution-note', `The guide prints ${current.printedAlg}, which solves a different case.`));
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
    current = generateL2EScramble(random);
    scrambleText.textContent = current.text;
    const slices = ['M', 'S'].filter((s) => new RegExp(`\\b${s}`).test(current.text));
    sliceNote.textContent = slices.map((s) => SLICE_NOTES[s]).join(' ');
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
