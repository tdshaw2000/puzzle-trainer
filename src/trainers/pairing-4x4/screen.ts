import type { Random } from '../../lib/random';
import { mountPairing } from '../pairing/screen';
import { MAX_LENGTH, MIN_UNPAIRED } from './generate';

/** Mounts the 4x4 Edge Pairing trainer. Returns a cleanup function. */
export const mountPairing4 = (container: HTMLElement, random: Random = Math.random) =>
  mountPairing(container, { size: 4, minUnpaired: MIN_UNPAIRED, maxLength: MAX_LENGTH }, 'pairing-4x4', random);
