/** Faces in WCA notation. */
export type Face = 'U' | 'D' | 'F' | 'B' | 'R' | 'L';
export type Layer = 'outer' | 'wide' | 'slice';

/**
 * One turn. `face` is the face whose clockwise direction the turn follows.
 * Slices are stored relative to L, D or F (the faces M, E and S follow).
 * `turns` counts clockwise quarter turns: 1, 2 or 3 (3 = prime).
 */
export interface Move {
  face: Face;
  layer: Layer;
  turns: 1 | 2 | 3;
}

export const OPPOSITE: Record<Face, Face> = { U: 'D', D: 'U', F: 'B', B: 'F', R: 'L', L: 'R' };

const SLICE_FACE: Record<string, Face> = { M: 'L', E: 'D', S: 'F' };
const SLICE_NAME: Partial<Record<Face, string>> = { L: 'M', D: 'E', F: 'S' };

/** Builds a move, normalising slices to their L/D/F reference face. */
export function move(face: Face, layer: Layer, turns: number): Move | null {
  let t = ((turns % 4) + 4) % 4;
  if (t === 0) return null;
  if (layer === 'slice' && !SLICE_NAME[face]) {
    face = OPPOSITE[face];
    t = 4 - t;
  }
  return { face, layer, turns: t as 1 | 2 | 3 };
}

const TOKEN = /([UDFBRL]w?|[MESxyz])(2'?|')?/y;

/**
 * A whole-cube rotation as layer turns (x follows R, y follows U, z follows F): on the 5x5 the
 * two wide turns and the central slice, on the 4x4 the two wide turns.
 */
const ROTATION: Record<number, Record<string, Array<[Face, Layer, number]>>> = {
  5: {
    x: [['R', 'wide', 1], ['L', 'slice', -1], ['L', 'wide', -1]],
    y: [['U', 'wide', 1], ['D', 'slice', -1], ['D', 'wide', -1]],
    z: [['F', 'wide', 1], ['F', 'slice', 1], ['B', 'wide', -1]],
  },
  4: {
    x: [['R', 'wide', 1], ['L', 'wide', -1]],
    y: [['U', 'wide', 1], ['D', 'wide', -1]],
    z: [['F', 'wide', 1], ['B', 'wide', -1]],
  },
};

/**
 * Splits a whitespace-free chunk into move tokens. A move may be glued only after a rotation or
 * after a move ending in ' or 2 (as some printed algs do, e.g. x'U2), where the split is unambiguous.
 */
function tokens(chunk: string): Array<[string, string | undefined]> {
  const out: Array<[string, string | undefined]> = [];
  TOKEN.lastIndex = 0;
  while (TOKEN.lastIndex < chunk.length) {
    const m = TOKEN.exec(chunk);
    if (!m) throw new Error(`Unknown move: ${chunk}`);
    const prev = out[out.length - 1];
    if (prev && !'xyz'.includes(prev[0]) && !prev[1]) throw new Error(`Unknown move: ${chunk}`);
    out.push([m[1], m[2]]);
  }
  return out;
}

/** Parses an alg for an N×N cube (5x5 or 4x4). Whole-cube rotations x, y, z are expanded into their layer turns. */
export function parseAlg(alg: string, size = 5): Move[] {
  const rotation = ROTATION[size];
  if (!rotation) throw new Error(`Unsupported cube size: ${size}`);
  return alg
    .replace(/[()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .flatMap(tokens)
    .flatMap(([base, suffix]) => {
      const turns = suffix === "'" ? 3 : suffix ? 2 : 1;
      if (rotation[base]) return rotation[base].map(([f, layer, k]) => move(f, layer, k * turns)!);
      if (SLICE_FACE[base]) {
        if (size % 2 === 0) throw new Error(`No ${base} slice on a ${size}x${size}`);
        return [move(SLICE_FACE[base], 'slice', turns)!];
      }
      return [move(base[0] as Face, base.length > 1 ? 'wide' : 'outer', turns)!];
    });
}

export function formatMove(m: Move): string {
  const base = m.layer === 'slice' ? SLICE_NAME[m.face]! : m.face + (m.layer === 'wide' ? 'w' : '');
  return base + (m.turns === 1 ? '' : m.turns === 2 ? '2' : "'");
}

export function formatAlg(moves: Move[]): string {
  return moves.map(formatMove).join(' ');
}

export function invert(moves: Move[]): Move[] {
  return [...moves].reverse().map((m) => move(m.face, m.layer, -m.turns)!);
}

const AXIS: Record<Face, string> = { R: 'x', L: 'x', U: 'y', D: 'y', F: 'z', B: 'z' };

/**
 * Merges turns of the same layer and drops turns that cancel. Turns about the same axis commute,
 * so a turn merges with an earlier one of its layer even with same-axis turns in between.
 */
export function simplify(moves: Move[]): Move[] {
  const out: Move[] = [];
  for (const m of moves) {
    let j = out.length - 1;
    while (j >= 0 && AXIS[out[j].face] === AXIS[m.face] && !(out[j].face === m.face && out[j].layer === m.layer)) j--;
    if (j >= 0 && out[j].face === m.face && out[j].layer === m.layer) {
      const merged = move(m.face, m.layer, out[j].turns + m.turns);
      out.splice(j, 1, ...(merged ? [merged] : []));
    } else {
      out.push(m);
    }
  }
  return out;
}
