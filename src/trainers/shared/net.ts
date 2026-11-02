import type { Cube } from '../../cube/cube';
import { cubeModel } from '../../cube/cube';
import { RING_COLOUR } from '../../cube/colours';
import { sameVec, type Vec } from '../../cube/geometry';
import type { Face } from '../../cube/notation';
import { frameRotation } from '../../cube/rotation';

const SVG_NS = 'http://www.w3.org/2000/svg';
const CELL = 20;
/** Space between the faces of the net, so each face reads as a block. */
const GAP = 6;
const offset = (i: number, n: number) => i * CELL + (i >= n ? GAP : 0) + (i >= 2 * n ? GAP : 0);

/**
 * The sticker each cell of the 3N x 3N net shows, in the sheet's frame (front at the bottom):
 * the U face in the middle, and B, L, R and F folded out from their edges with U.
 */
function cellSticker(n: number, row: number, col: number): [Vec, Vec] | null {
  const o = (n - 1) / 2;
  const inU = (v: number) => v >= n && v < 2 * n;
  const x = col - (3 * n - 1) / 2;
  const z = row - (3 * n - 1) / 2;
  const far = 3 * n - 1 - o;
  if (inU(row) && inU(col)) return [[x, o, z], [0, 1, 0]];
  if (inU(col) && row < n) return [[x, row - o, -o], [0, 0, -1]];
  if (inU(col) && row >= 2 * n) return [[x, far - row, o], [0, 0, 1]];
  if (inU(row) && col < n) return [[-o, col - o, z], [-1, 0, 0]];
  if (inU(row) && col >= 2 * n) return [[o, far - col, z], [1, 0, 0]];
  return null;
}

/**
 * Draws an N×N cube (size read from the sticker count) as a net: U in the middle with the side
 * faces folded out around it, seen with `front` at the bottom. Only stickers of pieces in
 * `highlight` (cube-frame positions) are coloured. Each sticker carries data-row/data-col and
 * data-pos/data-normal (cube frame).
 */
export function renderNet(cube: Cube, front: Face, highlight: Vec[], fill: (s: Face) => string): SVGSVGElement {
  const n = Math.round(Math.sqrt(cube.length / 6));
  const model = cubeModel(n);
  const span = CELL * 3 * n + 2 * GAP;
  const { vec } = frameRotation('U', front);
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${span} ${span}`);
  svg.setAttribute('role', 'img');
  for (let row = 0; row < 3 * n; row++) {
    for (let col = 0; col < 3 * n; col++) {
      const cell = cellSticker(n, row, col);
      if (!cell) continue;
      const pos = vec(cell[0]);
      const normal = vec(cell[1]);
      const lit = highlight.some((h) => sameVec(h, pos));
      const rect = document.createElementNS(SVG_NS, 'rect');
      rect.setAttribute('x', String(offset(col, n) + 1));
      rect.setAttribute('y', String(offset(row, n) + 1));
      rect.setAttribute('width', String(CELL - 2));
      rect.setAttribute('height', String(CELL - 2));
      rect.setAttribute('rx', '2');
      // an outline keeps white stickers visible on a light card
      rect.setAttribute('stroke', 'rgba(0, 0, 0, 0.45)');
      rect.setAttribute('stroke-width', '0.6');
      rect.setAttribute('fill', lit ? fill(model.stickerAt(cube, pos, normal)) : RING_COLOUR);
      rect.dataset.row = String(row);
      rect.dataset.col = String(col);
      rect.dataset.pos = pos.join(',');
      rect.dataset.normal = normal.join(',');
      svg.append(rect);
    }
  }
  return svg;
}
