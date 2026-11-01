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
const offset = (i: number) => i * CELL + (i >= 4 ? GAP : 0) + (i >= 8 ? GAP : 0);
const c4 = cubeModel(4);

/**
 * The sticker each cell of the 12x12 net shows, in the sheet's frame (front at the bottom):
 * the U face in the middle, and B, L, R and F folded out from their edges with U.
 */
function cellSticker(row: number, col: number): [Vec, Vec] | null {
  const inU = (v: number) => v >= 4 && v <= 7;
  const x = col - 5.5;
  const z = row - 5.5;
  if (inU(row) && inU(col)) return [[x, 1.5, z], [0, 1, 0]];
  if (inU(col) && row < 4) return [[x, row - 1.5, -1.5], [0, 0, -1]];
  if (inU(col) && row > 7) return [[x, 9.5 - row, 1.5], [0, 0, 1]];
  if (inU(row) && col < 4) return [[-1.5, col - 1.5, z], [-1, 0, 0]];
  if (inU(row) && col > 7) return [[1.5, 9.5 - col, z], [1, 0, 0]];
  return null;
}

/**
 * Draws the 4x4 as a net: U in the middle with the side faces folded out around it, seen with
 * `front` at the bottom. Only stickers of pieces in `highlight` (cube-frame positions) are
 * coloured. Each sticker carries data-row/data-col and data-pos/data-normal (cube frame).
 */
export function renderNet(cube: Cube, front: Face, highlight: Vec[], fill: (s: Face) => string): SVGSVGElement {
  const { vec } = frameRotation('U', front);
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${CELL * 12 + 2 * GAP} ${CELL * 12 + 2 * GAP}`);
  svg.setAttribute('role', 'img');
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 12; col++) {
      const cell = cellSticker(row, col);
      if (!cell) continue;
      const pos = vec(cell[0]);
      const normal = vec(cell[1]);
      const lit = highlight.some((h) => sameVec(h, pos));
      const rect = document.createElementNS(SVG_NS, 'rect');
      rect.setAttribute('x', String(offset(col) + 1));
      rect.setAttribute('y', String(offset(row) + 1));
      rect.setAttribute('width', String(CELL - 2));
      rect.setAttribute('height', String(CELL - 2));
      rect.setAttribute('rx', '2');
      // an outline keeps white stickers visible on a light card
      rect.setAttribute('stroke', 'rgba(0, 0, 0, 0.45)');
      rect.setAttribute('stroke-width', '0.6');
      rect.setAttribute('fill', lit ? fill(c4.stickerAt(cube, pos, normal)) : RING_COLOUR);
      rect.dataset.row = String(row);
      rect.dataset.col = String(col);
      rect.dataset.pos = pos.join(',');
      rect.dataset.normal = normal.join(',');
      svg.append(rect);
    }
  }
  return svg;
}
