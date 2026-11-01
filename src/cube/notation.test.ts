import { formatAlg, invert, parseAlg, simplify } from './notation';

describe('parseAlg / formatAlg', () => {
  it('round-trips outer, wide and slice moves, ignoring brackets', () => {
    const moves = parseAlg("(Rw U Rw') U2 (Rw U2' Rw') M' E S2 Fw'");
    expect(formatAlg(moves.slice(0, 8))).toBe("Rw U Rw' U2 Rw U2 Rw' M'");
    expect(formatAlg(parseAlg("E S2 Fw'"))).toBe("E S2 Fw'");
  });

  it('treats U2 and U2\' as the same move', () => {
    expect(parseAlg("U2'")).toEqual(parseAlg('U2'));
  });

  it('rejects unknown tokens', () => {
    expect(() => parseAlg('Q')).toThrow();
    expect(() => parseAlg('Mw')).toThrow();
  });
});

describe('invert', () => {
  it('reverses order and direction', () => {
    expect(formatAlg(invert(parseAlg("Rw U' M' U2")))).toBe("U2 M U Rw'");
  });
});

describe('simplify', () => {
  it('merges adjacent turns of the same layer', () => {
    expect(formatAlg(simplify(parseAlg('U U')))).toBe('U2');
    expect(formatAlg(simplify(parseAlg("Rw U' Rw' Rw U' Rw'")))).toBe("Rw U2 Rw'");
  });

  it('removes turns that cancel, repeatedly', () => {
    expect(formatAlg(simplify(parseAlg("R U U' R'")))).toBe('');
    expect(formatAlg(simplify(parseAlg("R U2 U2 R2 F")))).toBe("R' F");
  });

  it('keeps different layers of the same face apart', () => {
    expect(formatAlg(simplify(parseAlg('R Rw')))).toBe('R Rw');
  });

  it('treats a slice and its opposite-named direction as one layer', () => {
    expect(formatAlg(simplify(parseAlg("M M")))).toBe('M2');
  });
});

describe('parseAlg rotations', () => {
  it('expands x, y and z into the three layer turns of a 5x5', () => {
    expect(formatAlg(parseAlg('x'))).toBe("Rw M' Lw'");
    expect(formatAlg(parseAlg("x'"))).toBe("Rw' M Lw");
    expect(formatAlg(parseAlg('y2'))).toBe('Uw2 E2 Dw2');
    expect(formatAlg(parseAlg('z'))).toBe("Fw S Bw'");
  });

  it('splits a rotation glued to the next move', () => {
    expect(parseAlg("x'U2")).toEqual(parseAlg("x' U2"));
  });

  it('still rejects junk or moves glued to a move', () => {
    expect(() => parseAlg('UQ')).toThrow();
    expect(() => parseAlg('RU')).toThrow();
  });
});

describe('parseAlg on the 4x4', () => {
  it('expands rotations into the 4x4 wide turns', () => {
    expect(formatAlg(parseAlg('x', 4))).toBe("Rw Lw'");
    expect(formatAlg(parseAlg("y'", 4))).toBe("Uw' Dw");
    expect(formatAlg(parseAlg('z2', 4))).toBe('Fw2 Bw2');
  });

  it('reads moves glued after a move ending in a suffix', () => {
    expect(parseAlg("U2Rw'", 4)).toEqual(parseAlg("U2 Rw'", 4));
    expect(parseAlg("F'R")).toEqual(parseAlg("F' R"));
    expect(parseAlg("U2'R")).toEqual(parseAlg('U2 R'));
    expect(() => parseAlg('RU')).toThrow();
    expect(() => parseAlg("R'Q")).toThrow();
  });
});
