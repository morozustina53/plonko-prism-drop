import {DROPS_PER_ROUND} from '../constants/config';
import type {BoardLayout} from './layoutGenerator';

export type RoundPhase = 'idle' | 'aiming' | 'falling' | 'settling' | 'roundOver';

export type RoundResult = {
  score: number;
  target: number;
  level: number;
  met: boolean;
  pegsLit: number;
  bestSlot: number;
  prismsUsed: number;
};

export type RoundState = {
  phase: RoundPhase;
  score: number;
  dropsLeft: number;
  charge: number;
  armed: boolean;
  pegsLit: number;
  bestSlot: number;
  prismsUsed: number;
  rowBonuses: number;
};

export const createRound = (): RoundState => ({
  phase: 'idle',
  score: 0,
  dropsLeft: DROPS_PER_ROUND,
  charge: 0,
  armed: false,
  pegsLit: 0,
  bestSlot: 0,
  prismsUsed: 0,
  rowBonuses: 0,
});

const LEGAL: Record<RoundPhase, RoundPhase[]> = {
  idle: ['aiming'],
  aiming: ['falling'],
  falling: ['settling'],
  settling: ['idle', 'roundOver'],
  roundOver: [],
};

export const canTransition = (from: RoundPhase, to: RoundPhase): boolean =>
  LEGAL[from].indexOf(to) >= 0;

export const canDrop = (state: RoundState, paused: boolean): boolean =>
  !paused && state.phase === 'idle' && state.dropsLeft > 0;

export const nextPhaseAfterSettle = (state: RoundState): RoundPhase =>
  state.dropsLeft <= 0 ? 'roundOver' : 'idle';

export const toResult = (
  state: RoundState,
  level: number,
  target: number,
  _layout?: BoardLayout,
): RoundResult => ({
  score: state.score,
  target,
  level,
  met: state.score >= target,
  pegsLit: state.pegsLit,
  bestSlot: state.bestSlot,
  prismsUsed: state.prismsUsed,
});
