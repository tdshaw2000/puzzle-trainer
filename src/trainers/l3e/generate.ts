import { cubeModel, type Cube } from '../../cube/cube';
import { edgesFor, unpairedEdges } from '../../cube/edges';
import type { Vec } from '../../cube/geometry';
import { formatAlg, invert, parseAlg, simplify, type Move } from '../../cube/notation';
import { SIDE_ORDER, frameRotation, rewrite } from '../../cube/rotation';
import { pick, type Random } from '../../lib/random';

/**
 * 5x5 Last Three Edges: the last stage of Hoya 3-2-3 edge pairing. A scramble is a short run of
 * pairing steps undone from solved, keeping the centres and the white cross solved throughout.
 */

const c5 = cubeModel(5);
const P = (alg: string) => parseAlg(alg, 5);

/** The four vertical middle-layer slots (front pair, then back pair), named as `unpairedEdges` names them. */
export const MIDDLE_SLOTS = ['FR', 'FL', 'BR', 'BL'] as const;

export interface Step {
  kind: 'slice-flip' | 'insert';
  moves: Move[];
}

const SLICES = ['Uw', "Uw'", 'Uw2', 'Dw', "Dw'", 'Dw2'];
const FLIPS = ["R U R' F R' F' R", "L' U' L F' L F L'"];
const INSERTS = ["R U R'", "R U' R'", "R U2 R'", "L' U L", "L' U' L", "L' U2 L"];

/** Every step, written for each of the four sides (the trigger rewritten as if that side were F). */
export const STEPS: readonly Step[] = SIDE_ORDER.flatMap((side) => {
  const rot = frameRotation('U', side);
  return [
    ...FLIPS.flatMap((f) =>
      SLICES.map((s): Step => ({ kind: 'slice-flip', moves: [...P(s), ...rewrite(P(f), rot), ...invert(P(s))] })),
    ),
    ...INSERTS.map((a): Step => ({ kind: 'insert', moves: rewrite(P(a), rot) })),
  ];
});

const SLICE_FLIPS = STEPS.filter((s) => s.kind === 'slice-flip');
const INSERT_STEPS = STEPS.filter((s) => s.kind === 'insert');
const U_TURNS = ['', 'U', 'U2', "U'"].map(P);
const MIN_SLICE_FLIPS = 3;
/** Starts a walk again after this many tries without reaching exactly 3. */
const MAX_TRIES = 200;
/** Walks giving longer scrambles are started again, so a scramble stays quick to apply. */
export const MAX_LENGTH = 60;
/** Stops a broken random source (e.g. a constant stub) from hanging forever. */
const MAX_WALKS = 50;

export interface L3EScramble {
  text: string;
  /** The cube after the scramble, held yellow U, green F. */
  cube: Cube;
  /** The slots holding the last 3 edges, in F, R, B, L order. */
  unpaired: string[];
  /** Positions of every piece in those slots. */
  pieces: Vec[];
  /** The steps the scramble was built from, each with the U turn before it. */
  steps: Array<Step & { u: Move[] }>;
}

const middleOnly = (unpaired: string[]) => unpaired.every((e) => (MIDDLE_SLOTS as readonly string[]).includes(e));

export function generateL3E(random: Random = Math.random): L3EScramble {
  for (let walk = 0; walk < MAX_WALKS; walk++) {
    let cube = c5.solved();
    const steps: L3EScramble['steps'] = [];
    let flips = 0;
    for (let tries = 0; tries < MAX_TRIES; tries++) {
      const u = pick(random, U_TURNS);
      const step = pick(random, random() < 0.5 ? SLICE_FLIPS : INSERT_STEPS);
      const next = c5.applyAlg(cube, [...u, ...step.moves]);
      const unpaired = unpairedEdges(next, 5);
      if (unpaired.length > 3 || !middleOnly(unpaired)) continue;
      cube = next;
      steps.push({ ...step, u });
      if (step.kind === 'slice-flip') flips++;
      if (flips >= MIN_SLICE_FLIPS && unpaired.length === 3) {
        const moves = simplify(steps.flatMap((s) => [...s.u, ...s.moves]));
        if (moves.length > MAX_LENGTH) break;
        const slots = MIDDLE_SLOTS.filter((e) => unpaired.includes(e));
        const pieces = edgesFor(5)
          .filter((e) => (slots as string[]).includes(e.faces.join('')))
          .flatMap((e) => [...e.pieces]);
        return { text: formatAlg(moves), cube, unpaired: slots, pieces, steps };
      }
    }
  }
  throw new Error('Could not build a Last Three Edges scramble: is the random source broken?');
}
