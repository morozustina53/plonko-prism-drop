import {Dimensions} from 'react-native';

/**
 * Every balance number of the design doc lives here.
 * Points only — no bet, no currency, no real money (product constraint).
 */

// Splash: EXACTLY 8000 ms. Shorter values race the QA screenshot window.
export const LOADER_DURATION_MS = 8000;

export const LANES = 9;
export const PEG_ROWS = 8;
export const DROPS_PER_ROUND = 5;

export const PEG_LIGHT_POINTS = 25;
export const ROW_BONUS_POINTS = 150;

export const PRISM_CHARGE_MAX = 16;
export const PRISM_MULTIPLIER = 2;

export const TARGET_BASE = 1200;
export const TARGET_STEP = 250;
export const VOID_SLOT_FROM_LEVEL = 3;

export const ROW_STEP_MS = {NORMAL: 230, FAST: 150};
export const SWEEP_MS = {NORMAL: 2400, FAST: 1700};
export const SETTLE_MS = 360;
export const LAUNCH_MS = 140;

export const targetForLevel = (level: number): number =>
  TARGET_BASE + TARGET_STEP * (Math.max(1, level) - 1);

// ── Board geometry (CODE RULES #4 / #5) ──────────────────────────────────────
// The parent's padding+border is excluded BEFORE the tile is floored, so the
// lattice can never stick out of the frame. Overflow is 0 by construction.
const WINDOW = Dimensions.get('window');
export const SCREEN_W = WINDOW.width;
export const SCREEN_H = WINDOW.height;

export const BOARD_PAD = 8;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 10
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const TILE = Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME) / LANES);
export const BOARD_W = TILE * LANES + 2 * BOARD_FRAME;
export const CONTENT_W = TILE * LANES;

export const RAIL_Y = 14;
export const CARRIAGE = 28;
export const TOP_GAP = 34;
export const BOTTOM_GAP = 14;

// Chrome above and below the board: header 116, score band 57, target bar 6,
// floating bar 92 + its 28 bottom offset + 28 of breathing room.
export const GAME_CHROME_H = 116 + 57 + 6 + 92 + 28 + 28;
const AREA_H = Math.max(180, SCREEN_H - GAME_CHROME_H);

export const SLOT_H = AREA_H < 300 ? 40 : 48;

const ROW_H_MAX = Math.floor(
  (AREA_H - 24 - 2 * BOARD_FRAME - TOP_GAP - BOTTOM_GAP - SLOT_H) / (PEG_ROWS - 1),
);
// The lattice grows with the free height instead of leaving the screen empty,
// and never past what the area can hold.
export const ROW_H = Math.max(18, Math.min(Math.round(TILE * 1.05), ROW_H_MAX));
export const PEG_SIZE = 12;
export const BALL_SIZE = Math.round(TILE * 0.45);
export const BURST_SIZE = Math.round(TILE * 1.6);

export const SLOT_Y = TOP_GAP + (PEG_ROWS - 1) * ROW_H + BOTTOM_GAP;
export const CONTENT_H = SLOT_Y + SLOT_H;
export const BOARD_H = CONTENT_H + 2 * BOARD_FRAME;

export const BALL_START_Y = RAIL_Y;
export const BALL_END_Y = SLOT_Y + Math.round(SLOT_H / 2);

// Lane 0..8 -> centre x inside the board content area.
export const laneX = (lane: number): number => lane * TILE + TILE / 2;

// Floating control bar (archetype G2) — never covers the slot strip.
export const BAR_H = 92;
export const BAR_BOTTOM = 28;
export const GAME_AREA_BOTTOM_PAD = BAR_H + BAR_BOTTOM + 28;

export const SLOT_TIERS = [500, 220, 120, 60, 25, 60, 120, 220, 500];

export const TIER_COLORS: Record<number, string> = {
  0: '#2A1140',
  25: '#6E6395',
  40: '#6E6395',
  60: '#19F6C8',
  80: '#19F6C8',
  120: '#00D4FF',
  150: '#00D4FF',
  220: '#8B00FF',
  260: '#8B00FF',
  420: '#FF2FB9',
  500: '#FF2FB9',
};

export const tierColor = (tier: number): string => TIER_COLORS[tier] || '#6E6395';
