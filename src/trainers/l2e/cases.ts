import type { Vec } from '../../cube/geometry';
import type { Face } from '../../cube/notation';
import { frameRotation } from '../../cube/rotation';
import { canonical, l2eEngine, type L2ECase } from './engine';

export { canonical, type L2ECase };

const ALGS = [
  "M U' R' U R' F R F' M'",
  'Rw2 F2 U2 Rw2 U2 F2 Rw2',
  "Rw U2 Rw U2 Rw' U2 Rw U2 Lw' U2 Rw U2 Rw' U2 x' Rw' U2 Rw' U2 M'",
  "Rw' U' R' U R' F R F' Rw",
  "Lw U' R' U R' F R F' Lw'",
  "Rw2 B2 Rw' U2 Rw' U2' x'U2 Rw' U2' Rw U2 Rw' U2' Rw2",
  "Rw U2 Rw2 U2 Rw' U2 Rw U2 Rw' U2 Rw2 U2 Rw",
  "Rw' U2 Rw2 U2 Rw U2 Rw' U2 Rw U2 Rw2 U2 Rw'",
  "Rw' U2 Rw' U2 B2 Rw' B2 Rw' F2 Lw2 F2 Rw U2 Rw2",
  "Lw' U2 Lw' U2 F2 Lw' F2 Rw U2 Rw' U2 Lw2",
  "Lw2 F2 U2 Lw' U2 Lw2 F2 Lw' U2 Lw2 U2 F2 Lw' F2",
  "Rw2 F2 U2 Lw' U2 Lw2 F2 Lw' U2 Rw2 U2 F2 Rw F2",
];

/** The 12 cases of the Kewbz 5x5 L2E guide. */
export const L2E_CASES: readonly L2ECase[] = ALGS.map((alg, i) => ({
  number: i + 1,
  alg,
  ...(i === 0 ? { printedAlg: "M' U' R' U R' F R F' M" } : {}),
}));

/**
 * The 12 stickers the guide pictures, as (position, normal) in the cube's frame when the
 * guide's front edge is at `front`: B-side row, U row of UB, U row of UF, F-side row,
 * each read left to right as seen from above with the guide's front at the bottom.
 */
export function guideStickers(front: Face): Array<[Vec, Vec]> {
  const { vec } = frameRotation('U', front);
  const row = (z: number, normal: Vec) => [-1, 0, 1].map((x): [Vec, Vec] => [vec([x, 2, z]), vec(normal)]);
  return [...row(-2, [0, 0, -1]), ...row(-2, [0, 1, 0]), ...row(2, [0, 1, 0]), ...row(2, [0, 0, 1])];
}

/** The 5x5 L2E trainer: every case is on UB and UF. */
export const L2E5 = l2eEngine({ size: 5, cases: L2E_CASES, caseStickers: () => guideStickers('F') });

/** The pictured pattern a tracked cube shows with the guide's front edge at `front`. */
export const patternOf = (tracked: readonly number[], front: Face) => L2E5.patternOf(tracked, 0, front);
export const regrip = (i: number) => L2E5.regrip(i);
export const caseSetup = (i: number) => L2E5.caseSetup(i);
export const casePattern = (i: number) => L2E5.casePattern(i);
export const isY2Symmetric = (i: number) => L2E5.isY2Symmetric(i);
