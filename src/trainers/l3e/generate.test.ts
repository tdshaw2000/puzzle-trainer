import { cubeModel, type Cube } from '../../cube/cube';
import { edgesFor, unpairedEdges } from '../../cube/edges';
import { FACES, NORMAL, sameVec } from '../../cube/geometry';
import { formatAlg, parseAlg, simplify } from '../../cube/notation';
import { seeded } from '../../lib/random';
import { MIDDLE_SLOTS, STEPS, generateL3E } from './generate';

const c5 = cubeModel(5);
const EDGES = edgesFor(5);

const centresHome = (c: Cube) => FACES.every((f) => c5.centres(c, f).flat().every((s) => s === f));
const crossHome = (c: Cube) => {
  const solved = c5.solved();
  return EDGES.filter((e) => e.faces.includes('D')).every((e) =>
    e.pieces.every((p) => e.faces.every((f) => c5.stickerAt(c, p, NORMAL[f]) === c5.stickerAt(solved, p, NORMAL[f]))),
  );
};
const afterAlg = (text: string) => c5.applyAlg(c5.solved(), parseAlg(text, 5));

describe('L3E steps', () => {
  it('has slice-flip steps (Uw/Dw, flip trigger, slice undone) and insertion steps from all four sides', () => {
    const flips = STEPS.filter((s) => s.kind === 'slice-flip');
    const inserts = STEPS.filter((s) => s.kind === 'insert');
    // 6 slice turns x 2 triggers x 4 sides; 6 triggers x 4 sides
    expect(flips).toHaveLength(48);
    expect(inserts).toHaveLength(24);
    expect(flips.map((s) => formatAlg(s.moves))).toContain("Dw R U R' F R' F' R Dw'");
    expect(flips.map((s) => formatAlg(s.moves))).toContain("Uw2 L' U' L F' L F L' Uw2");
    expect(inserts.map((s) => formatAlg(s.moves))).toContain("B U2 B'");
  });

  it.each(STEPS.map((s) => [formatAlg(s.moves), s] as const))('%s keeps the centres and white cross solved', (_, step) => {
    const cube = c5.applyAlg(c5.solved(), step.moves);
    expect(centresHome(cube)).toBe(true);
    expect(crossHome(cube)).toBe(true);
    if (step.kind === 'insert') expect(unpairedEdges(cube)).toEqual([]);
    else expect(unpairedEdges(cube).length).toBeGreaterThan(0);
  });
});

describe('generateL3E', () => {
  const runs = Array.from({ length: 150 }, (_, seed) => generateL3E(seeded(seed)));

  it('leaves centres and cross solved and exactly 3 unpaired edges, all in the middle layer', () => {
    for (const s of runs) {
      const cube = afterAlg(s.text);
      expect(centresHome(cube)).toBe(true);
      expect(crossHome(cube)).toBe(true);
      const unpaired = unpairedEdges(cube);
      expect(unpaired).toHaveLength(3);
      for (const e of unpaired) expect(MIDDLE_SLOTS).toContain(e);
    }
  });

  it('reports the unpaired slots in F, R, B, L order, the pieces in them, and the cube', () => {
    for (const s of runs.slice(0, 30)) {
      const cube = afterAlg(s.text);
      expect(s.cube).toEqual(cube);
      expect(s.unpaired).toEqual(MIDDLE_SLOTS.filter((e) => unpairedEdges(cube).includes(e)));
      const expected = EDGES.filter((e) => s.unpaired.includes(e.faces.join(''))).flatMap((e) => e.pieces);
      expect(s.pieces).toHaveLength(9);
      for (const p of expected) expect(s.pieces.some((q) => sameVec(p, q))).toBe(true);
    }
  });

  it('uses only outer turns and Uw/Dw, with no rotations, slices or same-layer neighbours', () => {
    for (const s of runs) {
      expect(s.text).toMatch(/^([UDFBRL]|[UD]w)('|2)?( ([UDFBRL]|[UD]w)('|2)?)*$/);
      const moves = parseAlg(s.text, 5);
      expect(simplify(moves)).toEqual(moves);
      moves.slice(1).forEach((m, i) => expect(m.face === moves[i].face && m.layer === moves[i].layer).toBe(false));
    }
  });

  it('is built from at least 3 slice-flip steps', () => {
    for (const s of runs) {
      expect(s.steps.filter((st) => st.kind === 'slice-flip').length).toBeGreaterThanOrEqual(3);
      expect(formatAlg(simplify(s.steps.flatMap((st) => [...st.u, ...st.moves])))).toBe(s.text);
    }
  });

  it('varies which slots and which edges form the case', () => {
    const slotSets = new Set(runs.map((s) => s.unpaired.join(' ')));
    expect(slotSets.size).toBe(4);
    const colours = new Set<string>();
    for (const s of runs) {
      for (const e of EDGES.filter((x) => s.unpaired.includes(x.faces.join('')))) {
        for (const p of e.pieces) colours.add(e.faces.map((f) => s.cube[c5.slotAt(p, NORMAL[f])]).sort().join(''));
      }
    }
    expect([...colours].sort()).toEqual(['BL', 'BR', 'BU', 'FL', 'FR', 'FU', 'LU', 'RU']);
  });
});
