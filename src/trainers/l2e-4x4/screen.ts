import { FACE_COLOUR } from '../../cube/colours';
import { cubeModel } from '../../cube/cube';
import type { Face } from '../../cube/notation';
import type { Random } from '../../lib/random';
import type { L2EScramble } from '../l2e/engine';
import { mountL2EScreen, type L2EScreenConfig } from '../l2e/screen';
import { L2E4 } from './cases';
import { renderNet } from '../shared/net';

const c4 = cubeModel(4);

/** Spoken description of the case pieces: each wing's two colours. */
function describePieces(s: L2EScramble): string {
  const wings = s.casePieces.map((pos) => {
    const normals = [0, 1, 2]
      .filter((axis) => Math.abs(pos[axis]) === c4.outer)
      .map((axis) => [0, 1, 2].map((k) => (k === axis ? Math.sign(pos[axis]) : 0)) as unknown as readonly [number, number, number]);
    return normals.map((n) => FACE_COLOUR[c4.stickerAt(s.cube, pos, n) as Face].name).join('/');
  });
  return `Case wings: ${wings.join(', ')}`;
}

const FOUR: L2EScreenConfig = {
  generate: (random) => L2E4.generate(random),
  caseCount: 5,
  render: renderNet,
  pictureCaption: 'Top face with the sides folded out, green side at the bottom',
  describe: describePieces,
  rotationText: (s) => `Rotation: ${s.yHint || 'no rotation'}`,
  sliceNotes: {},
  source: 'sheet',
  className: 'l2e-4x4',
};

/** Mounts the 4x4 Last Two Edges trainer. Returns a cleanup function. */
export function mountL2E4(container: HTMLElement, random: Random = Math.random): () => void {
  return mountL2EScreen(container, FOUR, random);
}
