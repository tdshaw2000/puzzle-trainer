import { cubeModel } from './cube';
import { FACES } from './geometry';
import { parseAlg } from './notation';

const c4 = cubeModel(4);
const apply = (alg: string, cube = c4.solved()) => c4.applyAlg(cube, parseAlg(alg, 4));

describe('4x4 simulator', () => {
  it('has 96 stickers and starts solved', () => {
    expect(c4.SLOTS).toHaveLength(96);
    expect(c4.isSolved(c4.solved())).toBe(true);
  });

  it.each(['U', 'R', 'F', 'D', 'L', 'B', 'Rw', 'Uw', 'Fw', 'Dw', 'Lw', 'Bw', 'x', 'y', 'z'])(
    'four quarter turns of %s are the identity, one is not',
    (m) => {
      expect(c4.isSolved(apply(m))).toBe(false);
      expect(c4.isSolved(apply(`${m} ${m} ${m} ${m}`))).toBe(true);
    },
  );

  it('has no slices', () => {
    expect(() => parseAlg('M', 4)).toThrow();
  });

  it('Rw moves the two right columns of F to U', () => {
    const u = c4.faceGrid(apply('Rw'), 'U');
    for (let row = 0; row < 4; row++) expect(u[row]).toEqual(['U', 'U', 'F', 'F']);
  });

  it('x turns the whole cube like R', () => {
    const c = apply('x');
    for (const [from, to] of [['F', 'U'], ['U', 'B'], ['D', 'F'], ['R', 'R']] as const) {
      expect(c4.faceGrid(c, to).flat().every((s) => s === from)).toBe(true);
    }
  });

  it('centres are the inner 2x2 of each face', () => {
    const c = apply("Rw U Rw'");
    expect(c4.centres(c4.solved(), 'U')).toEqual([['U', 'U'], ['U', 'U']]);
    expect(FACES.some((f) => c4.centres(c, f).flat().some((s) => s !== f))).toBe(true);
  });

  it('sexy move has order 6', () => {
    const sexy = "R U R' U' ";
    expect(c4.isSolved(apply(sexy.repeat(5)))).toBe(false);
    expect(c4.isSolved(apply(sexy.repeat(6)))).toBe(true);
  });

  it('a slot can be found by position and normal, with half-unit coordinates', () => {
    const i = c4.slotAt([0.5, 1.5, 1.5], [0, 0, 1]);
    expect(c4.SLOTS[i]).toEqual({ pos: [0.5, 1.5, 1.5], normal: [0, 0, 1] });
    expect(c4.stickerAt(apply('U'), [0.5, 1.5, 1.5], [0, 0, 1])).toBe('R');
  });
});
