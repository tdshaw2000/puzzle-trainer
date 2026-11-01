import { applyAlg, centres, identityCube, solvedCube, stickerAt } from '../../cube/cube';
import { EDGES, edgeName, edgeStickers, unpairedEdges } from '../../cube/edges';
import { FACES } from '../../cube/geometry';
import { parseAlg } from '../../cube/notation';
import { seeded } from '../../lib/random';
import { L2E_CASES, casePattern, patternOf } from './cases';
import { POSITIONS, buildScramble, generateL2EScramble, shortestSetup } from './scramble';

const OPP = { F: 'B', R: 'L', B: 'F', L: 'R' } as const;
const many = (n: number, seed = 1) => {
  const r = seeded(seed);
  return Array.from({ length: n }, () => generateL2EScramble(r));
};

describe('L2E scramble', () => {
  it('leaves centres home, only the case edges unpaired, and the case at the reported position', () => {
    for (const s of many(150)) {
      const cube = applyAlg(solvedCube(), parseAlg(s.text));
      expect(cube).toEqual(s.cube);
      for (const f of FACES) expect(centres(cube, f).flat().every((x) => x === f)).toBe(true);
      const caseEdges = [`U${s.position}`, `U${OPP[s.position as keyof typeof OPP]}`];
      for (const u of unpairedEdges(cube)) expect(caseEdges).toContain(u);
      expect(unpairedEdges(cube).length).toBe(s.caseNumber === 3 ? 1 : 2);
      // pattern read with the guide's front edge at the reported position
      const tracked = applyAlg(identityCube(), parseAlg(s.text));
      expect(patternOf(tracked, s.position)).toBe(casePattern(s.caseNumber - 1));
    }
  });

  it('uses no rotations and never turns the same layer twice in a row', () => {
    for (const s of many(100)) {
      expect(s.text).not.toMatch(/[xyz]/);
      const moves = parseAlg(s.text);
      moves.slice(1).forEach((m, i) => expect([m.face, m.layer]).not.toEqual([moves[i].face, moves[i].layer]));
    }
  });

  it('every case, position and edge colour pair occurs', () => {
    const all = many(600, 3);
    expect(new Set(all.map((s) => s.caseNumber)).size).toBe(12);
    expect(new Set(all.map((s) => s.position))).toEqual(new Set(['F', 'R', 'B', 'L']));
    const colourPairs = new Set<string>();
    for (const s of all) {
      for (const n of [`U${s.position}`, `U${OPP[s.position as keyof typeof OPP]}`]) {
        const edge = EDGES.find((e) => edgeName(e) === n)!;
        for (const [a, b] of edgeStickers(s.cube, edge, stickerAt)) colourPairs.add([a, b].sort().join(''));
      }
    }
    expect(colourPairs.size).toBe(12);
  }, 30_000);

  it('gives the y hint for the reported position, shortening it for cases that look the same after y2', () => {
    const edges = [
      { edge: 0, flipped: false },
      { edge: 1, flipped: false },
    ];
    const hint = (caseIndex: number, position: (typeof POSITIONS)[number]) =>
      buildScramble({ caseIndex, position, edges }).yHint;
    expect(POSITIONS.map((p) => hint(3, p))).toEqual(['', 'y', 'y2', "y'"]);
    expect(POSITIONS.map((p) => hint(1, p))).toEqual(['', 'y', '', 'y']);
  });

  it('the setup is a shortest outer-turn placement', () => {
    // UF's midge sticker on U to UR facing U: one U turn is enough, nothing shorter
    const start = { pos: [0, 2, 2] as const, normal: [0, 1, 0] as const };
    expect(shortestSetup([start], [start])).toEqual([]);
    const setup = shortestSetup([start], [{ pos: [2, 2, 0], normal: [0, 1, 0] }]);
    expect(setup).toHaveLength(1);
    for (const s of many(60)) expect(s.setup.length).toBeLessThanOrEqual(7);
  });

  it('carries the case details, with case 1 remembering the printed alg', () => {
    const s = buildScramble({ caseIndex: 0, position: 'F', edges: [{ edge: 0, flipped: false }, { edge: 1, flipped: true }] });
    expect(s.caseNumber).toBe(1);
    expect(s.caseAlg).toBe(L2E_CASES[0].alg);
    expect(s.printedAlg).toBe("M' U' R' U R' F R F' M");
    expect(buildScramble({ caseIndex: 5, position: 'F', edges: [{ edge: 0, flipped: false }, { edge: 1, flipped: false }] }).regrip).toBe('x');
  });
});
