import { stickerAt, type Cube } from './cube';
import { NORMAL, add, cross, scale, type Vec } from './geometry';
import type { Face } from './notation';

/** An edge slot between two faces; `pieces` are its left wing, midge and right wing positions. */
export interface Edge {
  faces: readonly [Face, Face];
  pieces: readonly [Vec, Vec, Vec];
}

const ORDER: readonly Face[] = ['U', 'D', 'F', 'B', 'R', 'L'];

export const EDGES: readonly Edge[] = ORDER.flatMap((a, i) =>
  ORDER.slice(i + 1)
    .filter((b) => cross(NORMAL[a], NORMAL[b]).some((c) => c !== 0))
    .map((b): Edge => {
      const base = add(scale(NORMAL[a], 2), scale(NORMAL[b], 2));
      const along = cross(NORMAL[a], NORMAL[b]);
      return { faces: [a, b], pieces: [add(base, scale(along, -1)), base, add(base, along)] };
    }),
);

export const edgeName = (e: Edge) => e.faces.join('');

/** The two stickers of each piece of `edge`, read in the order of `edge.faces`. */
export function edgeStickers<T>(cube: readonly T[], edge: Edge, at: (cube: readonly T[], pos: Vec, normal: Vec) => T) {
  return edge.pieces.map((p) => [at(cube, p, NORMAL[edge.faces[0]]), at(cube, p, NORMAL[edge.faces[1]])] as const);
}

/** Paired: the wings and midge in the slot all show the same two colours the same way round. */
export function isPaired(cube: Cube, edge: Edge): boolean {
  const reads = edgeStickers(cube, edge, stickerAt).map(([a, b]) => a + b);
  return reads.every((r) => r === reads[0]);
}

export function unpairedEdges(cube: Cube): string[] {
  return EDGES.filter((e) => !isPaired(cube, e)).map(edgeName);
}
