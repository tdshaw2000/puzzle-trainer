import { cubeModel } from '../../cube/cube';
import { FACE_COLOUR, RING_COLOUR } from '../../cube/colours';
import type { Vec } from '../../cube/geometry';
import { parseAlg } from '../../cube/notation';
import { renderNet } from './net';

const c4 = cubeModel(4);
const vec = (s: string) => s.split(',').map(Number) as unknown as Vec;

describe('renderNet', () => {
  const cube = c4.applyAlg(c4.solved(), parseAlg("Rw U2 Rw D Rw' U2 Rw D' Rw2 R U", 4));
  const highlight: Vec[] = [[-0.5, 1.5, 1.5], [0.5, 1.5, 1.5], [-1.5, 0.5, 1.5]];

  it('draws the U face and the four side faces folded out (5 x 16 stickers)', () => {
    const svg = renderNet(cube, 'F', highlight, () => '#000');
    expect(svg.querySelectorAll('rect')).toHaveLength(80);
    const keys = new Set([...svg.querySelectorAll('rect')].map((r) => `${r.dataset.pos}|${r.dataset.normal}`));
    expect(keys.size).toBe(80);
  });

  it('colours only highlighted pieces, with the colour that sticker has on the cube', () => {
    const svg = renderNet(cube, 'F', highlight, (f) => FACE_COLOUR[f].hex);
    let lit = 0;
    for (const rect of svg.querySelectorAll('rect')) {
      const pos = vec(rect.dataset.pos!);
      const isLit = highlight.some((h) => h.join() === pos.join());
      const expected = isLit ? FACE_COLOUR[c4.stickerAt(cube, pos, vec(rect.dataset.normal!))].hex : RING_COLOUR;
      expect(rect.getAttribute('fill')).toBe(expected);
      if (isLit) lit++;
    }
    // two U-layer wings (U and F stickers) and one middle wing (F and L stickers)
    expect(lit).toBe(6);
  });

  it('folds each side face out from its edge with U, and puts the chosen front at the bottom', () => {
    const at = (svg: SVGSVGElement, row: number, col: number) =>
      svg.querySelector<SVGRectElement>(`rect[data-row="${row}"][data-col="${col}"]`)!;
    const f = renderNet(cube, 'F', highlight, () => '#000');
    expect(at(f, 8, 5).dataset.pos).toBe('-0.5,1.5,1.5');
    expect(at(f, 8, 5).dataset.normal).toBe('0,0,1');
    expect(at(f, 3, 4).dataset.pos).toBe('-1.5,1.5,-1.5');
    expect(at(f, 4, 8).dataset.normal).toBe('1,0,0');
    expect(at(f, 4, 8).dataset.pos).toBe('1.5,1.5,-1.5');
    expect(at(f, 7, 0).dataset.pos).toBe('-1.5,-1.5,1.5');
    expect(at(f, 0, 0)).toBeNull();
    const r = renderNet(cube, 'R', highlight, () => '#000');
    expect(at(r, 8, 5).dataset.normal).toBe('1,0,0');
  });
});

describe('renderNet (5x5)', () => {
  const c5 = cubeModel(5);
  const cube = c5.applyAlg(c5.solved(), parseAlg("Dw R U R' F R' F' R Dw'", 5));
  const highlight: Vec[] = [[2, 1, 2], [2, 0, 2], [2, -1, 2]];

  it('draws the U face and the four side faces folded out (5 x 25 stickers), each sticker once', () => {
    const svg = renderNet(cube, 'F', highlight, () => '#000');
    const rects = [...svg.querySelectorAll('rect')];
    expect(rects).toHaveLength(125);
    expect(new Set(rects.map((r) => `${r.dataset.pos}|${r.dataset.normal}`)).size).toBe(125);
  });

  it('colours only highlighted pieces, with their colours on the cube', () => {
    const svg = renderNet(cube, 'F', highlight, (f) => FACE_COLOUR[f].hex);
    let lit = 0;
    for (const rect of svg.querySelectorAll('rect')) {
      const pos = vec(rect.dataset.pos!);
      const isLit = highlight.some((h) => h.join() === pos.join());
      const expected = isLit ? FACE_COLOUR[c5.stickerAt(cube, pos, vec(rect.dataset.normal!))].hex : RING_COLOUR;
      expect(rect.getAttribute('fill')).toBe(expected);
      if (isLit) lit++;
    }
    // the FR edge: 3 pieces, F and R stickers each
    expect(lit).toBe(6);
  });

  it('puts F at the bottom, folded out from U', () => {
    const svg = renderNet(cube, 'F', highlight, () => '#000');
    const at = (row: number, col: number) => svg.querySelector<SVGRectElement>(`rect[data-row="${row}"][data-col="${col}"]`)!;
    expect(at(10, 7).dataset.pos).toBe('0,2,2');
    expect(at(10, 7).dataset.normal).toBe('0,0,1');
    expect(at(14, 9).dataset.pos).toBe('2,-2,2');
    expect(at(7, 14).dataset.pos).toBe('2,-2,0');
    expect(at(0, 0)).toBeNull();
  });
});
