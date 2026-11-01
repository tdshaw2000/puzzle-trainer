import { applyAlg, solvedCube, stickerAt } from '../../cube/cube';
import { FACE_COLOUR, RING_COLOUR } from '../../cube/colours';
import type { Vec } from '../../cube/geometry';
import { parseAlg } from '../../cube/notation';
import { seeded } from '../../lib/random';
import { L2E_CASES } from './cases';
import { mountL2E } from './screen';

function mount(seed = 7) {
  const root = document.createElement('div');
  document.body.append(root);
  const cleanup = mountL2E(root, seeded(seed));
  const scramble = () => root.querySelector('.scramble')!.textContent!;
  const caseSection = () => root.querySelector<HTMLElement>('.case')!;
  const solution = () => root.querySelector<HTMLElement>('.solution-block')!;
  const button = (name: string) =>
    [...root.querySelectorAll('button')].find((b) => b.textContent === name) as HTMLButtonElement;
  const caseNumber = () => Number(/Case (\d+) of 12/.exec(caseSection().textContent!)![1]);
  return { root, cleanup, scramble, caseSection, solution, button, caseNumber };
}

const vec = (s: string) => s.split(',').map(Number) as unknown as Vec;

/** Mounts with successive seeds until `want` holds for the revealed case. */
function mountWhere(want: (n: number) => boolean) {
  for (let seed = 0; seed < 500; seed++) {
    const m = mount(seed);
    m.button('Show case').click();
    if (want(m.caseNumber())) {
      m.button('Hide case').click();
      return m;
    }
    m.cleanup();
    document.body.innerHTML = '';
  }
  throw new Error('no seed found');
}

afterEach(() => (document.body.innerHTML = ''));

describe('L2E trainer screen', () => {
  it('shows a scramble and the holding reminder, with case and solution hidden', () => {
    const { root, scramble, caseSection, solution, button } = mount();
    expect(scramble()).toMatch(/^[UDFBRLwMSE2' ]+$/);
    expect(root.querySelector('h1')!.textContent).toBe('Last Two Edges');
    expect(root.textContent).toContain('yellow on top, green in front');
    expect(caseSection().hidden).toBe(true);
    expect(solution().hidden).toBe(true);
    expect(button('Show case').getAttribute('aria-expanded')).toBe('false');
    expect(button('Show solution').getAttribute('aria-controls')).toBe(solution().id);
  });

  it('toggles the case, showing the same case again until Next', () => {
    const { button, caseSection } = mount();
    button('Show case').click();
    const text = caseSection().textContent!;
    expect(text).toMatch(/Case \d+ of 12/);
    expect(text).toMatch(/Rotation: (no rotation|y|y'|y2) \(guide's front edge at U[FRBL]\)/);
    expect(caseSection().querySelector('svg.scrambled')).not.toBeNull();
    expect(caseSection().querySelector('svg.reference')).not.toBeNull();
    const shown = caseSection().innerHTML;
    expect(button('Hide case').getAttribute('aria-expanded')).toBe('true');
    button('Hide case').click();
    expect(caseSection().hidden).toBe(true);
    expect(document.activeElement).toBe(button('Show case'));
    button('Show case').click();
    expect(caseSection().innerHTML).toBe(shown);
    button('Next').click();
    expect(caseSection().hidden).toBe(true);
    expect(button('Show case')).toBeDefined();
  });

  it('draws the top layer as the scramble leaves it, only case pieces coloured', () => {
    for (let seed = 0; seed < 15; seed++) {
      const { root, scramble, button, cleanup } = mount(seed);
      button('Show case').click();
      const cube = applyAlg(solvedCube(), parseAlg(scramble()));
      const rects = [...root.querySelectorAll<SVGRectElement>('.case svg.scrambled rect')];
      const lit = rects.filter((r) => r.getAttribute('fill') !== RING_COLOUR);
      expect(lit).toHaveLength(12);
      for (const r of lit) {
        expect(r.getAttribute('fill')).toBe(FACE_COLOUR[stickerAt(cube, vec(r.dataset.pos!), vec(r.dataset.normal!))].hex);
      }
      cleanup();
      document.body.innerHTML = '';
    }
  });

  it('shows only the alg as the solution, independent of the case', () => {
    const { button, caseSection, solution, caseNumber } = mountWhere((n) => n !== 1 && n !== 6);
    button('Show solution').click();
    expect(solution().hidden).toBe(false);
    expect(caseSection().hidden).toBe(true);
    expect(solution().querySelector('svg')).toBeNull();
    button('Show case').click();
    expect(solution().querySelector('.solution')!.textContent).toBe(L2E_CASES[caseNumber() - 1].alg);
    expect(solution().querySelector('.solution-note')).toBeNull();
    button('Hide solution').click();
    expect(solution().hidden).toBe(true);
    expect(caseSection().hidden).toBe(false);
  });

  it('notes the printed alg for case 1 and the re-grip for case 6', () => {
    const one = mountWhere((n) => n === 1);
    one.button('Show solution').click();
    expect(one.solution().querySelector('.solution')!.textContent).toBe("M U' R' U R' F R F' M'");
    expect(one.solution().textContent).toContain("The guide prints M' U' R' U R' F R F' M");
    one.cleanup();
    document.body.innerHTML = '';
    const six = mountWhere((n) => n === 6);
    six.button('Show solution').click();
    expect(six.solution().textContent).toContain('x puts white back on the bottom');
  });

  it('Next and a single space press each give one new scramble and hide case and solution', () => {
    const { scramble, button, caseSection, solution } = mount();
    const first = scramble();
    button('Show case').click();
    button('Show solution').click();
    button('Next').click();
    const second = scramble();
    expect(second).not.toBe(first);
    expect(caseSection().hidden).toBe(true);
    expect(solution().hidden).toBe(true);

    button('Show solution').click();
    const ev = new KeyboardEvent('keydown', { key: ' ', cancelable: true, bubbles: true });
    button('Next').focus();
    button('Next').dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    const up = new KeyboardEvent('keyup', { key: ' ', cancelable: true, bubbles: true });
    button('Next').dispatchEvent(up);
    expect(up.defaultPrevented).toBe(true);
    expect(scramble()).not.toBe(second);
    expect(solution().hidden).toBe(true);
    expect(button('Show solution').getAttribute('aria-expanded')).toBe('false');
  });

  it('explains M and S only when the scramble has them', () => {
    const seen = { M: false, none: false };
    for (let seed = 0; seed < 200; seed++) {
      const { root, scramble, cleanup } = mount(seed);
      const note = root.querySelector<HTMLElement>('.slice-note')!;
      const has = (s: string) => new RegExp(`\\b${s}`).test(scramble());
      expect(note.hidden).toBe(!has('M') && !has('S') && !has('E'));
      expect(note.textContent!.includes('M turns')).toBe(has('M'));
      expect(note.textContent!.includes('S turns')).toBe(has('S'));
      if (has('M')) seen.M = true;
      if (note.hidden) seen.none = true;
      cleanup();
      document.body.innerHTML = '';
    }
    expect(seen).toEqual({ M: true, none: true });
  });

  it('stops listening for space after cleanup', () => {
    const { scramble, cleanup } = mount();
    const before = scramble();
    cleanup();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(scramble()).toBe(before);
  });
});
