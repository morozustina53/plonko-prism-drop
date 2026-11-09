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
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../constants/theme';

// lucide-react-native ships forwardRef components whose propTypes are wider
// than a literal prop map; ComponentType<any> keeps the call sites typed
// without fighting that variance.
export type IconComponent = React.ComponentType<any>;

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconComponent;
  disabled?: boolean;
  colors?: string[];
  style?: StyleProp<ViewStyle>;
};

const ICON = 24;

/**
 * Pressable is the PARENT (explicit width AND height), the Animated.View with
 * the press scale is the CHILD. The reverse arrangement eats onPress on
 * Android release builds.
 */
export const PrimaryButton: React.FC<Props> = ({
  label,
  onPress,
  Icon,
  disabled = false,
  colors,
  style,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

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
      disabled={disabled}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      style={[styles.press, disabled ? styles.disabled : null, style]}>
      <Animated.View style={[styles.scaler, {transform: [{scale}]}]}>
        <LinearGradient
          colors={colors || [theme.colors.violet, theme.colors.cyan]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.fill}>
          <View style={styles.row}>
            {Icon ? <Icon size={ICON} color={theme.colors.bg} strokeWidth={2.6} /> : null}
            <Text style={styles.label}>{label}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 64,
    borderRadius: theme.radius.lg,
    shadowColor: theme.colors.violet,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 8},
    elevation: 12,
  },
  disabled: {opacity: 0.4},
  scaler: {width: '100%', height: '100%', borderRadius: theme.radius.lg},
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10},
  label: {
    fontSize: 18,
    lineHeight: ICON,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.bg,
  },
});

export default PrimaryButton;
