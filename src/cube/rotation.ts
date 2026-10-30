import { FACES, NORMAL, add, cross, faceOf, scale, type Vec } from './geometry';
import { move, type Face, type Move } from './notation';

/** Side faces in clockwise order seen from above: each face's right-hand neighbour follows it. */
export const SIDE_ORDER: readonly Face[] = ['F', 'R', 'B', 'L'];

/** Ordered pairs of adjacent side faces: (face playing sheet U, face playing sheet F). */
export const SIDE_PAIRS: ReadonlyArray<readonly [Face, Face]> = SIDE_ORDER.flatMap((f, i) => {
  const right = SIDE_ORDER[(i + 1) % 4];
  return [
    [f, right],
    [right, f],
  ] as const;
});

export interface FrameRotation {
  /** Where each sheet-frame face ends up. */
  faceMap: Record<Face, Face>;
  /** Rotates a sheet-frame vector into the scramble frame. */
  vec(v: Vec): Vec;
}

/** The whole-cube rotation that takes the sheet's U face to `top` and its F face to `front`. */
export function frameRotation(top: Face, front: Face): FrameRotation {
  const u = NORMAL[top];
  const f = NORMAL[front];
  const r = cross(u, f);
  const vec = (v: Vec): Vec => add(scale(r, v[0]), scale(u, v[1]), scale(f, v[2]));
  const faceMap = Object.fromEntries(FACES.map((face) => [face, faceOf(vec(NORMAL[face]))])) as Record<Face, Face>;
  return { faceMap, vec };
}

export function rewrite(moves: Move[], rotation: FrameRotation): Move[] {
  return moves.map((m) => move(rotation.faceMap[m.face], m.layer, m.turns)!);
}
