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

const TOKEN = /^([UDFBRL]w?|[MES])(2'?|')?$/;

export function parseAlg(alg: string): Move[] {
  return alg
    .replace(/[()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((tok) => {
      const m = TOKEN.exec(tok);
      if (!m) throw new Error(`Unknown move: ${tok}`);
      const [, base, suffix] = m;
      const turns = suffix === "'" ? 3 : suffix ? 2 : 1;
      if (SLICE_FACE[base]) return move(SLICE_FACE[base], 'slice', turns)!;
      return move(base[0] as Face, base.length > 1 ? 'wide' : 'outer', turns)!;
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

/** Merges adjacent turns of the same layer and drops turns that cancel. */
export function simplify(moves: Move[]): Move[] {
  const out: Move[] = [];
  for (const m of moves) {
    const last = out[out.length - 1];
    if (last && last.face === m.face && last.layer === m.layer) {
      out.pop();
      const merged = move(m.face, m.layer, last.turns + m.turns);
      if (merged) out.push(merged);
    } else {
      out.push(m);
    }
  }
  return out;
}
