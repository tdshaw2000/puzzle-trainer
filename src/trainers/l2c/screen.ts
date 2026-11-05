import { cubeModel } from '../../cube/cube';
import { FACE_COLOUR } from '../../cube/colours';
import { invert, parseAlg, type Face } from '../../cube/notation';
import type { Random } from '../../lib/random';
import { renderFaces } from './render';
import { lookalikeCases, type L2CCase } from './cases';
import { generateL2CScramble } from './scramble';
import type { L2CScramble } from './engine';

const colourName = (f: Face) => FACE_COLOUR[f].name;
const capitalise = (s: string) => s[0].toUpperCase() + s.slice(1);

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

export interface L2CScreenConfig {
  size: number;
  caseCount: number;
  generate: (random: Random) => L2CScramble;
  lookalikes: (number: number) => L2CCase[];
  className: string;
  /** Shows E-slice notes (5x5 only). */
  sliceNote?: string;
}

/** Mounts a Last Two Centres trainer screen. Returns a cleanup function. */
export function mountL2CScreen(container: HTMLElement, config: L2CScreenConfig, random: Random = Math.random): () => void {
  const model = cubeModel(config.size);
  const screen = el('section', `l2c ${config.className}`.trim());
  const heading = el('h1', undefined, 'Last Two Centres');
  const hold = el('p', 'hold', 'Scramble holding yellow on top, green in front.');
  const scrambleText = el('p', 'scramble');
  scrambleText.setAttribute('aria-live', 'polite');
  const sliceNote = el('p', 'slice-note', config.sliceNote ?? '');
  const show = el('button', 'show', 'Show case');
  const showSolution = el('button', 'show-solution', 'Show solution');
  const next = el('button', 'next primary', 'Next');
  const actions = el('div', 'actions');
  actions.append(show, showSolution, next);
  const solution = el('p', 'solution');
  solution.id = 'l2c-solution';
  showSolution.setAttribute('aria-controls', solution.id);
  const caseSection = el('section', 'case');
  caseSection.id = 'l2c-case';
  caseSection.tabIndex = -1;
  show.setAttribute('aria-controls', caseSection.id);
  screen.append(heading, hold, scrambleText, sliceNote, actions, solution, caseSection);
  container.append(screen);

  let current: L2CScramble;

  function renderCase(s: L2CScramble) {
    caseSection.replaceChildren();
    caseSection.dataset.left = s.left;
    caseSection.dataset.right = s.right;

    const picture = renderFaces([s.faces.left, s.faces.right], 'horizontal', (f) => FACE_COLOUR[f].hex);
    picture.classList.add('scrambled');
    picture.setAttribute('aria-label', `${colourName(s.left)} and ${colourName(s.right)} centres after the scramble`);

    const labels = el('p', 'face-labels', `${capitalise(colourName(s.left))} (left) · ${capitalise(colourName(s.right))} (right)`);
    const details = el('ul', 'details');
    details.append(
      el('li', undefined, `Case ${s.caseNumber} of ${config.caseCount}${s.caseName ? `: ${s.caseName}` : ''}`),
      el('li', undefined, `Sheet top (U): ${colourName(s.top)}`),
      el('li', undefined, `Sheet front (F): ${colourName(s.front)}`),
      el('li', undefined, `Rotation: ${s.yHint || 'no rotation'} (${colourName(s.left)} to the front)`),
    );
    for (const other of config.lookalikes(s.caseNumber)) {
      details.append(
        el('li', 'lookalike', `Looks the same as case ${other.number} after turning the faces: ${other.alg}`),
      );
    }

    const sheetCube = model.applyAlg(model.solved(), invert(parseAlg(s.caseAlg, config.size)));
    const reference = renderFaces(
      [model.faceGrid(sheetCube, 'U'), model.faceGrid(sheetCube, 'F')],
      'vertical',
      (f) => (f === 'U' ? FACE_COLOUR[s.top].hex : FACE_COLOUR[s.front].hex),
    );
    reference.classList.add('reference');
    reference.setAttribute('aria-label', `Sheet picture of case ${s.caseNumber}`);
    const refBlock = el('figure', 'reference-block');
    const caption = el('figcaption');
    caption.append(
      el('span', undefined, `Sheet picture in this case's colours, ${colourName(s.top)} top above ${colourName(s.front)} front: `),
      el('code', 'reference-alg', s.caseAlg),
    );
    refBlock.append(reference, caption);

    const scrambled = el('figure', 'scrambled-block');
    scrambled.append(picture, labels);
    caseSection.append(el('h2', undefined, 'Case'), scrambled, details, refBlock);
  }

  function setSolutionShown(shown: boolean) {
    solution.replaceChildren(...(shown ? current.caseAlgs.map((a) => el('span', 'alg-line', a)) : []));
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
    sliceNote.hidden = !config.sliceNote || !/\bE/.test(current.text);
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

/** Mounts the 5x5 Last Two Centres trainer. Returns a cleanup function. */
export function mountL2C(container: HTMLElement, random: Random = Math.random): () => void {
  return mountL2CScreen(
    container,
    {
      size: 5,
      caseCount: 19,
      generate: generateL2CScramble,
      lookalikes: lookalikeCases,
      className: '',
      sliceNote: 'E turns only the central slice, the same way as D.',
    },
    random,
  );
}
