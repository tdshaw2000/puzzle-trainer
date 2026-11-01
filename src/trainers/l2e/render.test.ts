import { applyAlg, solvedCube, stickerAt } from '../../cube/cube';
import { FACE_COLOUR, RING_COLOUR } from '../../cube/colours';
import type { Vec } from '../../cube/geometry';
import { parseAlg } from '../../cube/notation';
import { renderTopView } from './render';

const vec = (s: string) => s.split(',').map(Number) as unknown as Vec;

describe('renderTopView', () => {
  const cube = applyAlg(solvedCube(), parseAlg("Rw2 F2 U2 Rw2 U2 F2 Rw2 R U"));
  const highlight: Vec[] = [
    [-1, 2, 2],
    [0, 2, 2],
    [1, 2, 2],
  ];

  it('draws the U face and a side strip all round (5x5 + 4x5 stickers)', () => {
    expect(renderTopView(cube, 'F', highlight, () => '#000').querySelectorAll('rect')).toHaveLength(45);
  });

  it('colours only highlighted pieces, with the colour that sticker has on the cube', () => {
    const svg = renderTopView(cube, 'F', highlight, (f) => FACE_COLOUR[f].hex);
    let lit = 0;
    for (const rect of svg.querySelectorAll('rect')) {
      const pos = vec(rect.dataset.pos!);
      const isLit = highlight.some((h) => h.join() === pos.join());
      const expected = isLit ? FACE_COLOUR[stickerAt(cube, pos, vec(rect.dataset.normal!))].hex : RING_COLOUR;
      expect(rect.getAttribute('fill')).toBe(expected);
      if (isLit) lit++;
    }
    expect(lit).toBe(6);
  });

  it('puts the chosen front at the bottom', () => {
    const bottom = (front: 'F' | 'R') =>
      renderTopView(cube, front, highlight, () => '#000').querySelector<SVGRectElement>('rect[data-row="6"][data-col="3"]')!;
    expect(bottom('F').dataset.normal).toBe('0,0,1');
    expect(bottom('R').dataset.normal).toBe('1,0,0');
  });
});
