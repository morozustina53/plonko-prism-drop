import {LANES, PEG_ROWS} from '../constants/config';
import type {Rng} from './rng';

/**
 * The peg lattice: even rows carry 9 pegs on the lane centres, odd rows carry
 * 8 pegs on the half lanes. A ball therefore always meets a peg head-on and
 * steps exactly half a lane left or right on every row.
 */
export const pegsInRow = (row: number): number => (row % 2 === 0 ? LANES : LANES - 1);

export const pegLane = (row: number, index: number): number =>
  row % 2 === 0 ? index : index + 0.5;

export const pegIndexForLane = (row: number, lane: number): number => {
  const raw = row % 2 === 0 ? lane : lane - 0.5;
  return Math.max(0, Math.min(pegsInRow(row) - 1, Math.round(raw)));
};

export type PathStep = {
  row: number;
  pegIndex: number;
  lane: number; // lane AFTER the deflection
};

export type DropPath = {
  launchLane: number;
  steps: PathStep[];
  slot: number;
};

/** Mild centre pull: the rim slots stay the rare, valuable ones. */
export const rightChance = (lane: number): number => 0.5 + (4 - lane) * 0.02;

export const buildPath = (launchLane: number, rng: Rng): DropPath => {
  let lane = Math.max(0, Math.min(LANES - 1, Math.round(launchLane)));
  const steps: PathStep[] = [];

  for (let row = 0; row < PEG_ROWS; row++) {
    const pegIndex = pegIndexForLane(row, lane);
    const hitLane = pegLane(row, pegIndex);

    let dir: number;
    if (hitLane <= 0) {
      dir = 1;
    } else if (hitLane >= LANES - 1) {
      dir = -1;
    } else {
      dir = rng() < rightChance(hitLane) ? 1 : -1;
    }

    lane = Math.max(0, Math.min(LANES - 1, hitLane + dir * 0.5));
    steps.push({row, pegIndex, lane});
  }

  return {
    launchLane: Math.max(0, Math.min(LANES - 1, Math.round(launchLane))),
    steps,
    slot: Math.max(0, Math.min(LANES - 1, Math.round(lane))),
  };
};

export const pegKey = (row: number, index: number): string => row + ':' + index;
