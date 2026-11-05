import { cubeModel } from '../../cube/cube';
import { seeded } from '../../lib/random';
import { L2C6_CASES } from './cases';
import { mountL2C6 } from './screen';

function mount(seed = 7) {
  const root = document.createElement('div');
  document.body.append(root);
  const cleanup = mountL2C6(root, seeded(seed));
  const scramble = () => root.querySelector('.scramble')!.textContent!;
  const caseSection = () => root.querySelector<HTMLElement>('.case')!;
  const solution = () => root.querySelector<HTMLElement>('.solution')!;
  const button = (name: string) => [...root.querySelectorAll('button')].find((b) => b.textContent === name) as HTMLButtonElement;
  return { root, cleanup, scramble, caseSection, solution, button };
}

afterEach(() => (document.body.innerHTML = ''));

describe('6x6 L2C trainer screen', () => {
  it('shows a scramble and the holding reminder, with case and solution hidden', () => {
    const { root, scramble, caseSection, solution, button } = mount();
    expect(scramble()).toMatch(/^[UDFBRLw23' ]+$/);
    expect(root.textContent).toContain('yellow on top, green in front');
    expect(caseSection().hidden).toBe(true);
    expect(solution().hidden).toBe(true);
    expect(button('Show case')).toBeDefined();
    expect(button('Show solution')).toBeDefined();
  });

  it('reveals and hides the case with number, name, hint and a 6x6 picture', () => {
    const { caseSection, button } = mount();
    button('Show case').click();
    const text = caseSection().textContent!;
    expect(text).toMatch(/Case \d+ of 32: \w+/);
    expect(text).toMatch(/Rotation: (no rotation|y|y'|y2)/);
    // Two scrambled faces and two sheet-picture faces, 36 stickers each.
    expect(caseSection().querySelectorAll('svg')).toHaveLength(2);
    expect(caseSection().querySelectorAll('.scrambled rect')).toHaveLength(72);
    button('Hide case').click();
    expect(caseSection().hidden).toBe(true);
    button('Show case').click();
    expect(caseSection().hidden).toBe(false);
  });

  it('shows the picture colours the scramble leaves', () => {
    const { caseSection, button } = mount();
    button('Show case').click();
    const fills = [...caseSection().querySelectorAll('.scrambled rect')].map((r) => r.getAttribute('fill'));
    expect(new Set(fills).size).toBeGreaterThanOrEqual(2);
    expect(cubeModel(6).size).toBe(6);
  });

  it('shows every printed alg for a case, as printed, one per line', () => {
    const seen = new Map<number, string[]>();
    for (let seed = 1; seed < 400 && seen.size < 2; seed++) {
      document.body.innerHTML = '';
      const { caseSection, solution, button } = mount(seed);
      button('Show case').click();
      const n = Number(/Case (\d+) of/.exec(caseSection().textContent!)![1]);
      button('Show solution').click();
      const lines = [...solution().querySelectorAll('.alg-line')].map((l) => l.textContent!);
      expect(lines).toEqual(L2C6_CASES[n - 1].algs);
      // Several algs are separated by an "OR" line, so they don't read as one long alg.
      expect([...solution().children].map((c) => c.textContent)).toEqual(
        L2C6_CASES[n - 1].algs.flatMap((a, i) => (i ? ['OR', a] : [a])),
      );
      expect(button('Hide solution')).toBeDefined();
      if (n <= 2) seen.set(n, lines);
    }
    expect(seen.get(1)).toHaveLength(2);
  });

  it('Next and a single space press give one new scramble and reset both toggles', () => {
    const { scramble, caseSection, solution, button } = mount();
    button('Show case').click();
    button('Show solution').click();
    const before = scramble();
    button('Next').click();
    expect(caseSection().hidden).toBe(true);
    expect(solution().hidden).toBe(true);
    expect(button('Show case')).toBeDefined();
    expect(button('Show solution')).toBeDefined();
    const second = scramble();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space' }));
    expect(scramble()).not.toBe(second);
    expect(before).toBeTruthy();
  });
});
