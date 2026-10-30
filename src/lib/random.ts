/** A source of floats in [0, 1), like Math.random. */
export type Random = () => number;

export const randomInt = (random: Random, n: number) => Math.floor(random() * n);
export const pick = <T>(random: Random, items: readonly T[]): T => items[randomInt(random, items.length)];

/** Small seeded generator (mulberry32) for repeatable tests. */
export function seeded(seed: number): Random {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
