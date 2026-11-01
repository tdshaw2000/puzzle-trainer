import { cubeModel } from '../../cube/cube';
import { unpairedEdges } from '../../cube/edges';
import { FACES, type Vec } from '../../cube/geometry';
import { parseAlg } from '../../cube/notation';
import { canonical } from '../l2e/engine';
import { L2E4, L2E4_CASES } from './cases';

const c4 = cubeModel(4);
const U: Vec = [0, 1, 0];
const F: Vec = [0, 0, 1];
const R: Vec = [1, 0, 0];

/** The visible case stickers on the sheet (yellow U, green F, orange R), with their colours. */
const STICKERS: Record<string, Array<[Vec, Vec]>> = {
  UBu: [[[-0.5, 1.5, -1.5], U], [[0.5, 1.5, -1.5], U]],
  UFu: [[[-0.5, 1.5, 1.5], U], [[0.5, 1.5, 1.5], U]],
  UFf: [[[-0.5, 1.5, 1.5], F], [[0.5, 1.5, 1.5], F]],
  URu: [[[1.5, 1.5, -0.5], U], [[1.5, 1.5, 0.5], U]],
  URr: [[[1.5, 1.5, 0.5], R], [[1.5, 1.5, -0.5], R]],
  FLf: [[[-1.5, 0.5, 1.5], F], [[-1.5, -0.5, 1.5], F]],
};
const PICTURES: Array<Record<string, string>> = [
  { UBu: 'RG', UFu: 'RG', UFf: 'BY' },
  { UBu: 'RG', UFu: 'YB', UFf: 'GR' },
  { UFu: 'YB', UFf: 'GR', URu: 'YB', URr: 'RG' },
  { UFu: 'YB', UFf: 'GR', URu: 'RG', URr: 'YB' },
  { URu: 'YR', URr: 'BG', FLf: 'YR' },
];
const PICTURED_EDGES = [['UB', 'UF'], ['UB', 'UF'], ['UF', 'UR'], ['UF', 'UR'], ['FL', 'UR']];

const caseCube = (i: number) => c4.applyAlg(c4.identity(), L2E4.caseSetup(i));
const colourCube = (i: number) => c4.applyAlg(c4.solved(), L2E4.caseSetup(i));
const sortName = (n: string) => [...n].sort().join('');

describe('4x4 L2E cases', () => {
  it('has the 5 sheet cases with their main algs as printed', () => {
    expect(L2E4_CASES.map((c) => c.alg)).toEqual([
      "Lw' U2 Rw' D2 Rw U2 Rw' D2 Rw2 x'",
      "x' Rw2 D2 Rw' U2 Rw D2 Rw' U2 Lw'",
      "Rw U2 Rw D Rw' U2 Rw D' Rw2'",
      "Rw2 D Rw' U2 Rw D' Rw' U2Rw'",
      "R' (Uw' R U R' F R' F'R Uw) R",
    ]);
    expect(L2E4_CASES.map((c) => c.number)).toEqual([1, 2, 3, 4, 5]);
    expect(L2E4_CASES.every((c) => c.printedAlg === undefined)).toBe(true);
  });

  it.each([0, 1, 2, 3, 4])('case %i: the inverted alg gives the pictured stickers and unpairs only the pictured edges', (i) => {
    const tracked = caseCube(i);
    const seen: string[] = [];
    const letters: string[] = [];
    for (const [k, colours] of Object.entries(PICTURES[i])) {
      STICKERS[k].forEach(([p, n], j) => {
        seen.push(L2E4.origin(tracked[c4.slotAt(p, n)]));
        letters.push(colours[j]);
      });
    }
    expect(canonical(seen)).toBe(canonical(letters));
    expect(unpairedEdges(colourCube(i), 4).map(sortName).sort()).toEqual(PICTURED_EDGES[i].map(sortName).sort());
  });

  it.each([0, 1, 2, 3, 4])('case %i: centres stay home and the alg solves it with no re-grip', (i) => {
    const cube = colourCube(i);
    for (const f of FACES) expect(c4.centres(cube, f).flat().every((s) => s === f)).toBe(true);
    expect(L2E4.regrip(i)).toBe('');
    expect(unpairedEdges(c4.applyAlg(cube, parseAlg(L2E4_CASES[i].alg, 4)), 4)).toEqual([]);
    expect(c4.isSolved(c4.applyAlg(cube, parseAlg(L2E4_CASES[i].alg, 4)))).toBe(true);
  });

  it('cases 1 and 2 look the same after y2', () => {
    expect([0, 1, 2, 3, 4].filter((i) => L2E4.isY2Symmetric(i))).toEqual([0, 1]);
  });
});
