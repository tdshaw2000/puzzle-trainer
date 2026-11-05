import { l2cEngine } from '../l2c/engine';
import { L2C6_CASES } from './cases';

const engine = l2cEngine(6, L2C6_CASES);

export const buildScramble6 = engine.buildScramble;
export const generateL2C6Scramble = engine.generateScramble;
