import type { Face } from './notation';

/** Colour scheme as held for scrambling: yellow U, green F. */
export const FACE_COLOUR: Record<Face, { name: string; hex: string }> = {
  U: { name: 'yellow', hex: '#ffd500' },
  D: { name: 'white', hex: '#ffffff' },
  F: { name: 'green', hex: '#009b48' },
  B: { name: 'blue', hex: '#0046ad' },
  R: { name: 'orange', hex: '#ff5800' },
  L: { name: 'red', hex: '#c41e3a' },
};

/** Fill for stickers that don't matter in a picture. */
export const RING_COLOUR = '#555555';
