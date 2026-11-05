import { cubeModel } from './cube';
import { formatAlg, parseAlg } from './notation';

const c6 = cubeModel(6);
const apply = (alg: string, cube = c6.solved()) => c6.applyAlg(cube, parseAlg(alg, 6));
const solvedCentres = (cube: ReturnType<typeof c6.solved>) =>
  (['U', 'D', 'F', 'B', 'R', 'L'] as const).every((f) => c6.centres(cube, f).flat().every((s) => s === f));

describe('6x6 simulator', () => {
  it('has 216 stickers and starts solved', () => {
    expect(c6.SLOTS).toHaveLength(216);
    expect(c6.isSolved(c6.solved())).toBe(true);
  });

  it.each(['U', 'R', 'Rw', '3Rw', '3R', '3L', '2R', 'Lw', '3Lw', '3U', 'F', 'x', 'y', 'z'])(
    'four quarter turns of %s are the identity, one is not',
    (m) => {
      expect(c6.isSolved(apply(m))).toBe(false);
      expect(c6.isSolved(apply(`${m} ${m} ${m} ${m}`))).toBe(true);
    },
  );

  it('3R and 3L are different layers and each moves only its own layer', () => {
    // A layer turn moves 24 stickers around its ring plus nothing on the faces it does not touch.
    const changed = (alg: string) => apply(alg).filter((s, i) => s !== c6.solved()[i]).length;
    expect(changed('3R')).toBe(changed('3L'));
    expect(apply('3R')).not.toEqual(apply('3L'));
    // 3R then 3L' is not the identity (they are neighbours, not opposite sides of one slice)...
    expect(c6.isSolved(apply("3R 3L'"))).toBe(false);
    // ...but 3Rw and Rw differ by exactly the 3R layer.
    expect(apply("3Rw Rw'")).toEqual(apply('3R'));
  });

  it('3R only moves the centres of U, F, D, B (the third layer from R)', () => {
    const cube = apply('3R');
    expect(c6.centres(cube, 'R').flat().every((s) => s === 'R')).toBe(true);
    const u = c6.faceGrid(cube, 'U');
    for (let row = 0; row < 6; row++) expect(u[row].map((s) => s === 'U')).toEqual([true, true, true, false, true, true]);
  });

  it('3L is the third layer from the left', () => {
    const u = c6.faceGrid(apply('3L'), 'U');
    for (let row = 0; row < 6; row++) expect(u[row].map((s) => s === 'U')).toEqual([true, true, false, true, true, true]);
  });

  it('whole-cube rotations leave every centre solved after x x\'', () => {
    expect(solvedCentres(apply("x x'"))).toBe(true);
    expect(apply('x')).toEqual(apply('3Rw 3Lw\''));
  });

  it('round-trips the sheet notation', () => {
    const alg = "3L' U 3R U' 3L U 3R' Rw Lw' 3Rw 3Lw' 2R F' U2";
    expect(formatAlg(parseAlg(alg, 6))).toBe(alg);
  });

  it('has no slices', () => {
    expect(() => parseAlg('M', 6)).toThrow();
  });
});

describe('notation unchanged for 4x4 and 5x5', () => {
  it('still reads Rw, M and glued tokens', () => {
    expect(formatAlg(parseAlg("Rw U2Rw' M"))).toBe("Rw U2 Rw' M");
    expect(() => parseAlg('RU')).toThrow();
  });
});
