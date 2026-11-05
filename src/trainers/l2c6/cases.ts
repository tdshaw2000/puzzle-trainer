import type { L2CCase } from '../l2c/cases';
import { l2cCaseTools } from '../l2c/cases';

/** A sheet entry: its name, printed algs (main first) and the pictured 4x4 centre blocks of the sheet's U and F faces (Y = yellow, G = green, rows from the top). */
interface SheetCase {
  name: string;
  algs: string[];
  u: string;
  f: string;
}

/**
 * The 32 distinct cases of the SpeedCubeDB "6x6 Last Two Centers" sheet, in sheet order. The sheet prints 33 entries;
 * "Pair and a Nice 3 Bar" and the first "L and a Bar" are the same picture and alg, so they are one case here, number 19.
 * Algs are as printed.
 */
export const SHEET_CASES: readonly SheetCase[] = [
  { name: "Inner Center", algs: ["3L' U 3R U' 3L U 3R'", "3L' U 3R U' 3L U 3R' U'"], u: "YYYY/YGYY/YYYY/YYYY", f: "GGGG/GYGG/GGGG/GGGG" },
  { name: "Outer Center", algs: ["U F Rw U' 3L' U Rw' U' 3L", "3L' U 2R U' 3L U 2R'"], u: "YGYY/YYYY/YYYY/YYYY", f: "GYGG/GGGG/GGGG/GGGG" },
  { name: "Front 3 Bar", algs: ["U Rw U 3R U Rw' U' 3R'"], u: "YYGY/YYYY/YYYY/GYGG", f: "GGGY/GGGY/GGGY/GGGY" },
  { name: "Back 3 Bar", algs: ["U' Rw U' 3R U' Rw' U 3R'"], u: "GYGG/YYYY/YYYY/YYGY", f: "GGGY/GGGY/GGGY/GGGY" },
  { name: "Pair and Split", algs: ["U' Rw U' Rw' U' 3R U Rw U' Rw' U Rw U' 3Rw'"], u: "YYGG/YYYY/YYYY/GYGY", f: "GGGY/GGGY/GGGY/GGGY" },
  { name: "Pair and Split", algs: ["U Rw U Rw' U 3R U' Rw U Rw' U' Rw U 3Rw'"], u: "GYGY/YYYY/YYYY/YYGG", f: "GGGY/GGGY/GGGY/GGGY" },
  { name: "Two Splits", algs: ["U Rw U Lw' 3R U Rw' U' Lw 3R'"], u: "GYGY/YYYY/YYYY/GYGY", f: "GGGY/GGGY/GGGY/GGGY" },
  { name: "Two Pairs", algs: ["U' Rw U 3Lw' U Rw' U' 3Lw"], u: "YYGG/YYYY/YYYY/YYGG", f: "GGGY/GGGY/GGGY/GGGY" },
  { name: "Split and a Pair", algs: ["Rw U Rw' U2 Rw U' 3Lw' U Rw' U' 3Lw"], u: "YYGY/YYYY/YYYY/YYGY", f: "GGGG/GGGY/GGGY/GGGG" },
  { name: "Split and a Bar", algs: ["Rw U Rw' U2 Rw U 3R U' Rw' U 3R'"], u: "GYGY/YYYY/YYYY/YYGY", f: "GGGG/GGGY/GGGY/GGGY" },
  { name: "Split and a Bar", algs: ["Rw U' Rw' U2 Rw U' 3R U Rw' U' 3R'"], u: "YYGY/YYYY/YYYY/GYGY", f: "GGGY/GGGY/GGGY/GGGG" },
  { name: "Pair and a Bar", algs: ["U2 Rw U Rw' U2 Rw U' 3R U Rw' U' 3R'"], u: "YYGY/YYYY/YYYY/YYGG", f: "GGGG/GGGY/GGGY/GGGY" },
  { name: "Pair and a Bar", algs: ["U2 Rw U' Rw' U2 Rw U 3R U' Rw' U 3R'"], u: "YYGG/YYYY/YYYY/YYGY", f: "GGGY/GGGY/GGGY/GGGG" },
  { name: "Split and a Bad Bar", algs: ["U' Rw U Rw' U Rw 3L' U' Rw' U 3L"], u: "YYGY/YYYY/YYYY/GYGY", f: "GGGG/GGGY/GGGY/GGGY" },
  { name: "Split and a Bad Bar", algs: ["U Rw U' Rw' U' Rw 3L' U Rw' U' 3L"], u: "GYGY/YYYY/YYYY/YYGY", f: "GGGY/GGGY/GGGY/GGGG" },
  { name: "Pair and a Bad Bar", algs: ["U Rw U Rw' U 3Rw U' Rw' U 3R'"], u: "YYGG/YYYY/YYYY/YYGY", f: "GGGG/GGGY/GGGY/GGGY" },
  { name: "Pair and a Bad Bar", algs: ["U' Rw U' Rw' U' 3Rw U Rw' U' 3R'"], u: "YYGY/YYYY/YYYY/YYGG", f: "GGGY/GGGY/GGGY/GGGG" },
  { name: "Stray Obliques", algs: ["3Rw U' Rw' U' Rw U2 3Rw' U Rw U Rw'"], u: "YYYY/YYYG/YYYY/YGYY", f: "GGGG/GGGY/GGGY/GGGG" },
  { name: "Pair and a Nice 3 Bar", algs: ["3R U' Rw U 3Rw'"], u: "YYYG/YYYG/YYYG/YYYY", f: "GGGG/GGGG/GGGY/GGYY" },
  { name: "L and a Bar", algs: ["U' 3Rw U Rw' U' 3R'"], u: "YYYG/YYYG/YYYY/YGYY", f: "GGGG/GGGY/GGGY/GGGY" },
  { name: "Pair and a Bad Bar", algs: ["U2 3Lw' U' Lw U 3L U Rw U Rw'"], u: "YYYY/YYYG/YYYY/GGYY", f: "GGGG/GGGY/GGGY/GGGY" },
  { name: "Pair and a Bad Bar", algs: ["U 3Lw' U Lw U' 3L U' Rw U' Rw'"], u: "YYYG/YYYG/YYYY/YGYY", f: "GGGY/GGGY/GGGY/GGGG" },
  { name: "Bar and Scatter", algs: ["Rw' 3L F' Rw F 3L'"], u: "YYYG/YYYG/YYYG/YYYY", f: "GGGG/GGGG/GGGY/YGYG" },
  { name: "Bar and Scatter", algs: ["U' 3L F Rw' F' 3L' Rw"], u: "YYYY/YYYG/YYYY/YGYG", f: "GGGG/GGGY/GGGY/GGGY" },
  { name: "Front 3 Bar", algs: ["U' 3R U Rw U' Rw' U Rw U' 3Rw'"], u: "YYYY/YYYG/YYYY/GGYG", f: "GGGY/GGGY/GGGY/GGGY" },
  { name: "Right 3 Bar", algs: ["3R U' Rw U Rw' U' Rw U 3Rw'"], u: "YYYG/YYYG/YYYY/YGYG", f: "GGGY/GGGY/GGGY/GGGY" },
  { name: "Two Pairs", algs: ["Rw U2 3Lw' U Rw' U' 3Lw"], u: "YYYG/YYYG/YYYY/GGYY", f: "GGGY/GGGY/GGGY/GGGY" },
  { name: "Kite", algs: ["Rw U2 Rw' U Rw 3L' U' Rw' U 3L"], u: "GYYY/YYYG/YYYY/YGYG", f: "GGGY/GGGY/GGGY/GGGY" },
  { name: "Triangle", algs: ["U2 Rw U' Rw' U2 3Rw U Rw' U' 3R'"], u: "GYYY/YYYG/YYYY/YGYY", f: "GGGY/GGGY/GGGY/GGGG" },
  { name: "Triangle", algs: ["U Rw U Rw' U2 3Rw U' Rw' U 3R'"], u: "GYYY/YYYG/YYYY/YGYY", f: "GGGG/GGGY/GGGY/GGGY" },
  { name: "Pair and Shape", algs: ["U' Rw U2 Rw' U' 3R' F Rw' F' 3Rw"], u: "GYYY/YYYG/YYYY/GGYY", f: "GGGY/GGGY/GGGY/GGGY" },
  { name: "Pair and Shape", algs: ["Rw U2 Rw' U 3R' F' Rw' F 3Rw"], u: "GYYG/YYYG/YYYY/YGYY", f: "GGGY/GGGY/GGGY/GGGY" },
];

export const L2C6_CASES: readonly (L2CCase & { u: string; f: string })[] = SHEET_CASES.map((c, i) => ({
  number: i + 1,
  name: c.name,
  alg: c.algs[0],
  algs: c.algs,
  u: c.u,
  f: c.f,
}));

export const L2C6_TOOLS = l2cCaseTools(6, L2C6_CASES);

