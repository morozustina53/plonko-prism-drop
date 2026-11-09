import React from 'react';
import {Animated, Image, StyleSheet} from 'react-native';
import {assets} from '../assets';
import {BALL_SIZE} from '../constants/config';
import {theme} from '../constants/theme';

type Props = {
  x: Animated.Value;
  y: Animated.Value;
  armed: boolean;
  visible: boolean;
};

export const BallSprite: React.FC<Props> = ({x, y, armed, visible}) => {
  if (!visible) {
    return null;
  }
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.ball,
        armed ? styles.armed : styles.plain,
        {transform: [{translateX: x}, {translateY: y}]},
      ]}>
      <Image
        source={armed ? assets.prism : assets.orb}
        style={styles.sprite}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  ball: {
    position: 'absolute',
    left: -BALL_SIZE / 2,
    top: -BALL_SIZE / 2,
    width: BALL_SIZE,
    height: BALL_SIZE,
  },
  sprite: {width: BALL_SIZE, height: BALL_SIZE},
  plain: {
    shadowColor: theme.colors.cyan,
    shadowOpacity: 0.95,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 0},
    elevation: 10,
  },
  armed: {
    shadowColor: theme.colors.magenta,
    shadowOpacity: 0.95,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 0},
    elevation: 12,
  },
});

export default BallSprite;
