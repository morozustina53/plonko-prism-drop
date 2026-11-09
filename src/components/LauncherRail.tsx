import React from 'react';
import {Animated, Image, StyleSheet, View} from 'react-native';
import {assets} from '../assets';
import {
  CARRIAGE,
  CONTENT_W,
  LANES,
  RAIL_Y,
  SLOT_Y,
  TILE,
  TOP_GAP,
  laneX,
} from '../constants/config';
import {theme} from '../constants/theme';

type Props = {
  sweep: Animated.Value;
  frozenLane: number | null;
  showGuide: boolean;
};

const SPAN = (LANES - 1) * TILE;

export const LauncherRail: React.FC<Props> = ({sweep, frozenLane, showGuide}) => {
  const slide = sweep.interpolate({inputRange: [0, 1], outputRange: [0, SPAN]});
  const guideX = frozenLane === null ? null : laneX(frozenLane);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.rail} />
      {showGuide && guideX !== null ? (
        <View style={[styles.guide, {left: guideX - 0.5}]} />
      ) : null}
      <Animated.View
        pointerEvents="none"
        style={[styles.carriage, {transform: [{translateX: slide}]}]}>
        <Image source={assets.prism} style={styles.sprite} resizeMode="contain" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  rail: {
    position: 'absolute',
    left: TILE / 2,
    width: SPAN,
    top: RAIL_Y,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(242,234,255,0.14)',
  },
  guide: {
    position: 'absolute',
    top: TOP_GAP - 10,
    height: SLOT_Y - TOP_GAP + 10,
    width: 1,
    backgroundColor: 'rgba(0,212,255,0.35)',
  },
  carriage: {
    position: 'absolute',
    left: TILE / 2 - CARRIAGE / 2,
    top: RAIL_Y - CARRIAGE / 2,
    width: CARRIAGE,
    height: CARRIAGE,
    shadowColor: theme.colors.violet,
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 0},
    elevation: 10,
  },
  sprite: {width: CARRIAGE, height: CARRIAGE},
  spacer: {width: CONTENT_W},
});

export default LauncherRail;
