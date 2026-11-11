import { cubeModel, type Cube } from '../../cube/cube';
import { edgeName, edgesFor, unpairedEdges } from '../../cube/edges';
import type { Vec } from '../../cube/geometry';
import { formatAlg, simplify, type Move } from '../../cube/notation';
import { pick, type Random } from '../../lib/random';
import { STEPS, type Step } from '../l3e/generate';

/**
 * Edge Pairing: the start of the Hoya edge-pairing stage. A scramble is a run of pairing
 * steps undone from solved (the same steps as the 5x5 Last 3 Edges trainer; moves do not depend
 * on cube size), keeping the centres and the white cross solved throughout.
 */

export interface PairingConfig {
  size: number;
  /** The scramble leaves at least this many of the 8 non-white edges unpaired. */
  minUnpaired: number;
  /** Scrambles are at most this many moves after merging. */
  maxLength: number;
}

/** Candidates drawn at each point; the one leaving most edges unpaired is taken. */
const CANDIDATES = 8;
const MAX_STEPS = 60;
/** Stops a broken random source (e.g. a constant stub) from hanging forever. */
const MAX_WALKS = 50;

const SLICE_FLIPS = STEPS.filter((s) => s.kind === 'slice-flip');
const INSERTS = STEPS.filter((s) => s.kind === 'insert');
const U_TURNS: Move[][] = [[], [{ face: 'U', layer: 'outer', turns: 1 }], [{ face: 'U', layer: 'outer', turns: 2 }], [{ face: 'U', layer: 'outer', turns: 3 }]];

export interface PairingScramble {
  text: string;
  /** The cube after the scramble, held yellow U, green F. */
  cube: Cube;
  /** Names of the unpaired edges. */
  unpaired: string[];
  /** Positions of every wing of those edges. */
  pieces: Vec[];
  steps: Array<Step & { u: Move[] }>;
}

export function generatePairing(config: PairingConfig, random: Random = Math.random): PairingScramble {
  const { size, minUnpaired, maxLength } = config;
  const model = cubeModel(size);
  const edges = edgesFor(size);
  for (let walk = 0; walk < MAX_WALKS; walk++) {
    let cube = model.solved();
    const steps: PairingScramble['steps'] = [];
    for (let n = 0; n < MAX_STEPS; n++) {
      let best: { cube: Cube; count: number; step: Step; u: Move[] } | null = null;
      for (let k = 0; k < CANDIDATES; k++) {
        const u = pick(random, U_TURNS);
        const step = pick(random, random() < 0.7 ? SLICE_FLIPS : INSERTS);
        const next = model.applyAlg(cube, [...u, ...step.moves]);
        const count = unpairedEdges(next, size).length;
        if (!best || count > best.count) best = { cube: next, count, step, u };
      }
      cube = best!.cube;
      steps.push({ ...best!.step, u: best!.u });
      if (best!.count >= minUnpaired) {
        const moves = simplify(steps.flatMap((s) => [...s.u, ...s.moves]));
        if (moves.length > maxLength) break;
        const unpaired = unpairedEdges(cube, size);
        const pieces = edges.filter((e) => unpaired.includes(edgeName(e))).flatMap((e) => [...e.pieces]);
        return { text: formatAlg(moves), cube, unpaired, pieces, steps };
      }
    }
  }
  throw new Error('Could not build an Edge Pairing scramble: is the random source broken?');
}
