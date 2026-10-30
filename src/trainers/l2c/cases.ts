export interface L2CCase {
  /** Position on the CubeSkills sheet, reading order, "Solved" left out. */
  number: number;
  /** The sheet's suggested alg, exactly as printed. */
  alg: string;
}

const ALGS = [
  "(Rw U Rw') U (Rw U2' Rw')",
  "(Rw U' Rw') U' (Rw U2' Rw')",
  "Rw U' M' U Rw' U' M",
  "(Rw U Rw')",
  "(Rw U Rw') U' (Rw U' Rw')",
  "(Rw U' Rw')",
  "(Rw U' Rw') U (Rw U Rw')",
  "(Rw U' Rw') U' (Rw U' Rw')",
  "(Rw U2' Rw') U (Rw U2' Rw')",
  "(Rw U Rw') U (Rw U Rw')",
  "(Rw U2 Rw') U' (Rw U2 Rw')",
  "(Rw U' Rw' U) (Rw U' Rw' U) (Rw U' Rw')",
  "(Rw U' Rw') U2 (Rw U' Rw')",
  "(Rw U2 Rw')",
  "(Rw U2' Rw') U2 (Rw U' Rw')",
  "(Rw U Rw') U' (Rw U2 Rw')",
  "(Rw U' Rw') U (Rw U2' Rw')",
  "(Rw U' Rw') U (Rw U' Rw')",
  "(Rw U Rw') U' (Rw U Rw')",
];

export const L2C_CASES: readonly L2CCase[] = ALGS.map((alg, i) => ({ number: i + 1, alg }));
