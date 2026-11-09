import {
  DROPS_PER_ROUND,
  LANES,
  PEG_LIGHT_POINTS,
  PEG_ROWS,
  SLOT_TIERS,
  VOID_SLOT_FROM_LEVEL,
} from '../constants/config';
import {makeRng, seedFor, type Rng} from './rng';

export type BoardLayout = {
  seed: number;
  tiers: number[]; // 9 slot values, 0 = VOID
  rowShift: number[]; // per-row pixel jitter of the peg lattice
  voidIndex: number; // -1 when the level has no void slot
};

/** Symmetric tier families: the rim always pays most, the centre least. */
const FAMILIES: number[][] = [
  [500, 420], // rim
  [220, 260],
  [120, 150],
  [60, 80],
  [25, 40], // centre
];

export const FALLBACK_LAYOUT: BoardLayout = {
  seed: 0,
  tiers: SLOT_TIERS.slice(),
  rowShift: new Array(PEG_ROWS).fill(0),
  voidIndex: -1,
};

const buildTiers = (rng: Rng, level: number): {tiers: number[]; voidIndex: number} => {
  const ring = FAMILIES.map(family => family[Math.floor(rng() * family.length) % family.length]);
  const tiers = [ring[0], ring[1], ring[2], ring[3], ring[4], ring[3], ring[2], ring[1], ring[0]];

  let voidIndex = -1;
  if (level >= VOID_SLOT_FROM_LEVEL) {
    // Only an inner slot can go dark — the rim risk stays readable.
    const candidates = [2, 3, 5, 6];
    voidIndex = candidates[Math.floor(rng() * candidates.length) % candidates.length];
    tiers[voidIndex] = 0;
  }
  return {tiers, voidIndex};
};

/** Optimistic ceiling of a round: used only to reject a dead layout. */
export const bestReachable = (tiers: number[]): number => {
  const top = Math.max(...tiers);
  return DROPS_PER_ROUND * top + DROPS_PER_ROUND * PEG_ROWS * PEG_LIGHT_POINTS;
};

export const isSolvable = (tiers: number[], target: number): boolean =>
  bestReachable(tiers) >= target * 1.6;

export const generateLayout = (
  level: number,
  attempt: number,
  target: number,
): BoardLayout => {
  for (let tryIndex = 0; tryIndex < 20; tryIndex++) {
    const seed = seedFor(level, attempt + tryIndex * 31);
    const rng = makeRng(seed);
    const {tiers, voidIndex} = buildTiers(rng, level);
    if (!isSolvable(tiers, target)) {
      continue;
    }
    const rowShift: number[] = [];
    for (let row = 0; row < PEG_ROWS; row++) {
      rowShift.push(Math.round((rng() - 0.5) * 6));
    }
    return {seed, tiers, rowShift, voidIndex};
  }
  return FALLBACK_LAYOUT;
};

export const slotLabel = (tier: number): string => (tier > 0 ? String(tier) : 'VOID');

export const laneCount = LANES;
