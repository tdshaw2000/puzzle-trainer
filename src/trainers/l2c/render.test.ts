import { applyAlg, faceGrid, solvedCube } from '../../cube/cube';
import { parseAlg } from '../../cube/notation';
import { FACE_COLOUR, RING_COLOUR } from '../../cube/colours';
import { renderFaces } from './render';

describe('renderFaces', () => {
  const cube = applyAlg(solvedCube(), parseAlg("Rw U' Rw' F R U"));
  const grids = [faceGrid(cube, 'F'), faceGrid(cube, 'R')];

  it('colours centres by sticker and the outer ring neutral', () => {
    const svg = renderFaces(grids, 'horizontal', (f) => FACE_COLOUR[f].hex);
    grids.forEach((grid, i) => {
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          const rect = svg.querySelector(`rect[data-face="${i}"][data-row="${row}"][data-col="${col}"]`)!;
          const centre = row > 0 && row < 4 && col > 0 && col < 4;
          expect(rect.getAttribute('fill')).toBe(centre ? FACE_COLOUR[grid[row][col]].hex : RING_COLOUR);
        }
      }
    });
  });

  it('lays faces out side by side or stacked', () => {
    const wide = renderFaces(grids, 'horizontal', () => '#000');
    const tall = renderFaces(grids, 'vertical', () => '#000');
    const [, , w1, h1] = wide.getAttribute('viewBox')!.split(' ').map(Number);
    const [, , w2, h2] = tall.getAttribute('viewBox')!.split(' ').map(Number);
    expect(w1).toBeGreaterThan(h1);
    expect(h2).toBeGreaterThan(w2);
  });
});
