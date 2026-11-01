import { applyAlg, centres, solvedCube } from '../../cube/cube';
import { FACES } from '../../cube/geometry';
import { unpairedEdges } from '../../cube/edges';
import { invert, parseAlg } from '../../cube/notation';
import { L2E_CASES, caseSetup, casePattern, canonical, isY2Symmetric, regrip } from './cases';

/** The guide's pictures, transcribed: B-side row, U row of UB, U row of UF, F-side row, left to right. */
const PICTURES = [
  'BRBRBROGOGOG',
  'RORBGBGBGORO',
  'RRRBBBOGOGOG',
  'RROBBGBOGRGO',
  'ORRGBBGOBOGR',
  'RORBGBOBOGRG',
  'RBGBROBGOROG',
  'GBRORBOGBGOR',
  'RBOBRGOGRGOB',
  'RRGBBOGGROOB',
  'RROBBGBGGROO',
  'ORRGBBGGBOOR',
];

describe('L2E cases', () => {
  it('has the 12 guide cases in page order', () => {
    expect(L2E_CASES.map((c) => c.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(L2E_CASES[1].alg).toBe('Rw2 F2 U2 Rw2 U2 F2 Rw2');
    expect(L2E_CASES[5].alg).toBe("Rw2 B2 Rw' U2 Rw' U2' x'U2 Rw' U2' Rw U2 Rw' U2' Rw2");
  });

  it('case 1 uses the corrected alg and remembers the printed one', () => {
    expect(L2E_CASES[0].alg).toBe("M U' R' U R' F R F' M'");
    expect(L2E_CASES[0].printedAlg).toBe("M' U' R' U R' F R F' M");
    expect(L2E_CASES.slice(1).every((c) => c.printedAlg === undefined)).toBe(true);
  });

  it.each(L2E_CASES.map((c, i) => [c.number, i] as const))('case %i: the inverted alg gives the pictured case', (_, i) => {
    expect(casePattern(i)).toBe(canonical(PICTURES[i].split('')));
  });

  it.each(L2E_CASES.map((c, i) => [c.number, i] as const))('case %i: the setup keeps centres home and the alg solves it', (_, i) => {
    const scrambled = applyAlg(solvedCube(), caseSetup(i));
    for (const f of FACES) expect(centres(scrambled, f).flat().every((s) => s === f)).toBe(true);
    expect(unpairedEdges(scrambled).length).toBeGreaterThan(0);
    const after = applyAlg(scrambled, parseAlg(`${L2E_CASES[i].alg} ${regrip(i)}`));
    expect(after).toEqual(solvedCube());
  });

  it('only case 6 ends with the cube turned', () => {
    expect(L2E_CASES.map((_, i) => regrip(i))).toEqual(['', '', '', '', '', 'x', '', '', '', '', '', '']);
  });

  it('the printed case 1 alg solves UF and DF, not the picture', () => {
    const cube = applyAlg(solvedCube(), invert(parseAlg("M' U' R' U R' F R F' M")));
    expect(unpairedEdges(cube).sort()).toEqual(['DF', 'UF']);
  });

  it('knows which cases look the same after y2', () => {
    expect(L2E_CASES.filter((_, i) => isY2Symmetric(i)).map((c) => c.number)).toEqual([1, 2, 7, 8, 11, 12]);
  });
});
