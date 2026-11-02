import { edgesFor } from '../../cube/edges';
import { NORMAL, type Vec } from '../../cube/geometry';
import { l2eEngine, type L2ECase } from '../l2e/engine';

const ALGS = [
  "Lw' U2 Rw' D2 Rw U2 Rw' D2 Rw2 x'",
  "x' Rw2 D2 Rw' U2 Rw D2 Rw' U2 Lw'",
  "Rw U2 Rw D Rw' U2 Rw D' Rw2'",
  "Rw2 D Rw' U2 Rw D' Rw' U2 Rw'",
  "R' (Uw' R U R' F R' F' R Uw) R",
];

/** The 5 cases of the CubeSkills "4x4 – Useful Last 2 Edge Algorithms" sheet, main algs as printed except for missing spaces, which are put back. */
export const L2E4_CASES: readonly L2ECase[] = ALGS.map((alg, i) => ({ number: i + 1, alg }));

/** The edge slots each case's picture shows unpaired (sheet frame: yellow U, green F). */
const CASE_EDGES = [['UF', 'UB'], ['UF', 'UB'], ['UF', 'UR'], ['UF', 'UR'], ['UR', 'FL']];

const EDGES = edgesFor(4);
const slot = (name: string) => EDGES.find((e) => [...e.faces].sort().join('') === [...name].sort().join(''))!;

/** Every sticker of the case's edge pieces, edge by edge. */
function caseStickers(i: number): Array<[Vec, Vec]> {
  return CASE_EDGES[i].flatMap((name) => {
    const e = slot(name);
    return e.pieces.flatMap((p): Array<[Vec, Vec]> => e.faces.map((f) => [p, NORMAL[f]]));
  });
}

export const L2E4 = l2eEngine({ size: 4, cases: L2E4_CASES, caseStickers });
