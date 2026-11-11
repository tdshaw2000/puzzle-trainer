import { FACE_COLOUR } from '../../cube/colours';
import { cubeModel } from '../../cube/cube';
import { edgesFor } from '../../cube/edges';
import { NORMAL } from '../../cube/geometry';
import type { Face } from '../../cube/notation';
import type { Random } from '../../lib/random';
import { renderNet } from '../shared/net';
import { generateL3E, type L3EScramble } from './generate';

const c5 = cubeModel(5);
const fill = (f: Face) => FACE_COLOUR[f].hex;
const CAPTION = 'Top face with the sides folded out, green side at the bottom';

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

const PIECE_NAMES = ['lower wing', 'midge', 'upper wing'];

/** Spoken description of the unpaired slots: each piece's two colours, bottom to top, slot by slot. */
function describe(s: L3EScramble): string {
  return edgesFor(5)
    .filter((e) => s.unpaired.includes(e.faces.join('')))
    .map((e) => {
      // middle-layer pieces run bottom to top
      const pieces = [...e.pieces]
        .sort((a, b) => a[1] - b[1])
        .map((p, i) => `${PIECE_NAMES[i]} ${e.faces.map((f) => FACE_COLOUR[c5.stickerAt(s.cube, p, NORMAL[f])].name).join('/')}`);
      return `${e.faces.join('')}: ${pieces.join(', ')}`;
    })
    .join('; ');
}

/** Mounts the 5x5 Last Three Edges trainer. Returns a cleanup function. */
export function mountL3E(container: HTMLElement, random: Random = Math.random): () => void {
  // shares the Last Two Edges screen's layout and skin styles
  const screen = el('section', 'l2e l3e');
  const heading = el('h1', undefined, 'Last Three Edges');
  const hold = el('p', 'hold', 'Scramble holding yellow on top, green in front.');
  const scrambleText = el('p', 'scramble');
  scrambleText.setAttribute('aria-live', 'polite');
  const show = el('button', 'show', 'Show case');
  const next = el('button', 'next primary', 'Next');
  const actions = el('div', 'actions');
  actions.append(show, next);
  const caseSection = el('section', 'case');
  caseSection.id = 'l3e-case';
  caseSection.tabIndex = -1;
  show.setAttribute('aria-controls', caseSection.id);
  screen.append(heading, hold, scrambleText, actions, caseSection);
  container.append(screen);

  let current: L3EScramble;

  function renderCase(s: L3EScramble) {
    const picture = renderNet(s.cube, 'F', s.pieces, fill);
    picture.classList.add('scrambled');
    picture.setAttribute('aria-label', `${CAPTION}, after the scramble. ${describe(s)}`);
    const figure = el('figure', 'scrambled-block');
    figure.append(picture, el('figcaption', 'face-labels', CAPTION));
    const details = el('ul', 'details');
    details.append(el('li', undefined, `Unpaired: ${s.unpaired.join(', ')}`));
    caseSection.replaceChildren(el('h2', undefined, 'Case'), figure, details);
  }

  function setShown(shown: boolean) {
    caseSection.hidden = !shown;
    show.textContent = shown ? 'Hide case' : 'Show case';
    show.setAttribute('aria-expanded', String(shown));
  }

  function newScramble() {
    const focusWasInCase = caseSection.contains(document.activeElement);
    current = generateL3E(random);
    scrambleText.textContent = current.text;
    setShown(false);
    caseSection.replaceChildren();
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
