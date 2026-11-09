import React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {
  BOARD_BORDER,
  BOARD_H,
  BOARD_PAD,
  BOARD_W,
  CONTENT_H,
  CONTENT_W,
} from '../constants/config';
import {theme} from '../constants/theme';
import type {BoardLayout} from '../game/layoutGenerator';
import BallSprite from './BallSprite';
import LauncherRail from './LauncherRail';
import PegLayer from './PegLayer';
import SlotStrip from './SlotStrip';

type Props = {
  layout: BoardLayout;
  lit: Record<string, boolean>;
  flash: {row: number; index: number} | null;
  sweep: Animated.Value;
  ballX: Animated.Value;
  ballY: Animated.Value;
  ballVisible: boolean;
  armed: boolean;
  frozenLane: number | null;
  guideLane: number;
  showGuide: boolean;
  hitIndex: number;
  hitToken: number;
};

/** Pure rendering — the board owns no game rule. */
export const PlinkoBoard: React.FC<Props> = ({
  layout,
  lit,
  flash,
  sweep,
  ballX,
  ballY,
  ballVisible,
  armed,
  frozenLane,
  guideLane,
  showGuide,
  hitIndex,
  hitToken,
}) => (
  <View style={styles.frame}>
    <View style={styles.inner}>
      <View style={styles.glow} pointerEvents="none" />
      <LauncherRail sweep={sweep} frozenLane={frozenLane} showGuide={showGuide} />
      <PegLayer lit={lit} rowShift={layout.rowShift} flash={flash} />
      <SlotStrip
        tiers={layout.tiers}
        hitIndex={hitIndex}
        hitToken={hitToken}
        guideIndex={guideLane}
        showGuide={showGuide}
      />
      <BallSprite x={ballX} y={ballY} armed={armed} visible={ballVisible} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  frame: {
    width: BOARD_W,
    height: BOARD_H,
    padding: BOARD_PAD,
    borderWidth: BOARD_BORDER,
    borderColor: 'rgba(139,0,255,0.35)',
    borderRadius: theme.radius.xl,
    backgroundColor: 'rgba(18,0,38,0.72)',
    shadowColor: theme.colors.violet,
    shadowOpacity: 0.5,
    shadowRadius: 22,
    shadowOffset: {width: 0, height: 10},
    elevation: 10,
    overflow: 'hidden',
  },
  inner: {width: CONTENT_W, height: CONTENT_H},
  glow: {
    position: 'absolute',
    left: CONTENT_W * 0.1,
    top: CONTENT_H * 0.2,
    width: CONTENT_W * 0.8,
    height: CONTENT_W * 0.8,
    borderRadius: CONTENT_W * 0.4,
    backgroundColor: 'rgba(0,212,255,0.08)',
  },
});

export default PlinkoBoard;
