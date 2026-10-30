import { DOWN, FACES, NORMAL, RIGHT, add, dot, faceOf, rotateClockwise, scale, type Vec } from './geometry';
import type { Face, Layer, Move } from './notation';

/** A 5x5 state: for each sticker slot, the face the sticker started on. */
export type Cube = readonly Face[];

interface Slot {
  pos: Vec;
  normal: Vec;
}

const key = (pos: Vec, normal: Vec) => `${pos.join(',')}|${normal.join(',')}`;

export const SLOTS: Slot[] = [];
const INDEX = new Map<string, number>();
for (const f of FACES) {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const pos = add(scale(NORMAL[f], 2), scale(RIGHT[f], col - 2), scale(DOWN[f], row - 2));
      INDEX.set(key(pos, NORMAL[f]), SLOTS.length);
      SLOTS.push({ pos, normal: NORMAL[f] });
    }
  }
}

const slotIndex = (f: Face, row: number, col: number) => FACES.indexOf(f) * 25 + row * 5 + col;

function inLayer(pos: Vec, face: Face, layer: Layer): boolean {
  const depth = dot(pos, NORMAL[face]);
  return layer === 'outer' ? depth === 2 : layer === 'wide' ? depth >= 1 : depth === 0;
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

export function solvedCube(): Cube {
  return SLOTS.map(({ normal }) => faceOf(normal));
}

export function applyMove(cube: Cube, m: Move): Cube {
  const perm = quarterPerm(m.face, m.layer);
  let cur = cube;
  for (let t = 0; t < m.turns; t++) {
    const next: Face[] = new Array(cur.length);
    cur.forEach((s, i) => (next[perm[i]] = s));
    cur = next;
  }
  return cur;
}

export function applyAlg(cube: Cube, moves: Move[]): Cube {
  return moves.reduce(applyMove, cube);
}

/** The face as a 5x5 grid of sticker origins, read as described in geometry.ts. */
export function faceGrid(cube: Cube, f: Face): Face[][] {
  return [0, 1, 2, 3, 4].map((row) => [0, 1, 2, 3, 4].map((col) => cube[slotIndex(f, row, col)]));
}

/** The inner 3x3 centre block of a face. */
export function centres(cube: Cube, f: Face): Face[][] {
  return faceGrid(cube, f)
    .slice(1, 4)
    .map((r) => r.slice(1, 4));
}

export function stickerAt(cube: Cube, pos: Vec, normal: Vec): Face {
  const i = INDEX.get(key(pos, normal));
  if (i === undefined) throw new Error(`No sticker at ${pos} facing ${normal}`);
  return cube[i];
}

export function isSolved(cube: Cube): boolean {
  return cube.every((s, i) => s === FACES[Math.floor(i / 25)]);
}
