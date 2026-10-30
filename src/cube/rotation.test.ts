import { applyAlg, solvedCube, stickerAt, SLOTS } from './cube';
import { frameRotation, rewrite, SIDE_PAIRS } from './rotation';
import { formatAlg, parseAlg } from './notation';

describe('frameRotation', () => {
  it('lists the 8 ordered adjacent side-face pairs', () => {
    expect(SIDE_PAIRS).toHaveLength(8);
    for (const [x, y] of SIDE_PAIRS) {
      expect('FRBL').toContain(x);
      expect('FRBL').toContain(y);
    }
  });

  it('maps sheet U and F onto the chosen faces and sheet R onto U or D', () => {
    const r = frameRotation('F', 'R');
    expect(r.faceMap.U).toBe('F');
    expect(r.faceMap.F).toBe('R');
    expect(r.faceMap.R).toBe('U');
    expect(r.faceMap.D).toBe('B');
    for (const [x, y] of SIDE_PAIRS) expect('UD').toContain(frameRotation(x, y).faceMap.R);
  });

  it('rewrites moves face by face, slices included', () => {
    const r = frameRotation('F', 'R');
    expect(formatAlg(rewrite(parseAlg("Rw U' M' U2"), r))).toBe("Uw F' E' F2");
  });

  it.each(SIDE_PAIRS)('a rewritten alg acts on the rotated cube (%s/%s)', (x, y) => {
    const r = frameRotation(x, y);
    const alg = parseAlg("Rw U' M' U Rw' U' M R2 F' D L B2");
    const sheet = applyAlg(solvedCube(), alg);
    const moved = applyAlg(solvedCube(), rewrite(alg, r));
    for (const { pos, normal } of SLOTS) {
      expect(stickerAt(moved, r.vec(pos), r.vec(normal))).toBe(r.faceMap[stickerAt(sheet, pos, normal)]);
    }
  });
});
