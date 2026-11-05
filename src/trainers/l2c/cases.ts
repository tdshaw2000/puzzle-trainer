import { cubeModel } from '../../cube/cube';
import { invert, parseAlg, type Face } from '../../cube/notation';

export interface L2CCase {
  /** Position on the CubeSkills sheet, reading order, "Solved" left out. */
  number: number;
  /** The sheet's main alg, exactly as printed. */
  alg: string;
  /** Every alg the sheet prints for the case, the main one first. */
  algs: readonly string[];
  /** The sheet's name for the case, where it has one. */
  name?: string;
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

export const L2C_CASES: readonly L2CCase[] = ALGS.map((alg, i) => ({ number: i + 1, alg, algs: [alg] }));

const turn = (g: string[][]) => g.map((_, r) => g.map((_, c) => g[g.length - 1 - c][r]));

/** The case-state helpers for an N×N cube and its cases. */
export function l2cCaseTools(size: number, cases: readonly L2CCase[]) {
  const model = cubeModel(size);

  /** A face's centres as own/other colour, in the quarter-turn orientation that sorts first. */
  function facePattern(cube: ReturnType<typeof model.solved>, face: Face): string {
    let grid: string[][] = model.centres(cube, face).map((row) => row.map((s) => (s === face ? 'o' : 'x')));
    const keys: string[] = [];
    for (let i = 0; i < 4; i++, grid = turn(grid)) keys.push(grid.flat().join(''));
    return keys.sort()[0];
  }

  /**
   * Identifies the physical state of a case once each face may be turned freely and
   * either face may play the sheet's top. Cases with the same key look identical.
   */
  function caseStateKey(c: L2CCase): string {
    const cube = model.applyAlg(model.solved(), invert(parseAlg(c.alg, size)));
    return [facePattern(cube, 'U'), facePattern(cube, 'F')].sort().join('|');
  }

  /** Other sheet cases that are the same physical state as case `number`. */
  function lookalikeCases(number: number): L2CCase[] {
    const key = caseStateKey(cases[number - 1]);
    return cases.filter((c) => c.number !== number && caseStateKey(c) === key);
  }
  return { caseStateKey, lookalikeCases };
}

const tools5 = l2cCaseTools(5, L2C_CASES);
export const caseStateKey = tools5.caseStateKey;

/** Other sheet cases that are the same physical state as case `number`. */
export const lookalikeCases = tools5.lookalikeCases;
