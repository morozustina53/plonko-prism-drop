import React, {useCallback, useRef} from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {theme} from '../constants/theme';
import type {IconComponent} from './PrimaryButton';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconComponent;
  tone?: 'default' | 'danger';
  style?: StyleProp<ViewStyle>;
};

const ICON = 24;

export const SecondaryButton: React.FC<Props> = ({
  label,
  onPress,
  Icon,
  tone = 'default',
  style,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const tint = tone === 'danger' ? theme.colors.magenta : theme.colors.textPrimary;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
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
      style={[styles.press, style]}>
      <Animated.View style={[styles.scaler, {transform: [{scale}]}]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON} color={tint} strokeWidth={2.4} /> : null}
          <Text style={[styles.label, {color: tint}]}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.glass,
    borderWidth: 1,
    borderColor: theme.colors.glassStrong,
    overflow: 'hidden',
  },
  scaler: {width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'},
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10},
  label: {fontSize: 14, lineHeight: ICON, fontWeight: '700', letterSpacing: 1.5},
});

export default SecondaryButton;
