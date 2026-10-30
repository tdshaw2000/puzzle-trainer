import { applyAlg, centres, faceGrid, solvedCube } from '../../cube/cube';
import { NORMAL, rotateClockwise, sameVec } from '../../cube/geometry';
import { formatAlg, invert, move, parseAlg, simplify, type Face } from '../../cube/notation';
import { frameRotation, rewrite, SIDE_PAIRS } from '../../cube/rotation';
import { seeded } from '../../lib/random';
import { L2C_CASES } from './cases';
import { buildScramble, generateL2CScramble } from './scramble';

const solvedCentres = (cube: ReturnType<typeof solvedCube>, f: Face) => centres(cube, f).flat().every((s) => s === f);

describe('buildScramble', () => {
  for (const c of L2C_CASES) {
    it(`case ${c.number} lands correctly for every face pair and orientation`, () => {
      for (const [top, front] of SIDE_PAIRS) {
        for (let topTurns = 0; topTurns < 4; topTurns++) {
          for (let frontTurns = 0; frontTurns < 4; frontTurns++) {
            const s = buildScramble({ caseIndex: c.number - 1, top, front, topTurns, frontTurns });
            const cube = applyAlg(solvedCube(), parseAlg(s.text));

            for (const f of ['U', 'D', 'F', 'B', 'R', 'L'] as const) {
              expect(solvedCentres(cube, f)).toBe(f !== top && f !== front);
            }
            // Undo the face orientation turns, then the sheet alg rewritten for these faces: centres solve.
            const undo = [move(front, 'outer', -s.frontTurns), move(top, 'outer', -s.topTurns)].filter((m) => m !== null);
            const solved = applyAlg(applyAlg(cube, undo), rewrite(parseAlg(c.alg), frameRotation(top, front)));
            for (const f of ['U', 'D', 'F', 'B', 'R', 'L'] as const) expect(solvedCentres(solved, f)).toBe(true);
            expect(s.faces.left).toEqual(faceGrid(cube, s.left));
            expect(s.faces.right).toEqual(faceGrid(cube, s.right));

            // Nothing but the case setup and the orientation turns actually applied.
            const caseMoves = rewrite(invert(parseAlg(c.alg)), frameRotation(top, front));
            const turns = [move(top, 'outer', s.topTurns), move(front, 'outer', s.frontTurns)].filter((m) => m !== null);
            expect(s.text).toBe(formatAlg(simplify([...caseMoves, ...turns])));
            for (const m of parseAlg(s.text)) {
              if (m.layer === 'outer') expect([top, front]).toContain(m.face);
            }

            // The applied turn gives the same centres as the requested one, and is never wasted.
            const requested = applyAlg(
              solvedCube(),
              [...caseMoves, move(top, 'outer', topTurns), move(front, 'outer', frontTurns)].filter((m) => m !== null),
            );
            for (const f of [top, front]) expect(centres(cube, f)).toEqual(centres(requested, f));
            for (const [f, n] of [[top, s.topTurns], [front, s.frontTurns]] as const) {
              if (n === 0) continue;
              const without = applyAlg(applyAlg(solvedCube(), caseMoves), turns.filter((m) => m.face !== f));
              expect(centres(without, f)).not.toEqual(centres(cube, f));
            }
          }
        }
      }
    });
  }
});

describe('generateL2CScramble', () => {
  const scrambles = Array.from({ length: 3000 }, (_, i) => generateL2CScramble(seeded(i + 100)));

  it('uses every case', () => {
    expect(new Set(scrambles.map((s) => s.caseNumber)).size).toBe(19);
  });

  it('uses every face pair with both roles', () => {
    expect(new Set(scrambles.map((s) => s.top + s.front)).size).toBe(8);
  });

  it('uses every combination of face orientations', () => {
    expect(new Set(scrambles.map((s) => `${s.topTurns}${s.frontTurns}`)).size).toBe(16);
  });

  it('has no redundant moves or rotations', () => {
    for (const s of scrambles.slice(0, 300)) {
      const moves = parseAlg(s.text);
      for (let i = 1; i < moves.length; i++) {
        expect(moves[i].face === moves[i - 1].face && moves[i].layer === moves[i - 1].layer).toBe(false);
      }
      expect(s.text).not.toMatch(/[xyz]/);
    }
  });

  it('reports the left/right faces and y hint', () => {
    // y turns the cube like U: count the quarter turns that bring the left face to the front.
    const hintFor = (face: Face) => {
      let v = NORMAL[face];
      for (let n = 0; n < 4; n++, v = rotateClockwise(v, NORMAL.U)) {
        if (sameVec(v, NORMAL.F)) return ['', 'y', 'y2', "y'"][n];
      }
    };
    const right: Record<string, string> = { F: 'R', R: 'B', B: 'L', L: 'F' };
    for (const s of scrambles.slice(0, 100)) {
      expect(right[s.left]).toBe(s.right);
      expect([s.left, s.right].sort()).toEqual([s.top, s.front].sort());
      expect(s.yHint).toBe(hintFor(s.left));
      expect(s.caseAlg).toBe(L2C_CASES[s.caseNumber - 1].alg);
    }
  });
});
