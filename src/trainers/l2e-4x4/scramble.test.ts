import { cubeModel } from '../../cube/cube';
import { edgeStickers, edgesFor, unpairedEdges } from '../../cube/edges';
import { FACES, sameVec } from '../../cube/geometry';
import { invert, parseAlg } from '../../cube/notation';
import { seeded } from '../../lib/random';
import { POSITIONS } from '../l2e/engine';
import { L2E4 } from './cases';

const c4 = cubeModel(4);
const EDGES = edgesFor(4);
const many = (n: number, seed = 1) => {
  const r = seeded(seed);
  return Array.from({ length: n }, () => L2E4.generate(r));
};
/** Edge slots holding the scramble's case pieces. */
const caseEdges = (s: ReturnType<typeof L2E4.generate>) =>
  EDGES.filter((e) => e.pieces.some((p) => s.casePieces.some((q) => sameVec(p, q))));

describe('4x4 L2E scramble', () => {
  it('leaves centres home, only the case edges unpaired, and the case pattern at the position', () => {
    for (const s of many(150)) {
      const cube = c4.applyAlg(c4.solved(), parseAlg(s.text, 4));
      expect(cube).toEqual(s.cube);
      for (const f of FACES) expect(c4.centres(cube, f).flat().every((x) => x === f)).toBe(true);
      expect(s.casePieces).toHaveLength(4);
      expect(unpairedEdges(cube, 4).sort()).toEqual(caseEdges(s).map((e) => e.faces.join('')).sort());
      const tracked = c4.applyAlg(c4.identity(), parseAlg(s.text, 4));
      expect(L2E4.patternOf(tracked, s.caseNumber - 1, s.position)).toBe(L2E4.casePattern(s.caseNumber - 1));
    }
  });

  it('uses no rotations and never turns the same layer twice in a row', () => {
    for (const s of many(100)) {
      expect(s.text).not.toMatch(/[xyzMES]/);
      const moves = parseAlg(s.text, 4);
      moves.slice(1).forEach((m, i) => expect([m.face, m.layer]).not.toEqual([moves[i].face, moves[i].layer]));
    }
  });

  it('every case, position and edge colour pair occurs', () => {
    const all = many(400, 3);
    expect(new Set(all.map((s) => s.caseNumber)).size).toBe(5);
    expect(new Set(all.map((s) => s.position))).toEqual(new Set(['F', 'R', 'B', 'L']));
    const colourPairs = new Set<string>();
    for (const s of all) {
      for (const e of caseEdges(s)) for (const [a, b] of edgeStickers(s.cube, e, c4.stickerAt)) colourPairs.add([a, b].sort().join(''));
    }
    expect(colourPairs.size).toBe(12);
  }, 30_000);

  it('gives the y hint for the position, shortening it for cases 1 and 2', () => {
    const edges = [{ edge: 0, flipped: false }, { edge: 1, flipped: false }];
    const hint = (caseIndex: number, position: (typeof POSITIONS)[number]) => L2E4.buildScramble({ caseIndex, position, edges }).yHint;
    expect(POSITIONS.map((p) => hint(4, p))).toEqual(['', 'y', 'y2', "y'"]);
    expect(POSITIONS.map((p) => hint(0, p))).toEqual(['', 'y', '', 'y']);
  });

  it('for every case and position, the hint then the alg pairs every edge with centres home', () => {
    for (let caseIndex = 0; caseIndex < 5; caseIndex++) {
      for (const position of POSITIONS) {
        const s = L2E4.buildScramble({ caseIndex, position, edges: [{ edge: 4, flipped: true }, { edge: 9, flipped: false }] });
        const after = c4.applyAlg(s.cube, parseAlg(`${s.yHint} ${s.caseAlg}`, 4));
        expect(unpairedEdges(after, 4)).toEqual([]);
        // the y hint turns the whole cube, so undo it before checking centres
        const back = c4.applyAlg(after, invert(parseAlg(s.yHint, 4)));
        for (const f of FACES) expect(c4.centres(back, f).flat().every((x) => x === f)).toBe(true);
      }
    }
  });

  it('the chosen edges are the ones in the case, and the setup is short', () => {
    for (let caseIndex = 0; caseIndex < 5; caseIndex++) {
      const s = L2E4.buildScramble({ caseIndex, position: 'R', edges: [{ edge: 4, flipped: false }, { edge: 9, flipped: true }] });
      const colours = new Set(caseEdges(s).flatMap((e) => edgeStickers(s.cube, e, c4.stickerAt).map(([a, b]) => [a, b].sort().join(''))));
      expect([...colours].sort()).toEqual([4, 9].map((i) => [...EDGES[i].faces].sort().join('')).sort());
    }
    for (const s of many(60)) expect(s.setup.length).toBeLessThanOrEqual(7);
    const start = { pos: [0, 1.5, 1.5] as const, normal: [0, 1, 0] as const };
    expect(L2E4.shortestSetup([start], [{ pos: [1.5, 1.5, 0], normal: [0, 1, 0] }])).toHaveLength(1);
  });
});
