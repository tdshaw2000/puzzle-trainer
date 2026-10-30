import { applyAlg, faceGrid, solvedCube } from '../../cube/cube';
import { FACE_COLOUR } from '../../cube/colours';
import { invert, parseAlg, type Face } from '../../cube/notation';
import type { Random } from '../../lib/random';
import { renderFaces } from './render';
import { lookalikeCases } from './cases';
import { generateL2CScramble, type L2CScramble } from './scramble';

const colourName = (f: Face) => FACE_COLOUR[f].name;
const capitalise = (s: string) => s[0].toUpperCase() + s.slice(1);

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

/** Mounts the 5x5 Last Two Centres trainer. Returns a cleanup function. */
export function mountL2C(container: HTMLElement, random: Random = Math.random): () => void {
  const screen = el('section', 'l2c');
  const heading = el('h1', undefined, 'Last Two Centres');
  const hold = el('p', 'hold', 'Scramble holding yellow on top, green in front.');
  const scrambleText = el('p', 'scramble');
  scrambleText.setAttribute('aria-live', 'polite');
  const sliceNote = el('p', 'slice-note', 'E turns only the central slice, the same way as D.');
  const show = el('button', 'show', 'Show case');
  const next = el('button', 'next primary', 'Next');
  const actions = el('div', 'actions');
  actions.append(show, next);
  const caseSection = el('section', 'case');
  caseSection.tabIndex = -1;
  screen.append(heading, hold, scrambleText, sliceNote, actions, caseSection);
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
      el('li', undefined, `Case ${s.caseNumber} of 19`),
      el('li', undefined, `Sheet top (U): ${colourName(s.top)}`),
      el('li', undefined, `Sheet front (F): ${colourName(s.front)}`),
      el('li', undefined, `Rotation: ${s.yHint || 'no rotation'} (${colourName(s.left)} to the front)`),
    );
    for (const other of lookalikeCases(s.caseNumber)) {
      details.append(
        el('li', 'lookalike', `Looks the same as case ${other.number} after turning the faces: ${other.alg}`),
      );
    }

    const sheetCube = applyAlg(solvedCube(), invert(parseAlg(s.caseAlg)));
    const reference = renderFaces(
      [faceGrid(sheetCube, 'U'), faceGrid(sheetCube, 'F')],
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

  function newScramble() {
    const focusWasInCase = caseSection.contains(document.activeElement);
    current = generateL2CScramble(random);
    scrambleText.textContent = current.text;
    sliceNote.hidden = !/\bE/.test(current.text);
    caseSection.hidden = true;
    caseSection.replaceChildren();
    show.disabled = false;
    if (focusWasInCase) show.focus();
  }

  show.addEventListener('click', () => {
    if (!caseSection.hidden) return;
    renderCase(current);
    caseSection.hidden = false;
    show.disabled = true;
    caseSection.focus();
  });
  next.addEventListener('click', newScramble);

  const isSpace = (e: KeyboardEvent) =>
    (e.key === ' ' || e.code === 'Space') && !e.ctrlKey && !e.metaKey && !e.altKey;
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
