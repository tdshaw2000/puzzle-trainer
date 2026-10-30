import { applyAlg, faceGrid, solvedCube } from '../../cube/cube';
import { formatAlg, invert, move, parseAlg, simplify, type Face, type Move } from '../../cube/notation';
import { frameRotation, rewrite, SIDE_ORDER, SIDE_PAIRS } from '../../cube/rotation';
import { pick, randomInt, type Random } from '../../lib/random';
import { L2C_CASES } from './cases';

export const PREFIX_LENGTH = 20;

const OUTER_FACES: readonly Face[] = ['U', 'D', 'F', 'B', 'R', 'L'];
const Y_HINT: Record<string, string> = { F: '', R: 'y', B: 'y2', L: "y'" };

export interface L2CScramble {
  text: string;
  caseNumber: number;
  caseAlg: string;
  /** Faces playing the sheet's U and F, and their extra clockwise quarter turns. */
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
  random: Random;
}

/**
 * Random outer turns, no face twice in a row. Every case alg inverts to something starting
 * with a wide or slice turn, so the prefix never merges into the case moves.
 */
function randomPrefix(random: Random): Move[] {
  const moves: Move[] = [];
  while (moves.length < PREFIX_LENGTH) {
    const prev = moves[moves.length - 1]?.face;
    const faces = OUTER_FACES.filter((f) => f !== prev);
    moves.push(move(pick(random, faces), 'outer', 1 + randomInt(random, 3))!);
  }
  return moves;
}

export function buildScramble({ caseIndex, top, front, topTurns, frontTurns, random }: ScrambleChoice): L2CScramble {
  const c = L2C_CASES[caseIndex];
  const caseMoves = rewrite(invert(parseAlg(c.alg)), frameRotation(top, front));
  const orientation = [move(top, 'outer', topTurns), move(front, 'outer', frontTurns)].filter((m) => m !== null);
  const moves = simplify([...randomPrefix(random), ...caseMoves, ...orientation]);

  const cube = applyAlg(solvedCube(), moves);
  const [left, right] = SIDE_ORDER[(SIDE_ORDER.indexOf(top) + 1) % 4] === front ? [top, front] : [front, top];
  return {
    text: formatAlg(moves),
    caseNumber: c.number,
    caseAlg: c.alg,
    top,
    front,
    topTurns,
    frontTurns,
    left,
    right,
    yHint: Y_HINT[left],
    faces: { left: faceGrid(cube, left), right: faceGrid(cube, right) },
  };
}

export function generateL2CScramble(random: Random = Math.random): L2CScramble {
  const [top, front] = pick(random, SIDE_PAIRS);
  return buildScramble({
    caseIndex: randomInt(random, L2C_CASES.length),
    top,
    front,
    topTurns: randomInt(random, 4),
    frontTurns: randomInt(random, 4),
    random,
  });
}
