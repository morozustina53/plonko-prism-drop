import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {assets} from '../assets';
import {PRISM_CHARGE_MAX} from '../constants/config';
import {theme} from '../constants/theme';
import {chargeSegments} from '../game/charge';

type Props = {
  charge: number;
  armed: boolean;
  onArm: () => void;
};

const SEGMENTS = 8;

export const ChargeMeter: React.FC<Props> = ({charge, armed, onArm}) => {
  const full = charge >= PRISM_CHARGE_MAX;
  const filled = chargeSegments(charge, SEGMENTS);
  const enabled = full && !armed;
  const tint = armed ? theme.colors.magenta : full ? theme.colors.cyan : theme.colors.textMuted;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Arm prism drop"
      disabled={!enabled}
      onPress={onArm}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      style={[
        styles.chip,
        {borderColor: tint + '88', backgroundColor: tint + '1A'},
        enabled || armed ? null : styles.dim,
      ]}>
      <Image source={assets.plateRound} style={styles.plate} resizeMode="contain" />
      <View style={styles.bar}>
        {Array.from({length: SEGMENTS}).map((_, i) => (
          <View
            key={'seg' + i}
            style={[
              styles.seg,
              {backgroundColor: i < filled ? tint : 'rgba(242,234,255,0.12)'},
            ]}
          />
        ))}
      </View>
      <Text style={[styles.label, {color: tint}]} numberOfLines={1}>
        {armed ? 'ARMED' : 'PRISM'}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    width: 88,
    height: 60,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dim: {opacity: 0.45},
  plate: {position: 'absolute', width: 56, height: 56, opacity: 0.22},
  bar: {flexDirection: 'row', gap: 3, marginBottom: 6},
  seg: {width: 7, height: 7, borderRadius: 2},
  label: {fontSize: 11, fontWeight: '800', letterSpacing: 1.5},
});

export default ChargeMeter;
