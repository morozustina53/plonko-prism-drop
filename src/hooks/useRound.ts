import {useCallback, useMemo, useRef, useState} from 'react';
import {DROPS_PER_ROUND, PEG_ROWS, targetForLevel} from '../constants/config';
import {addCharge, canArm, spendCharge} from '../game/charge';
import {generateLayout, type BoardLayout} from '../game/layoutGenerator';
import {pegKey} from '../game/path';
import {completedRows, pegScore, rowBonusScore, slotScore} from '../game/scoring';
import {createRound, type RoundState} from '../game/round';

export type LitMap = Record<string, boolean>;

export type RoundApi = {
  state: RoundState;
  layout: BoardLayout;
  target: number;
  lit: LitMap;
  lightPeg: (row: number, index: number) => void;
  settle: (slotIndex: number) => {gained: number; bonusText: string};
  spendDrop: () => void;
  beginDrop: () => void;
  arm: () => void;
  setPhase: (phase: RoundState['phase']) => void;
  reset: (level: number, attempt: number) => void;
};

export const useRound = (level: number, attempt: number): RoundApi => {
  const target = useMemo(() => targetForLevel(level), [level]);
  const [layout, setLayout] = useState<BoardLayout>(() =>
    generateLayout(level, attempt, targetForLevel(level)),
  );
  const [state, setState] = useState<RoundState>(createRound);
  const [lit, setLit] = useState<LitMap>({});

  // Animation callbacks read refs, never stale state.
  const litRef = useRef<LitMap>({});
  const stateRef = useRef<RoundState>(state);
  const countedRows = useRef<Record<number, boolean>>({});
  stateRef.current = state;

  const lightPeg = useCallback((row: number, index: number) => {
    const key = pegKey(row, index);
    if (litRef.current[key]) {
      return;
    }
    litRef.current = {...litRef.current, [key]: true};
    setLit(litRef.current);
    setState(prev => ({
      ...prev,
      score: prev.score + pegScore(1),
      pegsLit: prev.pegsLit + 1,
      charge: prev.armed ? prev.charge : addCharge(prev.charge, 1),
    }));
  }, []);

  const settle = useCallback(
    (slotIndex: number) => {
      const tier = layout.tiers[slotIndex] ?? 0;
      const armed = stateRef.current.armed;
      const slotPoints = slotScore(tier, armed);
      const rows = completedRows(litRef.current, countedRows.current, PEG_ROWS);
      rows.forEach(row => {
        countedRows.current[row] = true;
      });
      const bonus = rowBonusScore(rows.length);

      setState(prev => ({
        ...prev,
        score: prev.score + slotPoints + bonus,
        bestSlot: Math.max(prev.bestSlot, slotPoints),
        armed: false,
        charge: armed ? spendCharge() : prev.charge,
        rowBonuses: prev.rowBonuses + rows.length,
      }));

      let bonusText = '';
      if (rows.length > 0) {
        bonusText = 'SPECTRUM ROW +' + bonus;
      } else if (armed) {
        bonusText = 'PRISM x2';
      }
      return {gained: slotPoints + bonus, bonusText};
    },
    [layout],
  );

  const beginDrop = useCallback(() => {
    setState(prev => ({...prev, phase: 'falling', dropsLeft: Math.max(0, prev.dropsLeft - 1)}));
  }, []);

  const spendDrop = useCallback(() => {
    setState(prev => ({...prev, dropsLeft: Math.max(0, prev.dropsLeft - 1)}));
  }, []);

  const arm = useCallback(() => {
    setState(prev =>
      canArm(prev.charge, prev.armed)
        ? {...prev, armed: true, prismsUsed: prev.prismsUsed + 1}
        : prev,
    );
  }, []);

  const setPhase = useCallback((phase: RoundState['phase']) => {
    setState(prev => ({...prev, phase}));
  }, []);

  const reset = useCallback((nextLevel: number, nextAttempt: number) => {
    litRef.current = {};
    countedRows.current = {};
    setLit({});
    setState({...createRound(), dropsLeft: DROPS_PER_ROUND});
    setLayout(generateLayout(nextLevel, nextAttempt, targetForLevel(nextLevel)));
  }, []);

  return {state, layout, target, lit, lightPeg, settle, spendDrop, beginDrop, arm, setPhase, reset};
};
