import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Easing, ImageBackground, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Circle} from 'react-native-svg';
import {assets} from '../assets';
import {theme} from '../constants/theme';
import {SCREEN_H, SCREEN_W} from '../constants/config';

export type BackdropVariant = 'loader' | 'menu' | 'game' | 'result' | 'sheet';

type Props = {
  variant: BackdropVariant;
  motion?: 'FULL' | 'REDUCED';
};

const VEILS: Record<BackdropVariant, string[]> = {
  // The loader is the darkest screen of the app by design (rule #14).
  loader: ['rgba(5,0,16,0.93)', 'rgba(10,0,20,0.95)', 'rgba(18,0,43,0.92)'],
  menu: ['rgba(10,0,20,0.18)', 'rgba(10,0,20,0.72)', 'rgba(10,0,20,0.96)'],
  game: ['rgba(10,0,20,0.80)', 'rgba(5,0,16,0.90)', 'rgba(10,0,20,0.94)'],
  result: ['rgba(5,0,16,0.78)', 'rgba(10,0,20,0.90)', 'rgba(5,0,16,0.94)'],
  sheet: ['rgba(10,0,20,0.84)', 'rgba(5,0,16,0.92)', 'rgba(10,0,20,0.94)'],
};

const BLOBS: Record<BackdropVariant, {color: string; size: number; x: number; y: number}[]> = {
  loader: [
    {color: 'rgba(139,0,255,0.26)', size: 300, x: -70, y: 120},
    {color: 'rgba(0,212,255,0.14)', size: 240, x: SCREEN_W - 150, y: SCREEN_H * 0.62},
  ],
  menu: [
    {color: 'rgba(139,0,255,0.32)', size: 340, x: -90, y: 60},
    {color: 'rgba(0,212,255,0.26)', size: 280, x: SCREEN_W - 160, y: 220},
    {color: 'rgba(255,47,185,0.18)', size: 240, x: SCREEN_W * 0.3, y: SCREEN_H * 0.68},
  ],
  game: [
    {color: 'rgba(139,0,255,0.22)', size: 320, x: -110, y: SCREEN_H * 0.28},
    {color: 'rgba(0,212,255,0.18)', size: 260, x: SCREEN_W - 140, y: SCREEN_H * 0.6},
  ],
  result: [
    {color: 'rgba(0,212,255,0.26)', size: 320, x: SCREEN_W * 0.2, y: SCREEN_H * 0.22},
    {color: 'rgba(255,47,185,0.18)', size: 260, x: -80, y: SCREEN_H * 0.62},
  ],
  sheet: [
    {color: 'rgba(139,0,255,0.24)', size: 300, x: SCREEN_W - 170, y: 100},
    {color: 'rgba(0,212,255,0.16)', size: 260, x: -90, y: SCREEN_H * 0.6},
  ],
};

const MOTES = [
  {cx: 0.12, cy: 0.18, r: 2.5, o: 0.22},
  {cx: 0.31, cy: 0.42, r: 1.8, o: 0.16},
  {cx: 0.52, cy: 0.12, r: 2.2, o: 0.2},
  {cx: 0.68, cy: 0.36, r: 1.6, o: 0.14},
  {cx: 0.81, cy: 0.22, r: 2.6, o: 0.24},
  {cx: 0.22, cy: 0.66, r: 2.0, o: 0.18},
  {cx: 0.46, cy: 0.78, r: 1.7, o: 0.13},
  {cx: 0.74, cy: 0.7, r: 2.3, o: 0.2},
  {cx: 0.9, cy: 0.52, r: 1.5, o: 0.12},
  {cx: 0.06, cy: 0.86, r: 2.1, o: 0.17},
];

export const AuroraBackdrop: React.FC<Props> = ({variant, motion = 'FULL'}) => {
  const drift = useRef(new Animated.Value(0)).current;
  const reduced = motion === 'REDUCED';
  const blobs = useMemo(() => BLOBS[variant], [variant]);
  const showMotes = variant === 'loader' || variant === 'menu';

  useEffect(() => {
    if (reduced) {
      drift.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 5200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 5200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [drift, reduced]);

  const shiftA = drift.interpolate({inputRange: [0, 1], outputRange: [-10, 10]});
  const shiftB = drift.interpolate({inputRange: [0, 1], outputRange: [12, -12]});

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <ImageBackground
        source={assets.bgGame}
        style={StyleSheet.absoluteFill}
        resizeMode="cover">
        <LinearGradient
          colors={VEILS[variant]}
          start={{x: 0.1, y: 0}}
          end={{x: 0.9, y: 1}}
          style={StyleSheet.absoluteFill}
        />
        {blobs.map((blob, i) => (
          <Animated.View
            key={'blob' + i}
            pointerEvents="none"
            style={[
              styles.blob,
              {
                width: blob.size,
                height: blob.size,
                borderRadius: blob.size / 2,
                backgroundColor: blob.color,
                left: blob.x,
                top: blob.y,
                transform: [{translateY: i % 2 === 0 ? shiftA : shiftB}],
              },
            ]}
          />
        ))}
        {showMotes ? (
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, {transform: [{translateY: shiftB}]}]}>
            <Svg width={SCREEN_W} height={SCREEN_H}>
              {MOTES.map((m, i) => (
                <Circle
                  key={'mote' + i}
                  cx={m.cx * SCREEN_W}
                  cy={m.cy * SCREEN_H}
                  r={m.r}
                  fill={i % 3 === 0 ? theme.colors.cyan : theme.colors.textPrimary}
                  opacity={m.o}
                />
              ))}
            </Svg>
          </Animated.View>
        ) : null}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  blob: {position: 'absolute'},
});

export default AuroraBackdrop;
