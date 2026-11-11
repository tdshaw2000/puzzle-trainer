import type { Random } from '../../lib/random';
import { mountPairing } from '../pairing/screen';
import { MAX_LENGTH, MIN_UNPAIRED } from './generate';

/** Mounts the 5x5 Edge Pairing trainer. Returns a cleanup function. */
export const mountPairing5 = (container: HTMLElement, random: Random = Math.random) =>
  mountPairing(container, { size: 5, minUnpaired: MIN_UNPAIRED, maxLength: MAX_LENGTH }, 'pairing-5x5', random);
