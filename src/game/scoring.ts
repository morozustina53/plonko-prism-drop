import {PEG_LIGHT_POINTS, PRISM_MULTIPLIER, ROW_BONUS_POINTS} from '../constants/config';
import {pegsInRow} from './path';

export const slotScore = (tier: number, armed: boolean): number =>
  armed ? tier * PRISM_MULTIPLIER : tier;

export const pegScore = (newPegs: number): number => newPegs * PEG_LIGHT_POINTS;

export const rowBonusScore = (rowsCompleted: number): number =>
  rowsCompleted * ROW_BONUS_POINTS;

/** Rows whose every peg is lit and that were not already counted. */
export const completedRows = (
  lit: Record<string, boolean>,
  alreadyCounted: Record<number, boolean>,
  rows: number,
): number[] => {
  const done: number[] = [];
  for (let row = 0; row < rows; row++) {
    if (alreadyCounted[row]) {
      continue;
    }
    const total = pegsInRow(row);
    let count = 0;
    for (let i = 0; i < total; i++) {
      if (lit[row + ':' + i]) {
        count++;
      }
    }
    if (count === total) {
      done.push(row);
    }
  }
  return done;
};

export const formatPoints = (value: number): string =>
  String(Math.max(0, Math.round(value))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
