import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from '../constants/theme';

type Props = {
  label: string;
  value: string;
  color: string;
};

/**
 * The ONE stat card of the app — identical on Menu and on Result.
 * No raster icon inside: an 8 px accent dot carries the semantics, so every
 * pill in a row has exactly the same geometry. A pill with nothing to show
 * is never rendered (the caller returns null instead).
 */
export const StatPill: React.FC<Props> = ({label, value, color}) => (
  <View style={[styles.card, {borderColor: color + '55', backgroundColor: color + '14'}]}>
    <View style={[styles.dot, {backgroundColor: color}]} />
    <Text style={[styles.value, {color}]} numberOfLines={1}>
      {value}
    </Text>
    <Text style={styles.label} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

export const StatRow: React.FC<{children: React.ReactNode}> = ({children}) => (
  <View style={styles.row}>{children}</View>
);

export const StatSlot: React.FC<{children: React.ReactNode}> = ({children}) => (
  <View style={styles.slot}>{children}</View>
);

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'stretch', gap: 10},
  // flex:1 lives on the SLOT only. The card uses width:'100%' so it keeps its
  // intrinsic content height instead of collapsing (circular flex bug).
  slot: {flex: 1},
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {width: 8, height: 8, borderRadius: 4, marginBottom: 8},
  value: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: theme.colors.textSecondary,
  },
});

export default StatPill;
