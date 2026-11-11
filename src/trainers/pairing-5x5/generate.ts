import type { Random } from '../../lib/random';
import { generatePairing, type PairingScramble } from '../pairing/generate';

export type { PairingScramble };
/** The scramble leaves at least this many of the 8 non-white edges unpaired. */
export const MIN_UNPAIRED = 6;
/** Scrambles are at most this many moves after merging. */
export const MAX_LENGTH = 60;

export const generatePairing5 = (random: Random = Math.random) =>
  generatePairing({ size: 5, minUnpaired: MIN_UNPAIRED, maxLength: MAX_LENGTH }, random);
