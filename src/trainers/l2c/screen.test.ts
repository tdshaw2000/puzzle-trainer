import { applyAlg, faceGrid, solvedCube } from '../../cube/cube';
import { invert, parseAlg } from '../../cube/notation';
import { FACE_COLOUR, RING_COLOUR } from '../../cube/colours';
import { seeded } from '../../lib/random';
import { mountL2C } from './screen';
import { L2C_CASES } from './cases';

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

  it('moves focus to the revealed case, and back to Show case on the next scramble', () => {
    const { button, caseSection } = mount();
    button('Show case').click();
    expect(document.activeElement).toBe(caseSection());
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(document.activeElement).toBe(button('Show case'));
  });

  it('draws the sheet reference in the colours of the faces playing top and front', () => {
    const { root, button } = mount(3);
    button('Show case').click();
    const text = root.querySelector('.case')!.textContent!;
    const top = /Sheet top \(U\): ([a-z]+)/.exec(text)![1];
    const front = /Sheet front \(F\): ([a-z]+)/.exec(text)![1];
    const alg = root.querySelector('.reference-alg')!.textContent!;
    const sheet = applyAlg(solvedCube(), invert(parseAlg(alg)));
    const hex = (name: string) => Object.values(FACE_COLOUR).find((c) => c.name === name)!.hex;
    const svg = root.querySelector('.case svg.reference')!;
    (['U', 'F'] as const).forEach((f, i) => {
      const grid = faceGrid(sheet, f);
      for (let row = 1; row < 4; row++) {
        for (let col = 1; col < 4; col++) {
          const fill = svg.querySelector(`rect[data-face="${i}"][data-row="${row}"][data-col="${col}"]`)!.getAttribute('fill');
          expect(fill).toBe(hex(grid[row][col] === 'U' ? top : front));
        }
      }
    });
  });

  it('mentions lookalike sheet cases only when there are some', () => {
    let seen = 0;
    for (let seed = 0; seed < 300 && seen < 2; seed++) {
      const { root, button, cleanup } = mount(seed);
      button('Show case').click();
      const n = Number(/Case (\d+)/.exec(root.querySelector('.case')!.textContent!)![1]);
      const notes = root.querySelectorAll('.case .lookalike');
      const partner: Record<number, number> = { 1: 2, 2: 1, 4: 6, 6: 4 };
      if (partner[n]) {
        seen++;
        expect(notes).toHaveLength(1);
        expect(notes[0].textContent).toContain(`case ${partner[n]}`);
      } else {
        expect(notes).toHaveLength(0);
      }
      cleanup();
      document.body.innerHTML = '';
    }
    expect(seen).toBe(2);
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

  it('hides the solution on arrival', () => {
    const { root, button } = mount();
    const solution = root.querySelector<HTMLElement>('.solution')!;
    expect(solution.hidden).toBe(true);
    expect(button('Show solution').getAttribute('aria-expanded')).toBe('false');
    expect(button('Show solution').getAttribute('aria-controls')).toBe(solution.id);
  });

  it('toggles only the sheet alg, exactly as printed, without showing the case', () => {
    const { root, button, caseSection } = mount();
    const solution = root.querySelector<HTMLElement>('.solution')!;
    button('Show solution').click();
    expect(solution.hidden).toBe(false);
    expect(caseSection().hidden).toBe(true);
    const toggle = button('Hide solution');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.disabled).toBe(false);
    button('Show case').click();
    const n = Number(/Case (\d+)/.exec(caseSection().textContent!)![1]);
    expect(solution.textContent).toBe(L2C_CASES[n - 1].alg);
    expect(solution.textContent).toBe(root.querySelector('.reference-alg')!.textContent);
    expect(solution.querySelector('svg')).toBeNull();
    button('Hide solution').click();
    expect(solution.hidden).toBe(true);
    expect(caseSection().hidden).toBe(false);
    expect(button('Show solution').getAttribute('aria-expanded')).toBe('false');
  });

  it('hides the solution again on Next and on space', () => {
    const { root, button, scramble } = mount();
    const solution = root.querySelector<HTMLElement>('.solution')!;
    button('Show solution').click();
    button('Next').click();
    expect(solution.hidden).toBe(true);
    expect(button('Show solution').getAttribute('aria-expanded')).toBe('false');
    button('Show solution').click();
    button('Show case').click();
    expect(solution.textContent).toBe(root.querySelector('.reference-alg')!.textContent);
    const before = scramble();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(scramble()).not.toBe(before);
    expect(solution.hidden).toBe(true);
    expect(button('Show solution')).toBeDefined();
  });

  it('stops listening for space after cleanup', () => {
    const { scramble, cleanup } = mount();
    const before = scramble();
    cleanup();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(scramble()).toBe(before);
  });
});
