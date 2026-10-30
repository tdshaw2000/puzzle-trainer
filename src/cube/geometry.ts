import type { Face } from './notation';

/** x points to R, y to U, z to F. */
export type Vec = readonly [number, number, number];

export const FACES: readonly Face[] = ['U', 'D', 'F', 'B', 'R', 'L'];

export const NORMAL: Record<Face, Vec> = {
  U: [0, 1, 0],
  D: [0, -1, 0],
  F: [0, 0, 1],
  B: [0, 0, -1],
  R: [1, 0, 0],
  L: [-1, 0, 0],
};

/**
 * How each face is read as a grid: the direction of increasing column and of
 * increasing row. Side faces are read with U on top, U with B on top, D with F on top.
 */
export const RIGHT: Record<Face, Vec> = {
  U: [1, 0, 0],
  D: [1, 0, 0],
  F: [1, 0, 0],
  B: [-1, 0, 0],
  R: [0, 0, -1],
  L: [0, 0, 1],
};
export const DOWN: Record<Face, Vec> = {
  U: [0, 0, 1],
  D: [0, 0, -1],
  F: [0, -1, 0],
  B: [0, -1, 0],
  R: [0, -1, 0],
  L: [0, -1, 0],
};

export const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec, b: Vec): Vec => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const scale = (a: Vec, k: number): Vec => [a[0] * k, a[1] * k, a[2] * k];
export const add = (...vs: Vec[]): Vec =>
  vs.reduce<Vec>((s, v) => [s[0] + v[0], s[1] + v[1], s[2] + v[2]], [0, 0, 0]);
export const sameVec = (a: Vec, b: Vec) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

export function faceOf(normal: Vec): Face {
  const f = FACES.find((face) => sameVec(NORMAL[face], normal));
  if (!f) throw new Error(`Not a face normal: ${normal}`);
  return f;
}

/** Rotates v a quarter turn clockwise as seen looking at the face with normal `axis`. */
export function rotateClockwise(v: Vec, axis: Vec): Vec {
  // Rodrigues' formula for -90 degrees about a unit axis: v' = (v.a)a - (a x v)
  const k = dot(v, axis);
  const c = cross(axis, v);
  return [k * axis[0] - c[0], k * axis[1] - c[1], k * axis[2] - c[2]];
}
