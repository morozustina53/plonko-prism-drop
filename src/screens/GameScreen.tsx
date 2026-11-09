import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {assets} from '../assets';
import AuroraBackdrop from '../components/AuroraBackdrop';
import ChargeMeter from '../components/ChargeMeter';
import DropControls from '../components/DropControls';
import HintBanner from '../components/HintBanner';
import PlinkoBoard from '../components/PlinkoBoard';
import ScreenHeader from '../components/ScreenHeader';
import TargetBar from '../components/TargetBar';
import {
  BAR_BOTTOM,
  BAR_H,
  GAME_AREA_BOTTOM_PAD,
  ROW_STEP_MS,
  SETTLE_MS,
  SWEEP_MS,
} from '../constants/config';
import {theme} from '../constants/theme';
import {makeRng} from '../game/rng';
import {buildPath} from '../game/path';
import {formatPoints} from '../game/scoring';
import {canDrop, toResult, type RoundResult} from '../game/round';
import {useBallFlight} from '../hooks/useBallFlight';
import {useOscillator} from '../hooks/useOscillator';
import {useRound} from '../hooks/useRound';
import type {Motion, Speed} from '../state/settingsStore';

type Props = {
  level: number;
  attempt: number;
  aimGuide: boolean;
  speed: Speed;
  motion: Motion;
  onMenu: () => void;
  onGameOver: (result: RoundResult) => void;
};

const HINT_TEXT = 'TAP DROP WHEN THE PRISM SITS OVER YOUR LANE';

