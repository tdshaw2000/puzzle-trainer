import { applyAlg, centres, solvedCube } from '../../cube/cube';
import { invert, parseAlg } from '../../cube/notation';
import { L2C_CASES, lookalikeCases } from './cases';

const caseState = (alg: string) => applyAlg(solvedCube(), invert(parseAlg(alg)));

describe('L2C sheet cases', () => {
  it('has the 19 non-solved cases', () => {
    expect(L2C_CASES).toHaveLength(19);
    expect(L2C_CASES.map((c) => c.number)).toEqual([...Array(19)].map((_, i) => i + 1));
  });

  it.each(L2C_CASES.map((c) => [c.number, c.alg]))('case %i (%s) only mixes U and F centres', (_, alg) => {
    const s = caseState(alg);
    for (const f of ['D', 'B', 'L', 'R'] as const) expect(centres(s, f).flat().every((x) => x === f)).toBe(true);
    const f = centres(s, 'F');
    for (const row of f) expect(row.slice(0, 2)).toEqual(['F', 'F']);
    expect(centres(s, 'U').flat().every((x) => x === 'U')).toBe(false);
  });

  it('all 19 cases are different', () => {
    const patterns = L2C_CASES.map((c) => {
      const s = caseState(c.alg);
      return JSON.stringify([centres(s, 'U'), centres(s, 'F')]);
    });
    expect(new Set(patterns).size).toBe(19);
  });
});

describe('lookalike cases', () => {
  it('pairs 1 with 2 and 4 with 6, which differ only by face turns or swapped roles', () => {
    expect(lookalikeCases(1).map((c) => c.number)).toEqual([2]);
    expect(lookalikeCases(2).map((c) => c.number)).toEqual([1]);
    expect(lookalikeCases(4).map((c) => c.number)).toEqual([6]);
    expect(lookalikeCases(6).map((c) => c.number)).toEqual([4]);
  });

  it('leaves the other 15 cases distinct', () => {
    const alone = L2C_CASES.filter((c) => lookalikeCases(c.number).length === 0);
    expect(alone.map((c) => c.number)).toEqual([3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  });
});
