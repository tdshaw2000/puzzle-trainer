import { DOWN, FACES, NORMAL, RIGHT, add, dot, faceOf, rotateClockwise, scale, type Vec } from './geometry';
import type { Face, Layer, Move } from './notation';

/** A cube state: for each sticker slot, the face the sticker started on. */
export type Cube = readonly Face[];

export interface Slot {
  pos: Vec;
  normal: Vec;
}

/**
 * An N×N sticker model. Piece coordinates run from -(N-1)/2 to (N-1)/2 on each axis
 * (so -2..2 on the 5x5 and ±0.5, ±1.5 on the 4x4).
 */
export interface CubeModel {
  size: number;
  /** Distance of the outer layers from the core: (N-1)/2. */
  outer: number;
  SLOTS: readonly Slot[];
  solved(): Cube;
  /** Each slot labelled with its own index: after moves, cube[i] is the slot that sticker started in. */
  identity(): readonly number[];
  /** Works on any per-slot labelling, e.g. slot indices to track where pieces go. */
  applyMove<T>(cube: readonly T[], m: Move): readonly T[];
  applyAlg<T>(cube: readonly T[], moves: Move[]): readonly T[];
  /** The slot index of the sticker at `pos` facing `normal`. */
  slotAt(pos: Vec, normal: Vec): number;
  stickerAt<T>(cube: readonly T[], pos: Vec, normal: Vec): T;
  /** The face as an N×N grid of sticker origins, read as described in geometry.ts. */
  faceGrid(cube: Cube, f: Face): Face[][];
  /** The inner (N-2)×(N-2) centre block of a face. */
  centres(cube: Cube, f: Face): Face[][];
  isSolved(cube: Cube): boolean;
}

const key = (pos: Vec, normal: Vec) => `${pos.join(',')}|${normal.join(',')}`;

const MODELS = new Map<number, CubeModel>();

export function cubeModel(size: number): CubeModel {
  const cached = MODELS.get(size);
  if (cached) return cached;

  const outer = (size - 1) / 2;
  const perFace = size * size;
  const SLOTS: Slot[] = [];
  const INDEX = new Map<string, number>();
  for (const f of FACES) {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const pos = add(scale(NORMAL[f], outer), scale(RIGHT[f], col - outer), scale(DOWN[f], row - outer));
        INDEX.set(key(pos, NORMAL[f]), SLOTS.length);
        SLOTS.push({ pos, normal: NORMAL[f] });
      }
    }
  }

  const slotIndex = (f: Face, row: number, col: number) => FACES.indexOf(f) * perFace + row * size + col;

  function inLayer(pos: Vec, face: Face, layer: Layer): boolean {
    const depth = dot(pos, NORMAL[face]);
    if (layer === 'outer') return depth === outer;
    if (layer === 'wide') return depth >= outer - 1;
    if (layer === 'wide3') return depth >= outer - 2;
    if (layer === 'inner2') return depth === outer - 1;
    if (layer === 'inner3') return depth === outer - 2;
    if (size % 2 === 0) throw new Error(`No slice moves on a ${size}x${size}`);
    return depth === 0;
  }

  const PERMS = new Map<string, number[]>();
  /** perm[i] is where the sticker in slot i goes after one clockwise quarter turn. */
  function quarterPerm(face: Face, layer: Layer): number[] {
    const k = face + layer;
    let perm = PERMS.get(k);
    if (!perm) {
      perm = SLOTS.map(({ pos, normal }, i) => {
        if (!inLayer(pos, face, layer)) return i;
        const axis = NORMAL[face];
        return INDEX.get(key(rotateClockwise(pos, axis), rotateClockwise(normal, axis)))!;
      });
      PERMS.set(k, perm);
    }
    return perm;
  }

  function applyMove<T>(cube: readonly T[], m: Move): readonly T[] {
    const perm = quarterPerm(m.face, m.layer);
    let cur = cube;
    for (let t = 0; t < m.turns; t++) {
      const next: T[] = new Array(cur.length);
      cur.forEach((s, i) => (next[perm[i]] = s));
      cur = next;
    }
    return cur;
  }

  function slotAt(pos: Vec, normal: Vec): number {
    const i = INDEX.get(key(pos, normal));
    if (i === undefined) throw new Error(`No sticker at ${pos} facing ${normal}`);
    return i;
  }

  const range = [...Array(size).keys()];
  const faceGrid = (cube: Cube, f: Face) => range.map((row) => range.map((col) => cube[slotIndex(f, row, col)]));

  const model: CubeModel = {
    size,
    outer,
    SLOTS,
    solved: () => SLOTS.map(({ normal }) => faceOf(normal)),
    identity: () => SLOTS.map((_, i) => i),
    applyMove,
    applyAlg: (cube, moves) => moves.reduce((c, m) => applyMove(c, m), cube),
    slotAt,
    stickerAt: (cube, pos, normal) => cube[slotAt(pos, normal)],
    faceGrid,
    centres: (cube, f) =>
      faceGrid(cube, f)
        .slice(1, size - 1)
        .map((r) => r.slice(1, size - 1)),
    isSolved: (cube) => cube.every((s, i) => s === FACES[Math.floor(i / perFace)]),
  };
  MODELS.set(size, model);
  return model;
}

/** The 5x5, which the 5x5 trainers use through the exports below. */
export const cube5 = cubeModel(5);

export const SLOTS = cube5.SLOTS;
export const solvedCube = () => cube5.solved();
export const identityCube = () => cube5.identity();
export const applyMove = <T>(cube: readonly T[], m: Move) => cube5.applyMove(cube, m);
export const applyAlg = <T>(cube: readonly T[], moves: Move[]) => cube5.applyAlg(cube, moves);
export const slotAt = (pos: Vec, normal: Vec) => cube5.slotAt(pos, normal);
export const faceGrid = (cube: Cube, f: Face) => cube5.faceGrid(cube, f);
export const centres = (cube: Cube, f: Face) => cube5.centres(cube, f);
export const stickerAt = (cube: Cube, pos: Vec, normal: Vec): Face => cube5.stickerAt(cube, pos, normal);
export const isSolved = (cube: Cube) => cube5.isSolved(cube);