export const GameScreen: React.FC<Props> = ({
  level,
  attempt,
  aimGuide,
  speed,
  motion,
  onMenu,
  onGameOver,
}) => {
  const round = useRound(level, attempt);
  const [paused, setPaused] = useState(false);
  const [frozenLane, setFrozenLane] = useState<number | null>(null);
  const [flash, setFlash] = useState<{row: number; index: number} | null>(null);
  const [hitIndex, setHitIndex] = useState(-1);
  const [hitToken, setHitToken] = useState(0);
  const [bonusText, setBonusText] = useState('');
  const [ballVisible, setBallVisible] = useState(false);
  const [guideLane, setGuideLane] = useState(4);

  const sweepMs = SWEEP_MS[speed];
  const rowStepMs = ROW_STEP_MS[speed];

  const phase = round.state.phase;
  const falling = phase === 'falling' || phase === 'settling';
  const oscillator = useOscillator(sweepMs, !paused && !falling && phase !== 'roundOver');
  const flight = useBallFlight(rowStepMs);

  const scorePulse = useRef(new Animated.Value(1)).current;
  const dropIdRef = useRef(0);
  const finishedRef = useRef(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bonusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const guideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep the aim guide on the lane the carriage is actually over.
  useEffect(() => {
    if (paused || falling) {
      return;
    }
    const id = setInterval(() => {
      setGuideLane(oscillator.laneRef.current);
    }, 90);
    guideTimer.current = id;
    return () => {
      clearInterval(id);
      guideTimer.current = null;
    };
  }, [falling, oscillator.laneRef, paused]);

  useEffect(
    () => () => {
      if (settleTimer.current) {
        clearTimeout(settleTimer.current);
      }
      if (bonusTimer.current) {
        clearTimeout(bonusTimer.current);
      }
    },
    [],
  );

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scorePulse, {
        toValue: 1.12,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.timing(scorePulse, {
        toValue: 1,
        duration: 110,
        useNativeDriver: true,
      }),
    ]).start();
  }, [round.state.score, scorePulse]);

  // Round over: hand the record to App exactly once.
  useEffect(() => {
    if (phase !== 'roundOver' || finishedRef.current) {
      return;
    }
    finishedRef.current = true;
    onGameOver(toResult(round.state, level, round.target, round.layout));
  }, [level, onGameOver, phase, round.layout, round.state, round.target]);

  const handleDrop = useCallback(() => {
    if (!canDrop(round.state, paused)) {
      return;
    }
    const lane = oscillator.laneRef.current;
    setFrozenLane(lane);
    setGuideLane(lane);
    setBallVisible(true);
    setHitIndex(-1);
    setBonusText('');

    dropIdRef.current += 1;
    const rng = makeRng(round.layout.seed + dropIdRef.current * 7919);
    const path = buildPath(lane, rng);
    const dropsAfter = round.state.dropsLeft - 1;

    round.beginDrop();

    flight.run(
      path,
      step => {
        const peg = path.steps[step];
        if (!peg) {
          return;
        }
        round.lightPeg(peg.row, peg.pegIndex);
        setFlash({row: peg.row, index: peg.pegIndex});
      },
      () => {
        setHitIndex(path.slot);
        setHitToken(t => t + 1);
        round.setPhase('settling');
        const outcome = round.settle(path.slot);
        if (outcome.bonusText) {
          setBonusText(outcome.bonusText);
          bonusTimer.current = setTimeout(() => setBonusText(''), 1200);
        }
        settleTimer.current = setTimeout(() => {
          setBallVisible(false);
          setFrozenLane(null);
          setFlash(null);
          round.setPhase(dropsAfter <= 0 ? 'roundOver' : 'idle');
        }, SETTLE_MS);
      },
    );
  }, [flight, oscillator.laneRef, paused, round]);

  const togglePause = useCallback(() => {
    setPaused(p => !p);
  }, []);

  const dropDisabled = !canDrop(round.state, paused);
  const showHint = phase === 'idle' && round.state.dropsLeft >= 4;

  return (
    <View style={styles.root}>
      <AuroraBackdrop variant="game" motion={motion} />

      <ScreenHeader
        title={'TARGET ' + formatPoints(round.target)}
        kicker={'LEVEL ' + level}
        leftSlot={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="MENU"
            onPress={onMenu}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            style={styles.navPill}>
            <View style={styles.navRow}>
              <Image source={assets.iconHome} style={styles.navIcon} resizeMode="contain" />
              <Text style={styles.navLabel}>MENU</Text>
            </View>
          </Pressable>
        }
        rightSlot={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={paused ? 'RESUME' : 'PAUSE'}
            onPress={togglePause}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            style={styles.navPill}>
            <View style={styles.navRow}>
              <Image source={assets.iconPause} style={styles.navIcon} resizeMode="contain" />
              <Text style={styles.navLabel}>{paused ? 'RESUME' : 'PAUSE'}</Text>
            </View>
          </Pressable>
        }
      />

      <View style={styles.scoreRow}>
        <Animated.View pointerEvents="none" style={{transform: [{scale: scorePulse}]}}>
          <Text style={styles.score} numberOfLines={1}>
            {formatPoints(round.state.score)}
          </Text>
        </Animated.View>
        <Text style={styles.scoreCap} numberOfLines={1}>
          {bonusText ? bonusText : paused ? 'PAUSED' : 'POINTS'}
        </Text>
      </View>

      <TargetBar score={round.state.score} target={round.target} />

      <View style={styles.area}>
        <PlinkoBoard
          layout={round.layout}
          lit={round.lit}
          flash={flash}
          sweep={oscillator.value}
          ballX={flight.x}
          ballY={flight.y}
          ballVisible={ballVisible}
          armed={round.state.armed}
          frozenLane={frozenLane}
          guideLane={frozenLane === null ? guideLane : frozenLane}
          showGuide={aimGuide}
          hitIndex={hitIndex}
          hitToken={hitToken}
        />
      </View>

      <View style={styles.hintWrap} pointerEvents="none">
        <HintBanner text={HINT_TEXT} visible={showHint} />
      </View>

      <DropControls
        dropsLeft={round.state.dropsLeft}
        disabled={dropDisabled}
        onDrop={handleDrop}>
        <ChargeMeter charge={round.state.charge} armed={round.state.armed} onArm={round.arm} />
      </DropControls>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.colors.bg},
  navPill: {
    width: 86,
    height: 48,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.glass,
    borderWidth: 1,
    borderColor: theme.colors.glassStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10},
  navIcon: {width: 24, height: 24},
  navLabel: {
    fontSize: 12,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textPrimary,
  },
  scoreRow: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  score: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.cyan,
    fontVariant: ['tabular-nums'],
  },
  scoreCap: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.textSecondary,
  },
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: GAME_AREA_BOTTOM_PAD,
  },
  hintWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: BAR_BOTTOM + BAR_H + 12,
    alignItems: 'center',
  },
});

export default GameScreen;
