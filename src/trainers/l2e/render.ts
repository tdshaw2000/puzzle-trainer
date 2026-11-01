import { stickerAt, type Cube } from '../../cube/cube';
import { RING_COLOUR } from '../../cube/colours';
import { sameVec, type Vec } from '../../cube/geometry';
import type { Face } from '../../cube/notation';
import { frameRotation } from '../../cube/rotation';

const SVG_NS = 'http://www.w3.org/2000/svg';
const CELL = 20;

/**
 * The sticker each cell of the 7x7 top-down view shows, in the guide's frame (front at the
 * bottom): the U face in the middle 5x5, and one strip of side stickers around it.
 */
function cellSticker(row: number, col: number): [Vec, Vec] | null {
  const x = col - 3;
  const z = row - 3;
  const inner = (v: number) => v >= -2 && v <= 2;
  if (inner(x) && inner(z)) return [[x, 2, z], [0, 1, 0]];
  if (row === 0 && inner(x)) return [[x, 2, -2], [0, 0, -1]];
  if (row === 6 && inner(x)) return [[x, 2, 2], [0, 0, 1]];
  if (col === 0 && inner(z)) return [[-2, 2, z], [-1, 0, 0]];
  if (col === 6 && inner(z)) return [[2, 2, z], [1, 0, 0]];
  return null;
}

/**
 * Draws the U layer from above like the guide's "birds eye view", seen with `front` at the
 * bottom. Only stickers of pieces in `highlight` (positions in the cube's frame) are coloured.
 * Each sticker carries data-row/data-col and data-pos/data-normal (cube frame).
 */
export function renderTopView(cube: Cube, front: Face, highlight: Vec[], fill: (s: Face) => string): SVGSVGElement {
  const { vec } = frameRotation('U', front);
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${CELL * 7} ${CELL * 7}`);
  svg.setAttribute('role', 'img');
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      const cell = cellSticker(row, col);
      if (!cell) continue;
      const pos = vec(cell[0]);
      const normal = vec(cell[1]);
      const lit = highlight.some((h) => sameVec(h, pos));
      const side = row === 0 || row === 6 || col === 0 || col === 6;
      const rect = document.createElementNS(SVG_NS, 'rect');
      // side strips are drawn thinner, like the guide's pictures
      const [w, h] = [col === 0 || col === 6 ? CELL * 0.6 : CELL, row === 0 || row === 6 ? CELL * 0.6 : CELL];
      const x = col * CELL + (col === 0 ? CELL * 0.4 : 0);
      const y = row * CELL + (row === 0 ? CELL * 0.4 : 0);
      rect.setAttribute('x', String(x + 1));
      rect.setAttribute('y', String(y + 1));
      rect.setAttribute('width', String(w - 2));
      rect.setAttribute('height', String(h - 2));
      rect.setAttribute('rx', side ? '1' : '2');
      // an outline keeps white stickers visible on a light card
      rect.setAttribute('stroke', 'rgba(0, 0, 0, 0.45)');
      rect.setAttribute('stroke-width', '0.6');
      rect.setAttribute('fill', lit ? fill(stickerAt(cube, pos, normal)) : RING_COLOUR);
      rect.dataset.row = String(row);
      rect.dataset.col = String(col);
      rect.dataset.pos = pos.join(',');
      rect.dataset.normal = normal.join(',');
      svg.append(rect);
    }
  }
  return svg;
}
