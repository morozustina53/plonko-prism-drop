import React, {useCallback, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {theme} from '../constants/theme';

type Props = {
  label: string;
  hint: string;
  value: string;
  onPress: () => void;
  tone?: 'default' | 'danger';
};

export const ToggleRow: React.FC<Props> = ({label, hint, value, onPress, tone = 'default'}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const danger = tone === 'danger';
  const tint = danger ? theme.colors.magenta : theme.colors.cyan;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.98,
      tension: 300,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 300,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      style={[styles.press, {borderColor: tint + '3A'}]}>
      <Animated.View style={[styles.inner, {transform: [{scale}]}]}>
        <View style={styles.text}>
          <Text style={[styles.label, danger ? {color: theme.colors.magenta} : null]}>
            {label}
          </Text>
          <Text style={styles.hint} numberOfLines={1}>
            {hint}
          </Text>
        </View>
        <View style={[styles.badge, {borderColor: tint + '88', backgroundColor: tint + '1A'}]}>
          <Text style={[styles.value, {color: tint}]} numberOfLines={1}>
            {value}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 72,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    backgroundColor: theme.colors.glass,
    overflow: 'hidden',
  },
  inner: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  text: {flex: 1, paddingRight: 12},
  label: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: theme.colors.textPrimary,
  },
  hint: {fontSize: 12, fontWeight: '500', color: theme.colors.textMuted, marginTop: 3},
  badge: {
    minWidth: 86,
    height: 38,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  value: {fontSize: 13, fontWeight: '800', letterSpacing: 1.2},
});

export default ToggleRow;
