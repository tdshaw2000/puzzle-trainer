// Test helpers for public/skin.js. It's a classic script (the page loads it in the head, before
// first paint), so the tests run its source afresh each time instead of importing it.
import source from '../../public/skin.js?raw';

export type Skins = {
  SKINS: [string, string][];
  DEFAULT_SKIN: string;
  chooseSkin(value: unknown): string;
  readSkin(storage: Pick<Storage, 'getItem'> | undefined): string;
  saveSkin(storage: Pick<Storage, 'setItem'> | undefined, id: string): void;
  themeHref(id: string): string;
};

/** Runs skin.js against the current document and returns what it puts on globalThis. */
export function runSkinScript(): Skins {
  new Function(source)();
  return (globalThis as unknown as { PuzzleSkins: Skins }).PuzzleSkins;
}
