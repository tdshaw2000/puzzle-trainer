import { cubeModel } from '../../cube/cube';
import { invert, parseAlg, type Face } from '../../cube/notation';
import { L2C6_CASES, L2C6_TOOLS } from './cases';

const c6 = cubeModel(6);
const FACES: Face[] = ['U', 'D', 'F', 'B', 'R', 'L'];
const letters = (grid: Face[][], own: Face, other: Face) => grid.map((r) => r.map((s) => (s === own ? 'Y' : s === other ? 'G' : '?')).join('')).join('/');
const swap = (s: string) => s.replace(/[YG]/g, (ch) => (ch === 'Y' ? 'G' : 'Y'));

describe('6x6 L2C cases', () => {
  it('has the 32 distinct sheet cases, numbered in order', () => {
    expect(L2C6_CASES).toHaveLength(32);
    expect(L2C6_CASES.map((c) => c.number)).toEqual([...Array(32).keys()].map((i) => i + 1));
  });

  it('merges the duplicate listing into case 19, and no two cases are the same physical state', () => {
    expect(L2C6_CASES[18]).toMatchObject({ name: 'Pair and a Nice 3 Bar', alg: "3R U' Rw U 3Rw'" });
    const keys = L2C6_CASES.map((c) => L2C6_TOOLS.caseStateKey(c));
    expect(new Set(keys).size).toBe(32);
    expect(L2C6_TOOLS.lookalikeCases(19)).toEqual([]);
  });

  it('prints every alg the sheet gives: two for Inner and Outer Center, one otherwise', () => {
    expect(L2C6_CASES[0].algs).toEqual(["3L' U 3R U' 3L U 3R'", "3L' U 3R U' 3L U 3R' U'"]);
    expect(L2C6_CASES[1].algs).toEqual(["U F Rw U' 3L' U Rw' U' 3L", "3L' U 2R U' 3L U 2R'"]);
    for (const c of L2C6_CASES.slice(2)) expect(c.algs).toEqual([c.alg]);
  });

  for (const c of L2C6_CASES) {
    describe(`case ${c.number} ${c.name}`, () => {
      for (const alg of c.algs) {
        it(`${alg}: inverted, gives the pictured U and F centres and nothing else; the alg solves it`, () => {
          const cube = c6.applyAlg(c6.solved(), invert(parseAlg(alg, 6)));
          expect(letters(c6.centres(cube, 'U'), 'U', 'F')).toBe(c.u.replace(/\//g, '/'));
          expect(letters(c6.centres(cube, 'F'), 'F', 'U')).toBe(swap(c.f));
          for (const f of ['D', 'B', 'L', 'R'] as const) expect(c6.centres(cube, f).flat().every((s) => s === f)).toBe(true);
          const solved = c6.applyAlg(cube, parseAlg(alg, 6));
          for (const f of FACES) expect(c6.centres(solved, f).flat().every((s) => s === f)).toBe(true);
          expect(c6.isSolved(solved)).toBe(true);
        });
      }
    });
  }
});
