import type { Random } from '../../lib/random';
import { mountL2CScreen } from '../l2c/screen';
import { L2C6_CASES, L2C6_TOOLS } from './cases';
import { generateL2C6Scramble } from './scramble';

/** Mounts the 6x6 Last Two Centres trainer. Returns a cleanup function. */
export function mountL2C6(container: HTMLElement, random: Random = Math.random): () => void {
  return mountL2CScreen(
    container,
    {
      size: 6,
      caseCount: L2C6_CASES.length,
      generate: generateL2C6Scramble,
      lookalikes: L2C6_TOOLS.lookalikeCases,
      className: 'l2c-6x6',
    },
    random,
  );
}
