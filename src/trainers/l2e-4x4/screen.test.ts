import { cubeModel } from '../../cube/cube';
import { FACE_COLOUR, RING_COLOUR } from '../../cube/colours';
import type { Vec } from '../../cube/geometry';
import { parseAlg } from '../../cube/notation';
import { seeded } from '../../lib/random';
import { L2E4_CASES } from './cases';
import { mountL2E4 } from './screen';

const c4 = cubeModel(4);
const vec = (s: string) => s.split(',').map(Number) as unknown as Vec;

function mount(seed = 7) {
  const root = document.createElement('div');
  document.body.append(root);
  const cleanup = mountL2E4(root, seeded(seed));
  const scramble = () => root.querySelector('.scramble')!.textContent!;
  const caseSection = () => root.querySelector<HTMLElement>('.case')!;
  const solution = () => root.querySelector<HTMLElement>('.solution-block')!;
  const button = (name: string) => [...root.querySelectorAll('button')].find((b) => b.textContent === name) as HTMLButtonElement;
  const caseNumber = () => Number(/Case (\d+) of 5/.exec(caseSection().textContent!)![1]);
  return { root, cleanup, scramble, caseSection, solution, button, caseNumber };
}

afterEach(() => (document.body.innerHTML = ''));

describe('4x4 L2E trainer screen', () => {
  it('shows a 4x4 scramble and the holding reminder, with case and solution hidden', () => {
    const { root, scramble, caseSection, solution, button } = mount();
    expect(scramble()).toMatch(/^[UDFBRLw2' ]+$/);
    expect(root.querySelector('h1')!.textContent).toBe('Last Two Edges');
    expect(root.textContent).toContain('yellow on top, green in front');
    expect(root.querySelector<HTMLElement>('.slice-note')!.hidden).toBe(true);
    expect(caseSection().hidden).toBe(true);
    expect(solution().hidden).toBe(true);
    expect(button('Show case').getAttribute('aria-expanded')).toBe('false');
  });

  it('toggles the case: net picture, rotation, case number and sheet picture', () => {
    const { button, caseSection } = mount();
    button('Show case').click();
    const text = caseSection().textContent!;
    expect(text).toMatch(/Case [1-5] of 5/);
    expect(text).toMatch(/Rotation: (no rotation|y|y'|y2)/);
    expect(text).toContain('Sheet picture');
    expect(caseSection().querySelectorAll('svg.scrambled rect')).toHaveLength(80);
    expect(caseSection().querySelector('svg.reference')).not.toBeNull();
    const shown = caseSection().innerHTML;
    button('Hide case').click();
    expect(caseSection().hidden).toBe(true);
    button('Show case').click();
    expect(caseSection().innerHTML).toBe(shown);
    button('Next').click();
    expect(caseSection().hidden).toBe(true);
  });

  it('draws the cube as the scramble leaves it, only the four case wings coloured', () => {
    for (let seed = 0; seed < 15; seed++) {
      const { root, scramble, button, cleanup } = mount(seed);
      button('Show case').click();
      const cube = c4.applyAlg(c4.solved(), parseAlg(scramble(), 4));
      const rects = [...root.querySelectorAll<SVGRectElement>('.case svg.scrambled rect')];
      const lit = rects.filter((r) => r.getAttribute('fill') !== RING_COLOUR);
      expect(lit).toHaveLength(8);
      for (const r of lit) {
        expect(r.getAttribute('fill')).toBe(FACE_COLOUR[c4.stickerAt(cube, vec(r.dataset.pos!), vec(r.dataset.normal!))].hex);
      }
      cleanup();
      document.body.innerHTML = '';
    }
  });

  it('shows the alg exactly as printed, independently of the case', () => {
    const { button, solution, caseSection, caseNumber } = mount(3);
    button('Show solution').click();
    expect(caseSection().hidden).toBe(true);
    expect(button('Hide solution').getAttribute('aria-expanded')).toBe('true');
    button('Show case').click();
    expect(solution().querySelector('.solution')!.textContent).toBe(L2E4_CASES[caseNumber() - 1].alg);
    expect(solution().querySelectorAll('.solution-note')).toHaveLength(0);
    button('Hide solution').click();
    expect(solution().hidden).toBe(true);
  });

  it('Next and space give a new scramble and reset both toggles', () => {
    const { scramble, button, caseSection, solution } = mount();
    const first = scramble();
    button('Show case').click();
    button('Show solution').click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', cancelable: true, bubbles: true }));
    expect(scramble()).not.toBe(first);
    expect(caseSection().hidden).toBe(true);
    expect(solution().hidden).toBe(true);
    expect(button('Show solution')).toBeDefined();
  });
});
