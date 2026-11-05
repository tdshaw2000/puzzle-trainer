import { l2cEngine } from './engine';
import { L2C_CASES } from './cases';

export type { L2CScramble, ScrambleChoice } from './engine';

const engine = l2cEngine(5, L2C_CASES);

/** The case setup and the two case faces' orientation turns, nothing else: other outer turns never move centres. */
export const buildScramble = engine.buildScramble;
export const generateL2CScramble = engine.generateScramble;
