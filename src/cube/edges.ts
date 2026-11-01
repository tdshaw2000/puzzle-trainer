import { cubeModel, type Cube } from './cube';
import { NORMAL, add, cross, scale, type Vec } from './geometry';
import type { Face } from './notation';

/** An edge slot between two faces; `pieces` are its positions left to right (wings, and the midge on odd cubes). */
export interface Edge {
  faces: readonly [Face, Face];
  pieces: readonly Vec[];
  /** The middle of the slot: the 3x3-level position of the edge (a midge position on odd cubes). */
  mid: Vec;
}

const ORDER: readonly Face[] = ['U', 'D', 'F', 'B', 'R', 'L'];

const EDGE_SETS = new Map<number, readonly Edge[]>();

/** The 12 edge slots of an N×N cube. */
export function edgesFor(size: number): readonly Edge[] {
  const cached = EDGE_SETS.get(size);
  if (cached) return cached;
  const outer = (size - 1) / 2;
  const along = Array.from({ length: size - 2 }, (_, i) => i - (size - 3) / 2);
  const edges = ORDER.flatMap((a, i) =>
    ORDER.slice(i + 1)
      .filter((b) => cross(NORMAL[a], NORMAL[b]).some((c) => c !== 0))
      .map((b): Edge => {
        const mid = add(scale(NORMAL[a], outer), scale(NORMAL[b], outer));
        const dir = cross(NORMAL[a], NORMAL[b]);
        return { faces: [a, b], pieces: along.map((k) => add(mid, scale(dir, k))), mid };
      }),
  );
  EDGE_SETS.set(size, edges);
  return edges;
}

export const EDGES = edgesFor(5);

export const edgeName = (e: Edge) => e.faces.join('');

/** The two stickers of each piece of `edge`, read in the order of `edge.faces`. */
export function edgeStickers<T>(cube: readonly T[], edge: Edge, at: (cube: readonly T[], pos: Vec, normal: Vec) => T) {
  return edge.pieces.map((p) => [at(cube, p, NORMAL[edge.faces[0]]), at(cube, p, NORMAL[edge.faces[1]])] as const);
}

/** Paired: every piece in the slot shows the same two colours the same way round. */
/** The size of an N×N cube from its sticker count. */
const sizeOf = (cube: Cube) => Math.round(Math.sqrt(cube.length / 6));

export function isPaired(cube: Cube, edge: Edge, size = sizeOf(cube)): boolean {
  const model = cubeModel(size);
  const reads = edgeStickers(cube, edge, model.stickerAt).map(([a, b]) => a + b);
  return reads.every((r) => r === reads[0]);
}

export function unpairedEdges(cube: Cube, size = sizeOf(cube)): string[] {
  return edgesFor(size)
    .filter((e) => !isPaired(cube, e, size))
    .map(edgeName);
}
