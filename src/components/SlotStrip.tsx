import React, {useEffect, useRef} from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import {assets} from '../assets';
import {BURST_SIZE, SLOT_H, SLOT_Y, TILE, laneX, tierColor} from '../constants/config';
import {theme} from '../constants/theme';
import {slotLabel} from '../game/layoutGenerator';

type Props = {
  tiers: number[];
  hitIndex: number;
  hitToken: number;
  guideIndex: number;
  showGuide: boolean;
};

export const SlotStrip: React.FC<Props> = ({
  tiers,
  hitIndex,
  hitToken,
  guideIndex,
  showGuide,
}) => {
  const burst = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (hitToken <= 0 || hitIndex < 0) {
      return;
    }
    burst.setValue(0);
    Animated.timing(burst, {
      toValue: 1,
      duration: 520,
      useNativeDriver: true,
    }).start();
  }, [burst, hitIndex, hitToken]);

  const burstScale = burst.interpolate({inputRange: [0, 1], outputRange: [0.6, 1.35]});
  const burstFade = burst.interpolate({inputRange: [0, 1], outputRange: [1, 0]});

  return (
    <View style={styles.wrap} pointerEvents="none">
      {tiers.map((tier, i) => {
        const color = tierColor(tier);
        const isHit = i === hitIndex;
        const isGuide = showGuide && i === guideIndex;
        return (
          <View
            key={'slot' + i}
            style={[
              styles.slot,
              {
                left: i * TILE,
                borderColor: color + (isHit ? 'FF' : '66'),
                backgroundColor: color + (isHit ? '55' : '1F'),
              },
              isGuide ? styles.guide : null,
            ]}>
            <Text style={[styles.value, {color}]} numberOfLines={1}>
              {slotLabel(tier)}
            </Text>
          </View>
        );
      })}
      {hitIndex >= 0 && hitToken > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.burst,
            {
              left: laneX(hitIndex) - BURST_SIZE / 2,
              opacity: burstFade,
              transform: [{scale: burstScale}],
            },
          ]}>
          <Image source={assets.burst} style={styles.burstImg} resizeMode="contain" />
        </Animated.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {position: 'absolute', left: 0, right: 0, top: SLOT_Y, height: SLOT_H},
  slot: {
    position: 'absolute',
    top: 0,
    width: TILE - 2,
    height: SLOT_H,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guide: {borderWidth: 2, borderColor: theme.colors.cyan},
  value: {fontSize: 13, fontWeight: '800', fontVariant: ['tabular-nums']},
  burst: {
    position: 'absolute',
    top: SLOT_H / 2 - BURST_SIZE / 2,
    width: BURST_SIZE,
    height: BURST_SIZE,
  },
  burstImg: {width: BURST_SIZE, height: BURST_SIZE},
});

export default SlotStrip;
