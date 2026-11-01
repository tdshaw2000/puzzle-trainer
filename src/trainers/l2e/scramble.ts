import type { Random } from '../../lib/random';
import { L2E5 } from './cases';
import type { EdgeState, L2EScramble, ScrambleChoice } from './engine';

export { POSITIONS, type L2EScramble, type ScrambleChoice } from './engine';

export const shortestSetup = (starts: EdgeState[], goals: EdgeState[]) => L2E5.shortestSetup(starts, goals);
export const buildScramble = (choice: ScrambleChoice): L2EScramble => L2E5.buildScramble(choice);
export const generateL2EScramble = (random: Random = Math.random): L2EScramble => L2E5.generate(random);
