/**
 * Seeded PRNG — one seed per attempt so a round is reproducible from its seed.
 * seed = level * 7919 ^ attempt * 104729 (design doc).
 */
export type Rng = () => number;

export const seedFor = (level: number, attempt: number): number =>
  ((level * 7919) ^ (attempt * 104729)) >>> 0;

export const makeRng = (seed: number): Rng => {
  let a = (seed || 1) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const pick = <T,>(rng: Rng, list: readonly T[]): T =>
  list[Math.floor(rng() * list.length) % list.length];

export const intBetween = (rng: Rng, lo: number, hi: number): number =>
  lo + Math.floor(rng() * (hi - lo + 1));
