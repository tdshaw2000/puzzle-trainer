import { cubeModel, type Cube, type CubeModel } from '../../cube/cube';
import { edgesFor, type Edge } from '../../cube/edges';
import { NORMAL, dot, faceOf, rotateClockwise, sameVec, type Vec } from '../../cube/geometry';
import { formatAlg, invert, move, parseAlg, simplify, type Face, type Move } from '../../cube/notation';
import { frameRotation, rewrite } from '../../cube/rotation';
import { pick, randomInt, type Random } from '../../lib/random';

/**
 * The size-independent part of a last-two-edges trainer: cases checked against their pictures,
 * and scrambles built as a shortest outer-turn setup plus the inverted alg.
 */

export interface L2ECase {
  /** Position on the source sheet, reading order. */
  number: number;
  /** The alg the trainer shows: the sheet's, exactly as printed, except where `printedAlg` is set. */
  alg: string;
  /** The sheet's printed alg, when it doesn't solve the pictured case and `alg` corrects it. */
  printedAlg?: string;
}

export interface L2EDefinition {
  size: number;
  cases: readonly L2ECase[];
  /**
   * The stickers that make up case `i`, as (position, normal) in the sheet's frame (front at F):
   * every sticker of the case's edge pieces, in a fixed order.
   */
  caseStickers(i: number): Array<[Vec, Vec]>;
}

/** Where the sheet's front can sit, and the y turn that brings it back to the front. */
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
  /** Where the sheet's front is, as reported (shorter rotation for y2-symmetric cases). */
  position: Face;
  yHint: string;
  /** The cube after the scramble, held yellow U, green F. */
  cube: Cube;
  /** Positions of the case's pieces, in the cube's frame. */
  casePieces: Vec[];
  /** The setup part of the scramble (outer turns choosing which edges form the case). */
  setup: Move[];
}

/** An edge's place at the 3x3 level: the middle of its slot and where its first sticker faces. */
export interface EdgeState {
  pos: Vec;
  normal: Vec;
}

export interface ScrambleChoice {
  caseIndex: number;
  position: Face;
  /** For each source edge slot, which edge goes there (index into the size's edges) and whether flipped. */
  edges: Array<{ edge: number; flipped: boolean }>;
}

/** Relabels by first appearance, so patterns compare regardless of which colours they use. */
export function canonical(labels: readonly string[]): string {
  const names = new Map<string, string>();
  return labels.map((l) => names.get(l) ?? names.set(l, String.fromCharCode(97 + names.size)).get(l)!).join('');
}

const ROTATIONS = ['', 'x', "x'", 'x2', 'z', "z'"].flatMap((a) => ['', 'y', "y'", 'y2'].map((b) => `${a} ${b}`.trim()));

export interface L2EEngine {
  def: L2EDefinition;
  model: CubeModel;
  edges: readonly Edge[];
  /** The whole-cube rotation that puts the centres back home after the case's alg, '' for most. */
  regrip(i: number): string;
  /** Moves that build case `i` from solved with every centre at home: the alg and its re-grip, inverted. */
  caseSetup(i: number): Move[];
  /** Which original sticker (edge slot and face) each case sticker shows, relabelled, with the sheet's front at `front`. */
  patternOf(tracked: readonly number[], i: number, front: Face): string;
  /** Case `i`'s pattern, as the sheet pictures it. */
  casePattern(i: number): string;
  /** True when the case looks the same from behind (after y2). */
  isY2Symmetric(i: number): boolean;
  /** Which original sticker (edge slot and face) a slot's sticker started as, e.g. 'UF:U'; '' for non-edges. */
  origin(slot: number): string;
  shortestSetup(starts: EdgeState[], goals: EdgeState[]): Move[];
  buildScramble(choice: ScrambleChoice): L2EScramble;
  generate(random?: Random): L2EScramble;
}

