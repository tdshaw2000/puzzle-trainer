import { RING_COLOUR } from '../../cube/colours';
import type { Face } from '../../cube/notation';

const SVG_NS = 'http://www.w3.org/2000/svg';
const CELL = 20;
const FACE = CELL * 5;
const GAP = 12;

/**
 * Draws 5x5 face grids, centres coloured with `fill` and the outer ring neutral.
 * Stickers carry data-face (index in `grids`), data-row and data-col.
 */
export function renderFaces(
  grids: Face[][][],
  layout: 'horizontal' | 'vertical',
  fill: (sticker: Face) => string,
): SVGSVGElement {
  const span = grids.length * FACE + (grids.length - 1) * GAP;
  const [w, h] = layout === 'horizontal' ? [span, FACE] : [FACE, span];
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('role', 'img');

  grids.forEach((grid, i) => {
    const offset = i * (FACE + GAP);
    const [ox, oy] = layout === 'horizontal' ? [offset, 0] : [0, offset];
    grid.forEach((cells, row) =>
      cells.forEach((sticker, col) => {
        const centre = row > 0 && row < 4 && col > 0 && col < 4;
        const rect = document.createElementNS(SVG_NS, 'rect');
        rect.setAttribute('x', String(ox + col * CELL + 1));
        rect.setAttribute('y', String(oy + row * CELL + 1));
        rect.setAttribute('width', String(CELL - 2));
        rect.setAttribute('height', String(CELL - 2));
        rect.setAttribute('rx', '2');
        rect.setAttribute('fill', centre ? fill(sticker) : RING_COLOUR);
        rect.dataset.face = String(i);
        rect.dataset.row = String(row);
        rect.dataset.col = String(col);
        svg.append(rect);
      }),
    );
  });
  return svg;
}
