import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Image, StyleSheet, View} from 'react-native';
import {assets} from '../assets';
import {PEG_ROWS, PEG_SIZE, ROW_H, TILE, TOP_GAP, laneX} from '../constants/config';
import {theme} from '../constants/theme';
import {pegKey, pegLane, pegsInRow} from '../game/path';

type Props = {
  lit: Record<string, boolean>;
  rowShift: number[];
  flash: {row: number; index: number} | null;
};

type PegSpot = {key: string; row: number; index: number; cx: number; cy: number};

export const PegLayer: React.FC<Props> = ({lit, rowShift, flash}) => {
  const ring = useRef(new Animated.Value(0)).current;

  const spots = useMemo<PegSpot[]>(() => {
    const out: PegSpot[] = [];
    for (let row = 0; row < PEG_ROWS; row++) {
      const shift = rowShift[row] || 0;
      for (let index = 0; index < pegsInRow(row); index++) {
        out.push({
          key: pegKey(row, index),
          row,
          index,
          cx: laneX(pegLane(row, index)) + shift,
          cy: TOP_GAP + row * ROW_H,
        });
      }
    }
    return out;
  }, [rowShift]);

  useEffect(() => {
    if (!flash) {
      return;
    }
    ring.setValue(0);
    Animated.timing(ring, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [flash, ring]);

  const flashSpot = flash
    ? spots.find(s => s.row === flash.row && s.index === flash.index)
    : undefined;

  const ringScale = ring.interpolate({inputRange: [0, 1], outputRange: [0.6, 1.9]});
  const ringFade = ring.interpolate({inputRange: [0, 1], outputRange: [0.9, 0]});

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {spots.map(spot => {
        const on = !!lit[spot.key];
        return (
          <View
            key={spot.key}
            style={[
              styles.peg,
              {left: spot.cx - PEG_SIZE / 2, top: spot.cy - PEG_SIZE / 2},
              on ? styles.pegLit : null,
            ]}>
            <Image
              source={assets.peg}
              style={[styles.sprite, {opacity: on ? 1 : 0.42}]}
              resizeMode="contain"
            />
          </View>
        );
      })}
      {flashSpot ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.ring,
            {
              left: flashSpot.cx - TILE / 2,
              top: flashSpot.cy - TILE / 2,
              width: TILE,
              height: TILE,
              borderRadius: TILE / 2,
              opacity: ringFade,
              transform: [{scale: ringScale}],
            },
          ]}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  peg: {position: 'absolute', width: PEG_SIZE, height: PEG_SIZE},
  pegLit: {
    shadowColor: theme.colors.cyan,
    shadowOpacity: 0.9,
    shadowRadius: 7,
    shadowOffset: {width: 0, height: 0},
    elevation: 6,
  },
  sprite: {width: PEG_SIZE, height: PEG_SIZE},
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: theme.colors.cyan,
  },
});

export default PegLayer;
