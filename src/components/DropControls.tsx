import React, {useCallback, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Sparkles} from 'lucide-react-native';
import {BAR_BOTTOM, BAR_H, DROPS_PER_ROUND} from '../constants/config';
import {theme} from '../constants/theme';

type Props = {
  dropsLeft: number;
  disabled: boolean;
  onDrop: () => void;
  children?: React.ReactNode;
};

const ICON = 24;

/** Floating glass bar (archetype G2) — it never covers the slot strip. */
export const DropControls: React.FC<Props> = ({dropsLeft, disabled, onDrop, children}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.95,
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
    <View style={styles.bar}>
      <View style={styles.left}>{children}</View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="DROP"
        disabled={disabled}
        onPress={onDrop}
        onPressIn={pressIn}
        onPressOut={pressOut}
        hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
        style={[styles.drop, disabled ? styles.dim : null]}>
        <Animated.View style={[styles.dropScaler, {transform: [{scale}]}]}>
          <LinearGradient
            colors={[theme.colors.violet, theme.colors.cyan]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.dropFill}>
            <View style={styles.row}>
              <Sparkles size={ICON} color={theme.colors.bg} strokeWidth={2.6} />
              <Text style={styles.dropLabel}>DROP</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </Pressable>

      <View style={styles.right}>
        <View style={styles.dots}>
          {Array.from({length: DROPS_PER_ROUND}).map((_, i) => (
            <View
              key={'dot' + i}
              style={[styles.dot, i < dropsLeft ? styles.dotOn : styles.dotOff]}
            />
          ))}
        </View>
        <Text style={styles.dropsText} numberOfLines={1}>
          {dropsLeft} LEFT
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: BAR_BOTTOM,
    height: BAR_H,
    borderRadius: theme.radius.xl,
    backgroundColor: 'rgba(18,0,38,0.90)',
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    shadowColor: theme.colors.violet,
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 10},
    elevation: 12,
  },
  left: {width: 92, alignItems: 'flex-start'},
  right: {width: 92, alignItems: 'flex-end'},
  drop: {
    width: 132,
    height: 60,
    borderRadius: theme.radius.lg,
    shadowColor: theme.colors.cyan,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 6},
    elevation: 10,
  },
  dim: {opacity: 0.4},
  dropScaler: {width: '100%', height: '100%', borderRadius: theme.radius.lg},
  dropFill: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10},
  dropLabel: {
    fontSize: 18,
    lineHeight: ICON,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.bg,
  },
  dots: {flexDirection: 'row', gap: 4, marginBottom: 6},
  dot: {width: 10, height: 10, borderRadius: 5},
  dotOn: {backgroundColor: theme.colors.cyan},
  dotOff: {backgroundColor: 'rgba(242,234,255,0.22)'},
  dropsText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
});

export default DropControls;
