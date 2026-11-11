import { cubeModel, type Cube } from '../../cube/cube';
import { edgeName, edgesFor, unpairedEdges } from '../../cube/edges';
import { FACES, NORMAL } from '../../cube/geometry';
import { parseAlg } from '../../cube/notation';
import { seeded } from '../../lib/random';
import { STEPS } from '../l3e/generate';
import { MAX_LENGTH, MIN_UNPAIRED, generatePairing6 } from './generate';

const c6 = cubeModel(6);
const E = edgesFor(6);
const solved = c6.solved();

function centresSolved(cube: Cube) {
  return FACES.every((f) => c6.centres(cube, f).flat().every((s) => s === f));
}
function crossSolved(cube: Cube) {
  return E.filter((e) => e.faces.includes('D')).every((e) =>
    e.pieces.every((p) => e.faces.every((f) => c6.stickerAt(cube, p, NORMAL[f]) === c6.stickerAt(solved, p, NORMAL[f]))),
  );
}
const MIDDLE = ['FR', 'FL', 'BR', 'BL'];

describe('6x6 pairing steps', () => {
  it('each step keeps centres and the white cross solved', () => {
    for (const step of STEPS) {
      const cube = c6.applyAlg(solved, step.moves);
      expect(centresSolved(cube)).toBe(true);
      expect(crossSolved(cube)).toBe(true);
    }
  });
});

describe('generatePairing6', () => {
  const runs = Array.from({ length: 60 }, (_, i) => generatePairing6(seeded(i)));

  it('leaves centres and cross solved with at least 6 other edges unpaired, within the length cap', () => {
    for (const r of runs) {
      const cube = c6.applyAlg(solved, parseAlg(r.text, 6));
      expect(cube).toEqual(r.cube);
      expect(centresSolved(cube)).toBe(true);
      expect(crossSolved(cube)).toBe(true);
      const unpaired = unpairedEdges(cube, 6);
      expect(unpaired.length).toBeGreaterThanOrEqual(MIN_UNPAIRED);
      expect(unpaired.some((n) => n.includes('D'))).toBe(false);
      expect(r.unpaired).toEqual(unpaired);
      expect(r.pieces).toHaveLength(unpaired.length * 4);
      expect(parseAlg(r.text, 6).length).toBeLessThanOrEqual(MAX_LENGTH);
    }
  });

  it('uses no rotations, slices or same-layer neighbours', () => {
    for (const r of runs) {
      expect(r.text).toMatch(/^[UDFBRLw2' ]+$/);
      const moves = parseAlg(r.text, 6);
      moves.slice(1).forEach((m, i) => {
        expect(!(m.face === moves[i].face && m.layer === moves[i].layer)).toBe(true);
      });
    }
  });

  it('is built from pairing steps, each leaving centres and cross intact', () => {
    for (const r of runs.slice(0, 10)) {
      let cube = c6.solved();
      for (const s of r.steps) {
        cube = c6.applyAlg(cube, [...s.u, ...s.moves]);
        expect(centresSolved(cube) && crossSolved(cube)).toBe(true);
      }
      expect(cube).toEqual(r.cube);
    }
  });

  it('varies: every non-white edge and both layers come up', () => {
    const seen = new Set(runs.flatMap((r) => r.unpaired));
    for (const e of E.filter((e) => !e.faces.includes('D'))) expect(seen.has(edgeName(e))).toBe(true);
    expect([...seen].some((n) => MIDDLE.includes(n))).toBe(true);
    expect([...seen].some((n) => n.includes('U'))).toBe(true);
  });

  it('gives up with an error on a constant random source', () => {
    expect(() => generatePairing6(() => 0)).toThrow(/Edge Pairing/);
  });
});
