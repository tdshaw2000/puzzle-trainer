import { applyAlg, cubeModel, solvedCube } from './cube';
import { EDGES, edgeName, edgesFor, isPaired, unpairedEdges } from './edges';
import { parseAlg } from './notation';

describe('edges', () => {
  it('lists the 12 edges once each', () => {
    expect(EDGES).toHaveLength(12);
    expect(new Set(EDGES.map(edgeName)).size).toBe(12);
    expect(EDGES.map(edgeName)).toContain('UF');
  });

  it('a solved cube and outer turns keep every edge paired', () => {
    expect(unpairedEdges(solvedCube())).toEqual([]);
    expect(unpairedEdges(applyAlg(solvedCube(), parseAlg("R U F' D2 L B'")))).toEqual([]);
  });

  it('a wide turn splits edges', () => {
    const cube = applyAlg(solvedCube(), parseAlg('Rw'));
    expect(isPaired(cube, EDGES.find((e) => edgeName(e) === 'UF')!)).toBe(false);
    expect(unpairedEdges(cube).length).toBeGreaterThan(0);
  });
});

describe('4x4 edges', () => {
  const c4 = cubeModel(4);
  const edges4 = edgesFor(4);
  const apply = (alg: string) => c4.applyAlg(c4.solved(), parseAlg(alg, 4));

  it('lists 12 edge slots of two wings each', () => {
    expect(edges4).toHaveLength(12);
    expect(edges4.every((e) => e.pieces.length === 2)).toBe(true);
    const uf = edges4.find((e) => edgeName(e) === 'UF')!;
    expect(uf.pieces).toEqual([[-0.5, 1.5, 1.5], [0.5, 1.5, 1.5]]);
    expect(uf.mid).toEqual([0, 1.5, 1.5]);
  });

  it('outer turns keep edges paired, a wide turn splits them', () => {
    expect(unpairedEdges(apply("R U F' D2 L B' x y"), 4)).toEqual([]);
    expect(unpairedEdges(apply('Rw'), 4).sort()).toEqual(['DB', 'DF', 'UB', 'UF']);
  });
});

it('works out the cube size from the sticker count', () => {
  const c4 = cubeModel(4);
  expect(unpairedEdges(c4.applyAlg(c4.solved(), parseAlg('Rw', 4))).sort()).toEqual(['DB', 'DF', 'UB', 'UF']);
});
