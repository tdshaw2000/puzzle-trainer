import type { Random } from '../../lib/random';
import { mountPairing } from '../pairing/screen';
import { MAX_LENGTH, MIN_UNPAIRED } from './generate';

/** Mounts the 6x6 Edge Pairing trainer. Returns a cleanup function. */
export const mountPairing6 = (container: HTMLElement, random: Random = Math.random) =>
  mountPairing(container, { size: 6, minUnpaired: MIN_UNPAIRED, maxLength: MAX_LENGTH }, 'pairing-6x6', random);
