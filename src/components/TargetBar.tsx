import React from 'react';
import {StyleSheet, View, type DimensionValue} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../constants/theme';

type Props = {
  score: number;
  target: number;
};

export const TargetBar: React.FC<Props> = ({score, target}) => {
  const ratio = target > 0 ? Math.min(score / target, 1) : 0;
  const met = ratio >= 1;
  return (
    <View style={styles.track}>
      <View style={[styles.fillBox, {width: ((ratio * 100).toFixed(2) + '%') as DimensionValue}]}>
        <LinearGradient
          colors={met ? [theme.colors.mint, theme.colors.mint] : [theme.colors.violet, theme.colors.cyan]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.fill}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 6,
    backgroundColor: 'rgba(242,234,255,0.08)',
    overflow: 'hidden',
  },
  fillBox: {height: 6},
  fill: {flex: 1},
});

export default TargetBar;
