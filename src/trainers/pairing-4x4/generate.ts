import type { Random } from '../../lib/random';
import { generatePairing, type PairingScramble } from '../pairing/generate';

export type { PairingScramble };
/** The scramble leaves at least this many of the 8 non-white edges unpaired. */
export const MIN_UNPAIRED = 6;
/** Scrambles are at most this many moves after merging. */
export const MAX_LENGTH = 60;

export const generatePairing4 = (random: Random = Math.random) =>
  generatePairing({ size: 4, minUnpaired: MIN_UNPAIRED, maxLength: MAX_LENGTH }, random);
