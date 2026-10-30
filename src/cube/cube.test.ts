import { applyAlg, centres, faceGrid, isSolved, solvedCube } from './cube';
import { FACES } from './geometry';
import { parseAlg } from './notation';

const apply = (alg: string, cube = solvedCube()) => applyAlg(cube, parseAlg(alg));

describe('5x5 simulator', () => {
  it('starts solved', () => {
    expect(isSolved(solvedCube())).toBe(true);
  });

  it.each(['U', 'R', 'F', 'D', 'L', 'B', 'Rw', 'Uw', 'Fw', 'Dw', 'Lw', 'Bw', 'M', 'E', 'S'])(
    'four quarter turns of %s are the identity, one is not',
    (m) => {
      expect(isSolved(apply(m))).toBe(false);
      expect(isSolved(apply(`${m} ${m} ${m} ${m}`))).toBe(true);
    },
  );

  it('sexy move has order 6', () => {
    const sexy = "R U R' U' ";
    expect(isSolved(apply(sexy.repeat(5)))).toBe(false);
    expect(isSolved(apply(sexy.repeat(6)))).toBe(true);
  });

  it('R moves the front right column to U', () => {
    const c = apply('R');
    const u = faceGrid(c, 'U');
    for (let row = 0; row < 5; row++) {
      expect(u[row][4]).toBe('F');
      expect(u[row][3]).toBe('U');
    }
  });

  it('U moves the front top row to L', () => {
    const l = faceGrid(apply('U'), 'L');
    expect(l[0]).toEqual(['F', 'F', 'F', 'F', 'F']);
    expect(l[1]).toEqual(['L', 'L', 'L', 'L', 'L']);
  });

  it('F moves the top row of U to the left column of R', () => {
    const r = faceGrid(apply('F'), 'R');
    for (let row = 0; row < 5; row++) expect(r[row][0]).toBe('U');
  });

  it('Rw moves two columns, M moves the middle column like L', () => {
    const u = faceGrid(apply('Rw'), 'U');
    expect(u[2].slice(2)).toEqual(['U', 'F', 'F']);
    const m = faceGrid(apply('M'), 'F');
    expect(m[2]).toEqual(['F', 'F', 'U', 'F', 'F']);
  });

  it('E follows D and S follows F', () => {
    expect(faceGrid(apply('E'), 'R')[2]).toEqual(['F', 'F', 'F', 'F', 'F']);
    expect(faceGrid(apply('E'), 'R')[1]).toEqual(['R', 'R', 'R', 'R', 'R']);
    expect(faceGrid(apply('S'), 'R').map((r) => r[2])).toEqual(['U', 'U', 'U', 'U', 'U']);
    expect(faceGrid(apply('S'), 'R').map((r) => r[1])).toEqual(['R', 'R', 'R', 'R', 'R']);
  });

  it('outer turns never move centres between faces', () => {
    const c = apply("R U' F2 D B' L2 U R' D2 F");
    for (const f of FACES) expect(centres(c, f).flat().every((s) => s === f)).toBe(true);
  });

  it('applying an alg then its inverse returns to solved', () => {
    expect(isSolved(apply("Rw U' M' U Rw' U' M M' U Rw U' M U Rw'"))).toBe(true);
  });
});
