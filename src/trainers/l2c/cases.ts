import { applyAlg, centres, solvedCube } from '../../cube/cube';
import { invert, parseAlg, type Face } from '../../cube/notation';

export interface L2CCase {
  /** Position on the CubeSkills sheet, reading order, "Solved" left out. */
  number: number;
  /** The sheet's suggested alg, exactly as printed. */
  alg: string;
}

const ALGS = [
  "(Rw U Rw') U (Rw U2' Rw')",
  "(Rw U' Rw') U' (Rw U2' Rw')",
  "Rw U' M' U Rw' U' M",
  "(Rw U Rw')",
  "(Rw U Rw') U' (Rw U' Rw')",
  "(Rw U' Rw')",
  "(Rw U' Rw') U (Rw U Rw')",
  "(Rw U' Rw') U' (Rw U' Rw')",
  "(Rw U2' Rw') U (Rw U2' Rw')",
  "(Rw U Rw') U (Rw U Rw')",
  "(Rw U2 Rw') U' (Rw U2 Rw')",
  "(Rw U' Rw' U) (Rw U' Rw' U) (Rw U' Rw')",
  "(Rw U' Rw') U2 (Rw U' Rw')",
  "(Rw U2 Rw')",
  "(Rw U2' Rw') U2 (Rw U' Rw')",
  "(Rw U Rw') U' (Rw U2 Rw')",
  "(Rw U' Rw') U (Rw U2' Rw')",
  "(Rw U' Rw') U (Rw U' Rw')",
  "(Rw U Rw') U' (Rw U Rw')",
];

export const L2C_CASES: readonly L2CCase[] = ALGS.map((alg, i) => ({ number: i + 1, alg }));

const turn = (g: string[][]) => g.map((_, r) => g.map((_, c) => g[2 - c][r]));

/** A face's centres as own/other colour, in the quarter-turn orientation that sorts first. */
function facePattern(cube: ReturnType<typeof solvedCube>, face: Face): string {
  let grid: string[][] = centres(cube, face).map((row) => row.map((s) => (s === face ? 'o' : 'x')));
  const keys: string[] = [];
  for (let i = 0; i < 4; i++, grid = turn(grid)) keys.push(grid.flat().join(''));
  return keys.sort()[0];
}

/**
 * Identifies the physical state of a case once each face may be turned freely and
 * either face may play the sheet's top. Cases with the same key look identical.
 */
export function caseStateKey(c: L2CCase): string {
  const cube = applyAlg(solvedCube(), invert(parseAlg(c.alg)));
  return [facePattern(cube, 'U'), facePattern(cube, 'F')].sort().join('|');
}

/** Other sheet cases that are the same physical state as case `number`. */
export function lookalikeCases(number: number): L2CCase[] {
  const key = caseStateKey(L2C_CASES[number - 1]);
  return L2C_CASES.filter((c) => c.number !== number && caseStateKey(c) === key);
}
