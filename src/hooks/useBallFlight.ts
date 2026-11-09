import {useCallback, useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';
import {
  BALL_END_Y,
  BALL_START_Y,
  LAUNCH_MS,
  ROW_H,
  TOP_GAP,
  laneX,
} from '../constants/config';
import type {DropPath} from '../game/path';

/**
 * Chained row steps on translateX / translateY only — native driver all the
 * way. Every completion callback resets the busy ref, so a cancelled flight
 * can never leave DROP disabled.
 */
export const useBallFlight = (rowStepMs: number) => {
  const x = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(BALL_START_Y)).current;
  const busy = useRef(false);
  const current = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(
    () => () => {
      if (current.current) {
        current.current.stop();
        current.current = null;
      }
      busy.current = false;
    },
    [],
  );

  const run = useCallback(
    (path: DropPath, onRow: (step: number) => void, onDone: () => void) => {
      if (busy.current) {
        return;
      }
      busy.current = true;

      x.setValue(laneX(path.launchLane));
      y.setValue(BALL_START_Y);

      const legs: Animated.CompositeAnimation[] = [
        Animated.timing(y, {
          toValue: TOP_GAP,
          duration: LAUNCH_MS,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ];

      path.steps.forEach((step, index) => {
        const targetY =
          index === path.steps.length - 1 ? BALL_END_Y : TOP_GAP + (step.row + 1) * ROW_H;
        legs.push(
          Animated.parallel([
            Animated.timing(x, {
              toValue: laneX(step.lane),
              duration: rowStepMs,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(y, {
              toValue: targetY,
              duration: rowStepMs,
              easing: index < 2 ? Easing.in(Easing.quad) : Easing.linear,
              useNativeDriver: true,
            }),
          ]),
        );
      });

      let leg = 0;
      const step = () => {
        if (leg >= legs.length) {
          busy.current = false;
          current.current = null;
          onDone();
          return;
        }
        const animation = legs[leg];
        current.current = animation;
        // The ball rests on row (leg - 1)'s peg as this leg begins.
        if (leg >= 1) {
          onRow(leg - 1);
        }
        animation.start(({finished}) => {
          if (!finished) {
            busy.current = false;
            current.current = null;
            return;
          }
          leg++;
          step();
        });
      };
      step();
    },
    [rowStepMs, x, y],
  );

  const cancel = useCallback(() => {
    if (current.current) {
      current.current.stop();
      current.current = null;
    }
    busy.current = false;
  }, []);

  return {x, y, run, cancel, busy};
};
