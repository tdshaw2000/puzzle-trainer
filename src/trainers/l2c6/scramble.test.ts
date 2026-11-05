import { cubeModel } from '../../cube/cube';
import { parseAlg, type Face } from '../../cube/notation';
import { SIDE_PAIRS } from '../../cube/rotation';
import { seeded } from '../../lib/random';
import { L2C6_CASES } from './cases';
import { buildScramble6, generateL2C6Scramble } from './scramble';

const c6 = cubeModel(6);
const FACES: Face[] = ['U', 'D', 'F', 'B', 'R', 'L'];
const solvedCentres = (cube: ReturnType<typeof c6.solved>, f: Face) => c6.centres(cube, f).flat().every((s) => s === f);

describe('6x6 L2C scramble', () => {
  it('lands every case on every face pair and orientation with only the two case faces unsolved', () => {
    for (const c of L2C6_CASES) {
      for (const [top, front] of SIDE_PAIRS) {
        for (const [topTurns, frontTurns] of [[0, 0], [1, 2], [3, 1]]) {
          const s = buildScramble6({ caseIndex: c.number - 1, top, front, topTurns, frontTurns });
          const cube = c6.applyAlg(c6.solved(), parseAlg(s.text, 6));
          for (const f of FACES) expect(solvedCentres(cube, f)).toBe(f !== top && f !== front);
          expect(s.faces.left).toEqual(c6.faceGrid(cube, s.left));
          expect(s.caseAlgs).toEqual(c.algs);
          expect(s.caseName).toBe(c.name);
        }
      }
    }
  });

  it('is only the case setup and orientation turns: no rotations, no same-layer neighbours', () => {
    const random = seeded(3);
    for (let i = 0; i < 300; i++) {
      const s = generateL2C6Scramble(random);
      expect(s.text).toMatch(/^[UDFBRLw23' ]+$/);
      expect(s.text).not.toMatch(/[xyz]/);
      const moves = parseAlg(s.text, 6);
      moves.forEach((m, j) => {
        const next = moves[j + 1];
        if (next) expect(next.face === m.face && next.layer === m.layer).toBe(false);
      });
      // Not longer than the longest alg plus the two orientation turns.
      expect(moves.length).toBeLessThanOrEqual(16);
    }
  });

  it('produces every case, face pair and role over many scrambles', () => {
    const random = seeded(11);
    const cases = new Set<number>();
    const pairs = new Set<string>();
    for (let i = 0; i < 3000; i++) {
      const s = generateL2C6Scramble(random);
      cases.add(s.caseNumber);
      pairs.add(s.top + s.front);
    }
    expect(cases.size).toBe(32);
    expect(pairs.size).toBe(8);
  });

  it('gives the rotation hint for the left face of the pair', () => {
    const hints: Record<string, string> = { F: '', R: 'y', B: 'y2', L: "y'" };
    const random = seeded(5);
    for (let i = 0; i < 50; i++) {
      const s = generateL2C6Scramble(random);
      expect(s.yHint).toBe(hints[s.left]);
    }
  });

  it('wastes no orientation turn', () => {
    const random = seeded(8);
    for (let i = 0; i < 200; i++) {
      const s = generateL2C6Scramble(random);
      const c = L2C6_CASES[s.caseNumber - 1];
      expect(c).toBeDefined();
      if (s.topTurns) {
        const less = buildScramble6({ caseIndex: s.caseNumber - 1, top: s.top, front: s.front, topTurns: s.topTurns - 1, frontTurns: s.frontTurns });
        expect(less.faces.left.flat().join() + less.faces.right.flat().join()).not.toBe(s.faces.left.flat().join() + s.faces.right.flat().join());
      }
    }
  });
});
