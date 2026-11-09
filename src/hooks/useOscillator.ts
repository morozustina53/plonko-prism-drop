import {useCallback, useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';
import {LANES} from '../constants/config';

/**
 * The prism carriage sweeping the lanes. The animated value drives the view
 * with the native driver; a listener keeps `laneRef` in sync so the lane the
 * player sees is exactly the lane the tap freezes (animation callbacks read
 * refs, never stale state).
 */
export const useOscillator = (sweepMs: number, running: boolean) => {
  const value = useRef(new Animated.Value(0)).current;
  const laneRef = useRef(Math.floor(LANES / 2));
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const id = value.addListener(({value: v}) => {
      laneRef.current = Math.max(0, Math.min(LANES - 1, Math.round(v * (LANES - 1))));
    });
    return () => {
      value.removeListener(id);
    };
  }, [value]);

  useEffect(() => {
    if (!running) {
      if (loopRef.current) {
        loopRef.current.stop();
        loopRef.current = null;
      }
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: sweepMs,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: sweepMs,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loopRef.current = loop;
    loop.start();
    return () => {
      loop.stop();
      loopRef.current = null;
    };
  }, [running, sweepMs, value]);

  const freeze = useCallback(() => laneRef.current, []);

  return {value, laneRef, freeze};
};
