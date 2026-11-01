import { SLOTS, applyAlg, centres, identityCube, slotAt, solvedCube } from '../../cube/cube';
import { faceOf, type Vec } from '../../cube/geometry';
import { invert, parseAlg, type Face } from '../../cube/notation';
import { frameRotation } from '../../cube/rotation';

export interface L2ECase {
  /** Position in the Kewbz guide, reading order. */
  number: number;
  /** The alg the trainer shows: the guide's, exactly as printed, except where `printedAlg` is set. */
  alg: string;
  /** The guide's printed alg, when it doesn't solve the pictured case and `alg` corrects it. */
  printedAlg?: string;
}

const ALGS = [
  "M U' R' U R' F R F' M'",
  'Rw2 F2 U2 Rw2 U2 F2 Rw2',
  "Rw U2 Rw U2 Rw' U2 Rw U2 Lw' U2 Rw U2 Rw' U2 x' Rw' U2 Rw' U2 M'",
  "Rw' U' R' U R' F R F' Rw",
  "Lw U' R' U R' F R F' Lw'",
  "Rw2 B2 Rw' U2 Rw' U2' x'U2 Rw' U2' Rw U2 Rw' U2' Rw2",
  "Rw U2 Rw2 U2 Rw' U2 Rw U2 Rw' U2 Rw2 U2 Rw",
  "Rw' U2 Rw2 U2 Rw U2 Rw' U2 Rw U2 Rw2 U2 Rw'",
  "Rw' U2 Rw' U2 B2 Rw' B2 Rw' F2 Lw2 F2 Rw U2 Rw2",
  "Lw' U2 Lw' U2 F2 Lw' F2 Rw U2 Rw' U2 Lw2",
  "Lw2 F2 U2 Lw' U2 Lw2 F2 Lw' U2 Lw2 U2 F2 Lw' F2",
  "Rw2 F2 U2 Lw' U2 Lw2 F2 Lw' U2 Rw2 U2 F2 Rw F2",
];

export const L2E_CASES: readonly L2ECase[] = ALGS.map((alg, i) => ({
  number: i + 1,
  alg,
  ...(i === 0 ? { printedAlg: "M' U' R' U R' F R F' M" } : {}),
}));

/**
 * The 12 stickers the guide pictures, as (position, normal) in the cube's frame when the
 * guide's front edge is at `front`: B-side row, U row of UB, U row of UF, F-side row,
 * each read left to right as seen from above with the guide's front at the bottom.
 */
export function guideStickers(front: Face): Array<[Vec, Vec]> {
  const { vec } = frameRotation('U', front);
  const row = (z: number, normal: Vec) => [-1, 0, 1].map((x): [Vec, Vec] => [vec([x, 2, z]), vec(normal)]);
  return [...row(-2, [0, 0, -1]), ...row(-2, [0, 1, 0]), ...row(2, [0, 1, 0]), ...row(2, [0, 0, 1])];
}

/** Relabels by first appearance, so patterns compare regardless of which colours they use. */
export function canonical(labels: readonly string[]): string {
  const names = new Map<string, string>();
  return labels.map((l) => names.get(l) ?? names.set(l, String.fromCharCode(97 + names.size)).get(l)!).join('');
}

/** Which original sticker (edge slot and face) a slot's sticker started as. */
function origin(slot: number): string {
  const { pos, normal } = SLOTS[slot];
  const faces = pos.map((c, axis) => (Math.abs(c) === 2 ? faceOf(pos.map((_, k) => (k === axis ? c / 2 : 0)) as unknown as Vec) : ''));
  return `${faces.join('')}:${faceOf(normal)}`;
}

/** The pictured pattern a tracked cube shows with the guide's front edge at `front`. */
export function patternOf(tracked: readonly number[], front: Face): string {
  return canonical(guideStickers(front).map(([p, n]) => origin(tracked[slotAt(p, n)])));
}

const ROTATIONS = ['', 'x', "x'", 'x2', 'z', "z'"].flatMap((a) => ['', 'y', "y'", 'y2'].map((b) => `${a} ${b}`.trim()));

const centresHome = (cube: readonly Face[]) =>
  (['U', 'D', 'F', 'B', 'R', 'L'] as const).every((f) => centres(cube, f).flat().every((s) => s === f));

/**
 * The whole-cube rotation that puts the centres back home after the case's alg, '' for most.
 * Case 6's alg ends with the cube turned (an x' inside it isn't undone), so the solver re-grips.
 */
const REGRIPS = new Map<number, string>();
export function regrip(i: number): string {
  const cached = REGRIPS.get(i);
  if (cached !== undefined) return cached;
  const moves = parseAlg(L2E_CASES[i].alg);
  const r = ROTATIONS.find((rot) => centresHome(applyAlg(solvedCube(), [...moves, ...parseAlg(rot)])));
  if (r === undefined) throw new Error(`Case ${i + 1}'s alg does not solve the centres`);
  REGRIPS.set(i, r);
  return r;
}

/** Moves that build case `i` from solved with every centre at home: the alg and its re-grip, inverted. */
export const caseSetup = (i: number) => invert(parseAlg(`${L2E_CASES[i].alg} ${regrip(i)}`));

const caseCube = (i: number) => applyAlg(identityCube(), caseSetup(i));

/** Case `i`'s pattern, as the guide pictures it. */
export const casePattern = (i: number) => patternOf(caseCube(i), 'F');

/** True when the case looks the same from behind (after y2). */
const SYMMETRIC = new Map<number, boolean>();
export function isY2Symmetric(i: number): boolean {
  if (!SYMMETRIC.has(i)) SYMMETRIC.set(i, patternOf(caseCube(i), 'B') === casePattern(i));
  return SYMMETRIC.get(i)!;
}