export function l2eEngine(def: L2EDefinition): L2EEngine {
  const model = cubeModel(def.size);
  const edges = edgesFor(def.size);
  const { outer } = model;
  const parse = (alg: string) => parseAlg(alg, def.size);

  const centresHome = (cube: Cube) =>
    (['U', 'D', 'F', 'B', 'R', 'L'] as const).every((f) => model.centres(cube, f).flat().every((s) => s === f));

  const REGRIPS = new Map<number, string>();
  function regrip(i: number): string {
    const cached = REGRIPS.get(i);
    if (cached !== undefined) return cached;
    const moves = parse(def.cases[i].alg);
    const r = ROTATIONS.find((rot) => centresHome(model.applyAlg(model.solved(), [...moves, ...parse(rot)])));
    if (r === undefined) throw new Error(`Case ${i + 1}'s alg does not solve the centres`);
    REGRIPS.set(i, r);
    return r;
  }

  const caseSetup = (i: number) => invert(parse(`${def.cases[i].alg} ${regrip(i)}`));

  const ORIGINS = model.SLOTS.map(({ pos, normal }) => {
    const big = [0, 1, 2].filter((axis) => Math.abs(pos[axis]) === outer);
    if (big.length !== 2) return '';
    const faces = big.map((axis) => faceOf([0, 1, 2].map((k) => (k === axis ? Math.sign(pos[axis]) : 0)) as unknown as Vec));
    return `${faces.join('')}:${faceOf(normal)}`;
  });
  const origin = (slot: number) => ORIGINS[slot];

  function stickersAt(i: number, front: Face): Array<[Vec, Vec]> {
    const { vec } = frameRotation('U', front);
    return def.caseStickers(i).map(([p, n]) => [vec(p), vec(n)]);
  }

  const patternOf = (tracked: readonly number[], i: number, front: Face) =>
    canonical(stickersAt(i, front).map(([p, n]) => origin(tracked[model.slotAt(p, n)])));

  const CUBES = new Map<number, readonly number[]>();
  function caseCube(i: number) {
    if (!CUBES.has(i)) CUBES.set(i, model.applyAlg(model.identity(), caseSetup(i)));
    return CUBES.get(i)!;
  }

  const casePattern = (i: number) => patternOf(caseCube(i), i, 'F');

  const SYMMETRIC = new Map<number, boolean>();
  function isY2Symmetric(i: number): boolean {
    if (!SYMMETRIC.has(i)) SYMMETRIC.set(i, patternOf(caseCube(i), i, 'B') === casePattern(i));
    return SYMMETRIC.get(i)!;
  }

  const stateKey = (s: EdgeState) => `${s.pos}|${s.normal}`;
  const OUTER: Move[] = (['U', 'D', 'F', 'B', 'R', 'L'] as const).flatMap((f) => [1, 2, 3].map((t) => move(f, 'outer', t)!));

  function turnEdge(s: EdgeState, m: Move): EdgeState {
    const axis = NORMAL[m.face];
    if (dot(s.pos, axis) !== outer) return s;
    let { pos, normal } = s;
    for (let t = 0; t < m.turns; t++) {
      pos = rotateClockwise(pos, axis);
      normal = rotateClockwise(normal, axis);
    }
    return { pos, normal };
  }

  /** A shortest sequence of outer turns taking each start state to its goal state (breadth-first). */
  function shortestSetup(starts: EdgeState[], goals: EdgeState[]): Move[] {
    const key = (ss: EdgeState[]) => ss.map(stateKey).join(';');
    const goalKey = key(goals);
    if (key(starts) === goalKey) return [];
    const seen = new Set<string>([key(starts)]);
    let frontier: Array<[EdgeState[], Move[]]> = [[starts, []]];
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
          seen.add(k);
          next.push([moved, p]);
        }
      }
      frontier = next;
    }
    throw new Error('Unreachable edge placement');
  }

  const edgeAt = (pos: Vec) => edges.find((e) => e.pieces.some((q) => sameVec(q, pos)))!;

  /**
   * The edges (at the 3x3 level) whose pieces the case setup gathers into the case, as the state
   * each must be in before the setup: slot middle and the face its first-read case sticker faces.
   */
  function caseSources(caseMoves: Move[], i: number, position: Face): EdgeState[] {
    const tracked = model.applyAlg(model.identity(), caseMoves);
    const sources = new Map<string, EdgeState>();
    for (const [p, n] of stickersAt(i, position)) {
      const edge = edgeAt(model.SLOTS[tracked[model.slotAt(p, n)]].pos);
      const k = edge.faces.join('');
      if (!sources.has(k)) sources.set(k, { pos: edge.mid, normal: NORMAL[edge.faces[0]] });
    }
    return [...sources.values()];
  }

  function buildScramble(choice: ScrambleChoice): L2EScramble {
    const { caseIndex, position } = choice;
    const c = def.cases[caseIndex];
    const caseMoves = rewrite(caseSetup(caseIndex), frameRotation('U', position));
    const sources = caseSources(caseMoves, caseIndex, position);
    if (sources.length > choice.edges.length) throw new Error(`Case ${c.number} needs ${sources.length} edges, ${choice.edges.length} chosen`);
    const starts = choice.edges.slice(0, sources.length).map(({ edge }) => ({
      pos: edges[edge].mid,
      normal: NORMAL[edges[edge].faces[0]],
    }));
    const goals = sources.map((s, k) => {
      if (!choice.edges[k].flipped) return s;
      const e = edges.find((x) => sameVec(x.mid, s.pos))!;
      return { pos: s.pos, normal: NORMAL[e.faces[sameVec(s.normal, NORMAL[e.faces[0]]) ? 1 : 0]] };
    });
    const setup = shortestSetup(starts, goals);
    const moves = simplify([...setup, ...caseMoves]);
    const cube = model.applyAlg(model.solved(), moves);

    const shown = isY2Symmetric(caseIndex) && (position === 'B' || position === 'L') ? Y2[position] : position;
    const casePieces: Vec[] = [];
    for (const [p] of stickersAt(caseIndex, position)) if (!casePieces.some((q) => sameVec(q, p))) casePieces.push(p);
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

  /** Picks distinct random edges with random flips for the case's source slots. */
  function generate(random: Random = Math.random): L2EScramble {
    const caseIndex = randomInt(random, def.cases.length);
    const position = pick(random, POSITIONS);
    const pool = edges.map((_, i) => i);
    const chosen = [0, 1].map(() => {
      const edge = pool.splice(randomInt(random, pool.length), 1)[0];
      return { edge, flipped: random() < 0.5 };
    });
    return buildScramble({ caseIndex, position, edges: chosen });
  }

  return {
    def,
    model,
    edges,
    regrip,
    caseSetup,
    patternOf,
    casePattern,
    isY2Symmetric,
    origin,
    shortestSetup,
    buildScramble,
    generate,
  };
}
