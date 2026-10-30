import { applyAlg, faceGrid, solvedCube } from '../../cube/cube';
import { parseAlg } from '../../cube/notation';
import { FACE_COLOUR, RING_COLOUR } from '../../cube/colours';
import { seeded } from '../../lib/random';
import { mountL2C } from './screen';

function mount(seed = 7) {
  const root = document.createElement('div');
  document.body.append(root);
  const cleanup = mountL2C(root, seeded(seed));
  const scramble = () => root.querySelector('.scramble')!.textContent!;
  const caseSection = () => root.querySelector<HTMLElement>('.case')!;
  const button = (name: string) =>
    [...root.querySelectorAll('button')].find((b) => b.textContent === name) as HTMLButtonElement;
  return { root, cleanup, scramble, caseSection, button };
}

afterEach(() => (document.body.innerHTML = ''));

describe('L2C trainer screen', () => {
  it('shows a scramble and the holding reminder, with the case hidden', () => {
    const { root, scramble, caseSection } = mount();
    expect(scramble()).toMatch(/^[UDFBRLwE2' ]+$/);
    expect(root.textContent).toContain('yellow on top, green in front');
    expect(caseSection().hidden).toBe(true);
  });

  it('reveals the case with picture, roles, rotation hint and reference alg', () => {
    const { root, button, caseSection } = mount();
    button('Show case').click();
    expect(caseSection().hidden).toBe(false);
    const text = caseSection().textContent!;
    expect(text).toMatch(/Case \d+/);
    expect(text).toMatch(/Sheet top \(U\): \w+/);
    expect(text).toMatch(/Sheet front \(F\): \w+/);
    expect(text).toMatch(/Rotation: (no rotation|y|y'|y2)/);
    expect(root.querySelector('.case .reference-alg')!.textContent).toMatch(/Rw/);
    button('Show case').click();
    expect(caseSection().hidden).toBe(false);
  });

  it('draws the case faces exactly as the scramble leaves them', () => {
    for (let seed = 0; seed < 20; seed++) {
      const { root, scramble, button, cleanup } = mount(seed);
      button('Show case').click();
      const cube = applyAlg(solvedCube(), parseAlg(scramble()));
      const svg = root.querySelector('.case svg.scrambled')!;
      const leftFace = root.querySelector<HTMLElement>('.case')!.dataset.left as 'F';
      const rightFace = root.querySelector<HTMLElement>('.case')!.dataset.right as 'F';
      [leftFace, rightFace].forEach((f, i) => {
        const grid = faceGrid(cube, f);
        for (let row = 1; row < 4; row++) {
          for (let col = 1; col < 4; col++) {
            const fill = svg.querySelector(`rect[data-face="${i}"][data-row="${row}"][data-col="${col}"]`)!.getAttribute('fill');
            expect(fill).toBe(FACE_COLOUR[grid[row][col]].hex);
          }
        }
        expect(svg.querySelector(`rect[data-face="${i}"][data-row="0"][data-col="0"]`)!.getAttribute('fill')).toBe(RING_COLOUR);
      });
      cleanup();
      document.body.innerHTML = '';
    }
  });

  it('Next and a single space press each give one new scramble and hide the case', () => {
    const { scramble, button, caseSection } = mount();
    const first = scramble();
    button('Show case').click();
    button('Next').click();
    const second = scramble();
    expect(second).not.toBe(first);
    expect(caseSection().hidden).toBe(true);

    button('Show case').click();
    const ev = new KeyboardEvent('keydown', { key: ' ', cancelable: true, bubbles: true });
    button('Next').focus();
    button('Next').dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    const up = new KeyboardEvent('keyup', { key: ' ', cancelable: true, bubbles: true });
    button('Next').dispatchEvent(up);
    expect(up.defaultPrevented).toBe(true);
    expect(scramble()).not.toBe(second);
    expect(caseSection().hidden).toBe(true);
  });

  it('shows the slice note only when the scramble has an E move', () => {
    let withE = 0;
    let withoutE = 0;
    for (let seed = 0; seed < 200 && (withE === 0 || withoutE === 0); seed++) {
      const { root, scramble, cleanup } = mount(seed);
      const note = root.querySelector<HTMLElement>('.slice-note')!;
      const hasE = /\bE/.test(scramble());
      expect(note.hidden).toBe(!hasE);
      hasE ? withE++ : withoutE++;
      cleanup();
      document.body.innerHTML = '';
    }
    expect(withE).toBeGreaterThan(0);
    expect(withoutE).toBeGreaterThan(0);
  });

  it('ignores space with a modifier key held', () => {
    const { scramble } = mount();
    const before = scramble();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', ctrlKey: true }));
    expect(scramble()).toBe(before);
  });

  it('moves focus to the revealed case', () => {
    const { button, caseSection } = mount();
    button('Show case').click();
    expect(document.activeElement).toBe(caseSection());
  });

  it('draws the left face to the left of the right face (shared edge in the middle)', () => {
    for (let seed = 0; seed < 20; seed++) {
      const { root, button, cleanup } = mount(seed);
      button('Show case').click();
      const { left, right } = root.querySelector<HTMLElement>('.case')!.dataset;
      // U turns each side face's top row to its left neighbour, so the left face receives the right face's row.
      const turned = faceGrid(applyAlg(solvedCube(), parseAlg('U')), left as 'F');
      expect(turned[0].every((x) => x === right)).toBe(true);
      cleanup();
      document.body.innerHTML = '';
    }
  });

  it('stops listening for space after cleanup', () => {
    const { scramble, cleanup } = mount();
    const before = scramble();
    cleanup();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(scramble()).toBe(before);
  });
});
