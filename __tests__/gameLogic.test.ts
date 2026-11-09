import {
  DROPS_PER_ROUND,
  LANES,
  LOADER_DURATION_MS,
  PEG_ROWS,
  PRISM_CHARGE_MAX,
  SLOT_TIERS,
  TILE,
  BOARD_W,
  BOARD_FRAME,
  targetForLevel,
} from '../src/constants/config';
import {makeRng, seedFor} from '../src/game/rng';
import {buildPath, pegLane, pegsInRow} from '../src/game/path';
import {generateLayout, isSolvable, FALLBACK_LAYOUT} from '../src/game/layoutGenerator';
import {addCharge, canArm, spendCharge} from '../src/game/charge';
import {completedRows, formatPoints, slotScore} from '../src/game/scoring';
import {canDrop, canTransition, createRound, toResult} from '../src/game/round';
import {
  DEFAULT_PROGRESS,
  loadProgress,
  resetProgress,
  saveProgress,
} from '../src/state/progressStore';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  resetSettings,
  saveSettings,
} from '../src/state/settingsStore';

describe('boardPath', () => {
  it('always lands inside the lane range after every row', () => {
    for (let lane = 0; lane < LANES; lane++) {
      const path = buildPath(lane, makeRng(seedFor(1, lane + 1)));
      expect(path.steps).toHaveLength(PEG_ROWS);
      path.steps.forEach(step => {
        expect(step.lane).toBeGreaterThanOrEqual(0);
        expect(step.lane).toBeLessThanOrEqual(LANES - 1);
      });
      expect(path.slot).toBeGreaterThanOrEqual(0);
      expect(path.slot).toBeLessThanOrEqual(LANES - 1);
    }
  });

  it('deflects exactly half a lane on every row', () => {
    const path = buildPath(4, makeRng(99));
    let previous = 4;
    path.steps.forEach(step => {
      expect(Math.abs(step.lane - previous)).toBeCloseTo(0.5, 5);
      previous = step.lane;
    });
  });

  it('keeps the lattice inside the board frame', () => {
    expect(BOARD_W).toBe(TILE * LANES + 2 * BOARD_FRAME);
    for (let row = 0; row < PEG_ROWS; row++) {
      const last = pegsInRow(row) - 1;
      expect(pegLane(row, last)).toBeLessThanOrEqual(LANES - 1);
      expect(pegLane(row, 0)).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('aimLaunch', () => {
  it('launches from the lane that was frozen at the tap', () => {
    [0, 3, 8].forEach(lane => {
      expect(buildPath(lane, makeRng(7)).launchLane).toBe(lane);
    });
  });

  it('clamps an out-of-range lane instead of crashing', () => {
    expect(buildPath(-4, makeRng(7)).launchLane).toBe(0);
    expect(buildPath(42, makeRng(7)).launchLane).toBe(LANES - 1);
  });
});

describe('targetProgress', () => {
  it('grows the target by a fixed step per level', () => {
    expect(targetForLevel(1)).toBe(1200);
    expect(targetForLevel(3)).toBe(1700);
    expect(targetForLevel(3) - targetForLevel(2)).toBe(250);
  });

  it('holds the loader at exactly 8000 ms', () => {
    expect(LOADER_DURATION_MS).toBe(8000);
  });
});

describe('slotScoring', () => {
  it('doubles the slot value when the prism is armed', () => {
    expect(slotScore(220, false)).toBe(220);
    expect(slotScore(220, true)).toBe(440);
    expect(slotScore(0, true)).toBe(0);
  });

  it('keeps the rim the richest tier', () => {
    expect(SLOT_TIERS[0]).toBe(Math.max(...SLOT_TIERS));
    expect(SLOT_TIERS[4]).toBe(Math.min(...SLOT_TIERS));
  });

  it('formats points without any currency marker', () => {
    expect(formatPoints(1750)).toBe('1,750');
    expect(formatPoints(0)).toBe('0');
  });
});

describe('pegLight', () => {
  it('counts a row bonus only once', () => {
    const lit: Record<string, boolean> = {};
    for (let i = 0; i < pegsInRow(0); i++) {
      lit['0:' + i] = true;
    }
    const counted: Record<number, boolean> = {};
    const first = completedRows(lit, counted, PEG_ROWS);
    expect(first).toEqual([0]);
    counted[0] = true;
    expect(completedRows(lit, counted, PEG_ROWS)).toEqual([]);
  });
});

describe('prismCharge', () => {
  it('caps the charge and arms only when full', () => {
    expect(addCharge(PRISM_CHARGE_MAX - 1, 5)).toBe(PRISM_CHARGE_MAX);
    expect(canArm(PRISM_CHARGE_MAX - 1, false)).toBe(false);
    expect(canArm(PRISM_CHARGE_MAX, false)).toBe(true);
    expect(canArm(PRISM_CHARGE_MAX, true)).toBe(false);
    expect(spendCharge()).toBe(0);
  });
});

describe('layoutGenerator', () => {
  it('produces a solvable, symmetric layout and varies between attempts', () => {
    const a = generateLayout(1, 1, targetForLevel(1));
    const b = generateLayout(1, 2, targetForLevel(1));
    expect(a.tiers).toHaveLength(LANES);
    expect(a.tiers[0]).toBe(a.tiers[LANES - 1]);
    expect(isSolvable(a.tiers, targetForLevel(1))).toBe(true);
    expect(a.seed === b.seed && a.rowShift.join() === b.rowShift.join()).toBe(false);
  });

  it('adds a void slot only from the configured level', () => {
    expect(generateLayout(1, 1, targetForLevel(1)).voidIndex).toBe(-1);
    expect(generateLayout(4, 1, targetForLevel(4)).voidIndex).toBeGreaterThanOrEqual(0);
  });

  it('exposes a fallback layout as a guarantee', () => {
    expect(FALLBACK_LAYOUT.tiers).toHaveLength(LANES);
  });
});

describe('roundFlow', () => {
  it('allows only the legal phase transitions', () => {
    expect(canTransition('idle', 'aiming')).toBe(true);
    expect(canTransition('falling', 'idle')).toBe(false);
    expect(canTransition('settling', 'roundOver')).toBe(true);
    expect(canTransition('roundOver', 'idle')).toBe(false);
  });

  it('ignores DROP while a ball is in flight or the screen is paused', () => {
    const state = createRound();
    expect(state.dropsLeft).toBe(DROPS_PER_ROUND);
    expect(canDrop(state, false)).toBe(true);
    expect(canDrop(state, true)).toBe(false);
    expect(canDrop({...state, phase: 'falling'}, false)).toBe(false);
    expect(canDrop({...state, dropsLeft: 0}, false)).toBe(false);
  });

  it('marks the round met only at or above the target', () => {
    const state = {...createRound(), score: 1200};
    expect(toResult(state, 1, 1200).met).toBe(true);
    expect(toResult({...state, score: 1199}, 1, 1200).met).toBe(false);
  });
});

describe('progressStore', () => {
  it('persists a patch and restores the defaults on reset', async () => {
    await resetProgress();
    await saveProgress({level: 4, best: 2400});
    const stored = await loadProgress();
    expect(stored.level).toBe(4);
    expect(stored.best).toBe(2400);
    await resetProgress();
    expect(await loadProgress()).toEqual(DEFAULT_PROGRESS);
  });
});

describe('settingsStore', () => {
  it('stores every option and resets them together', async () => {
    await resetSettings();
    await saveSettings({aimGuide: false, speed: 'FAST', motion: 'REDUCED'});
    const stored = await loadSettings();
    expect(stored.aimGuide).toBe(false);
    expect(stored.speed).toBe('FAST');
    expect(stored.motion).toBe('REDUCED');
    await resetSettings();
    expect(await loadSettings()).toEqual(DEFAULT_SETTINGS);
  });
});

describe('offlineConstraints', () => {
  it('exposes no bet, cash or network field in the balance config', () => {
    const config = require('../src/constants/config');
    const keys = Object.keys(config).join(' ').toLowerCase();
    ['bet', 'cash', 'coin', 'wager', 'rtp', 'payout'].forEach(word => {
      expect(keys.indexOf(word)).toBe(-1);
    });
    expect(SLOT_TIERS.every(tier => typeof tier === 'number')).toBe(true);
  });
});
