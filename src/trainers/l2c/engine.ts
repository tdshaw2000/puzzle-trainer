import { cubeModel, type Cube } from '../../cube/cube';
import { formatAlg, invert, move, parseAlg, simplify, type Face } from '../../cube/notation';
import { frameRotation, rewrite, SIDE_ORDER, SIDE_PAIRS } from '../../cube/rotation';
import { pick, randomInt, type Random } from '../../lib/random';
import type { L2CCase } from './cases';

const Y_HINT: Record<string, string> = { F: '', R: 'y', B: 'y2', L: "y'" };

export interface L2CScramble {
  text: string;
  caseNumber: number;
  caseAlg: string;
  /** Every alg the sheet prints for the case, the main one first. */
  caseAlgs: readonly string[];
  caseName?: string;
  /** Faces playing the sheet's U and F, and the extra clockwise quarter turns actually applied. */
  top: Face;
  front: Face;
  topTurns: number;
  frontTurns: number;
  /** The pair as seen looking at its shared edge with yellow on top. */
  left: Face;
  right: Face;
  /** Rotation that brings `left` to the front ('' when it is already there). */
  yHint: string;
  /** Both case faces after the scramble, as sticker origins (see faceGrid). */
  faces: { left: Face[][]; right: Face[][] };
}

export interface ScrambleChoice {
  caseIndex: number;
  top: Face;
  front: Face;
  topTurns: number;
  frontTurns: number;
}

/** The size-independent L2C scramble builder, for an N×N cube and its sheet's cases. */
export function l2cEngine(size: number, cases: readonly L2CCase[]) {
  const model = cubeModel(size);

  /** `face`'s centres after turning it `turns` quarter turns clockwise. */
  const centresAfter = (cube: Cube, face: Face, turns: number) =>
    model.centres(model.applyAlg(cube, [move(face, 'outer', turns)].filter((m) => m !== null)), face).flat().join('');

  /** The fewest quarter turns of `face` that leave its centres as `turns` would (e.g. 2 -> 0 on a half-turn-symmetric face). */
  function fewestTurns(cube: Cube, face: Face, turns: number): number {
    const target = centresAfter(cube, face, turns);
    for (let n = 0; n < turns; n++) if (centresAfter(cube, face, n) === target) return n;
    return turns;
  }

  /** The case setup and the two case faces' orientation turns, nothing else: other outer turns never move centres. */
  function buildScramble(choice: ScrambleChoice): L2CScramble {
    const { caseIndex, top, front } = choice;
    const c = cases[caseIndex];
    const caseMoves = rewrite(invert(parseAlg(c.alg, size)), frameRotation(top, front));
    const setup = model.applyAlg(model.solved(), caseMoves);
    // Turning one case face never changes the other's centres, so each reduces on its own.
    const topTurns = fewestTurns(setup, top, choice.topTurns);
    const frontTurns = fewestTurns(setup, front, choice.frontTurns);
    const orientation = [move(top, 'outer', topTurns), move(front, 'outer', frontTurns)].filter((m) => m !== null);
    const moves = simplify([...caseMoves, ...orientation]);

    const cube = model.applyAlg(model.solved(), moves);
    const [left, right] = SIDE_ORDER[(SIDE_ORDER.indexOf(top) + 1) % 4] === front ? [top, front] : [front, top];
    return {
      text: formatAlg(moves),
      caseNumber: c.number,
      caseAlg: c.alg,
      caseAlgs: c.algs,
      caseName: c.name,
      top,
      front,
      topTurns,
      frontTurns,
      left,
      right,
      yHint: Y_HINT[left],
      faces: { left: model.faceGrid(cube, left), right: model.faceGrid(cube, right) },
    };
  }

  function generateL2CScramble(random: Random = Math.random): L2CScramble {
    const [top, front] = pick(random, SIDE_PAIRS);
    return buildScramble({
      caseIndex: randomInt(random, cases.length),
      top,
      front,
      topTurns: randomInt(random, 4),
      frontTurns: randomInt(random, 4),
    });
  }

  return { buildScramble, generateScramble: generateL2CScramble };
}
