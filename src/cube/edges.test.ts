import { applyAlg, solvedCube } from './cube';
import { EDGES, edgeName, isPaired, unpairedEdges } from './edges';
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
