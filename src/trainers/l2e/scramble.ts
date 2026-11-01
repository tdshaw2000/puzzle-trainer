import { SLOTS, applyAlg, identityCube, slotAt, solvedCube, type Cube } from '../../cube/cube';
import { EDGES, type Edge } from '../../cube/edges';
import { NORMAL, rotateClockwise, sameVec, dot, type Vec } from '../../cube/geometry';
import { formatAlg, move, simplify, type Face, type Move } from '../../cube/notation';
import { frameRotation, rewrite } from '../../cube/rotation';
import { pick, randomInt, type Random } from '../../lib/random';
import { L2E_CASES, caseSetup, guideStickers, isY2Symmetric, regrip } from './cases';

/** Where the guide's front edge can sit, and the y turn that brings it to the front. */
export const POSITIONS: readonly Face[] = ['F', 'R', 'B', 'L'];
const Y_HINT: Record<string, string> = { F: '', R: 'y', B: 'y2', L: "y'" };
const Y2: Record<string, Face> = { F: 'B', R: 'L', B: 'F', L: 'R' };

export interface L2EScramble {
  text: string;
  caseNumber: number;
  caseAlg: string;
  printedAlg?: string;
  /** Whether the alg ends with the cube turned, and the rotation that puts white back on D. */
  regrip: string;
  /** Where the guide's front edge is, as reported (shorter rotation for y2-symmetric cases). */
  position: Face;
  yHint: string;
  /** The cube after the scramble, held yellow U, green F. */
  cube: Cube;
  /** Positions of the case's pieces (both U-layer edges at the case's position). */
  casePieces: Vec[];
  /** The setup part of the scramble (outer turns choosing which edges form the case). */
  setup: Move[];
}

/** An edge's place on the cube at the 3x3 level: where its midge is and where its first sticker faces. */
interface EdgeState {
  pos: Vec;
  normal: Vec;
}

const stateKey = (s: EdgeState) => `${s.pos}|${s.normal}`;
const OUTER: Move[] = (['U', 'D', 'F', 'B', 'R', 'L'] as const).flatMap((f) => [1, 2, 3].map((t) => move(f, 'outer', t)!));

function turnEdge(s: EdgeState, m: Move): EdgeState {
  const axis = NORMAL[m.face];
  if (dot(s.pos, axis) !== 2) return s;
  let { pos, normal } = s;
  for (let t = 0; t < m.turns; t++) {
    pos = rotateClockwise(pos, axis);
    normal = rotateClockwise(normal, axis);
  }
  return { pos, normal };
}

/** A shortest sequence of outer turns taking each start state to its goal state (breadth-first). */
export function shortestSetup(starts: EdgeState[], goals: EdgeState[]): Move[] {
  const key = (ss: EdgeState[]) => ss.map(stateKey).join(';');
  const goalKey = key(goals);
  const seen = new Map<string, Move[]>([[key(starts), []]]);
  let frontier: Array<[EdgeState[], Move[]]> = [[starts, []]];
  if (key(starts) === goalKey) return [];
  while (frontier.length) {
    const next: Array<[EdgeState[], Move[]]> = [];
    for (const [states, path] of frontier) {
      for (const m of OUTER) {
        if (path.length && path[path.length - 1].face === m.face) continue;
        const moved = states.map((s) => turnEdge(s, m));
        const k = key(moved);
        if (seen.has(k)) continue;
        const p = [...path, m];
        if (k === goalKey) return p;
        seen.set(k, p);
        next.push([moved, p]);
      }
    }
    frontier = next;
  }
  throw new Error('Unreachable edge placement');
}

const midgeOf = (e: Edge) => e.pieces[1];

/**
 * The edges (at the 3x3 level) whose pieces the case setup gathers into the case, as the
 * state each must be in before the setup: midge position and the face its sticker that
 * ends up first in the case faces.
 */
function caseSources(caseMoves: Move[], position: Face): EdgeState[] {
  const tracked = applyAlg(identityCube(), caseMoves);
  const sources = new Map<string, EdgeState>();
  for (const [p, n] of guideStickers(position)) {
    const from = SLOTS[tracked[slotAt(p, n)]];
    const edge = EDGES.find((e) => e.pieces.some((q) => sameVec(q, from.pos)))!;
    const k = edge.faces.join('');
    if (!sources.has(k)) sources.set(k, { pos: midgeOf(edge), normal: NORMAL[edge.faces[0]] });
  }
  return [...sources.values()];
}

export interface ScrambleChoice {
  caseIndex: number;
  position: Face;
  /** For each source edge slot, which edge goes there (index into EDGES) and whether flipped. */
  edges: Array<{ edge: number; flipped: boolean }>;
}

export function buildScramble(choice: ScrambleChoice): L2EScramble {
  const { caseIndex, position } = choice;
  const c = L2E_CASES[caseIndex];
  const caseMoves = rewrite(caseSetup(caseIndex), frameRotation('U', position));
  const sources = caseSources(caseMoves, position);
  const starts = choice.edges.slice(0, sources.length).map(({ edge }) => ({
    pos: midgeOf(EDGES[edge]),
    normal: NORMAL[EDGES[edge].faces[0]],
  }));
  const goals = sources.map((s, i) => {
    if (!choice.edges[i].flipped) return s;
    const e = EDGES.find((x) => sameVec(midgeOf(x), s.pos))!;
    return { pos: s.pos, normal: NORMAL[e.faces[sameVec(s.normal, NORMAL[e.faces[0]]) ? 1 : 0]] };
  });
  const setup = shortestSetup(starts, goals);
  const moves = simplify([...setup, ...caseMoves]);
  const cube = applyAlg(solvedCube(), moves);

  const shown = isY2Symmetric(caseIndex) && (position === 'B' || position === 'L') ? Y2[position] : position;
  const { vec } = frameRotation('U', position);
  const casePieces = [-2, 2].flatMap((z) => [-1, 0, 1].map((x) => vec([x, 2, z])));
  return {
    text: formatAlg(moves),
    caseNumber: c.number,
    caseAlg: c.alg,
    ...(c.printedAlg ? { printedAlg: c.printedAlg } : {}),
    regrip: regrip(caseIndex),
    position: shown,
    yHint: Y_HINT[shown],
    cube,
    casePieces,
    setup,
  };
}

/** Picks distinct random edges with random flips for each of the case's source slots. */
export function generateL2EScramble(random: Random = Math.random): L2EScramble {
  const caseIndex = randomInt(random, L2E_CASES.length);
  const position = pick(random, POSITIONS);
  const pool = EDGES.map((_, i) => i);
  const edges = [0, 1].map(() => {
    const edge = pool.splice(randomInt(random, pool.length), 1)[0];
    return { edge, flipped: random() < 0.5 };
  });
  return buildScramble({ caseIndex, position, edges });
}
