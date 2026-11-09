import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {assets} from '../assets';
import {theme} from '../constants/theme';
import {formatPoints} from '../game/scoring';
import type {RoundResult} from '../game/round';
import StatPill, {StatRow, StatSlot} from './StatPill';

type Props = {
  result: RoundResult;
};

export const ResultSummary: React.FC<Props> = ({result}) => {
  const [shown, setShown] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const steps = 24;
    let i = 0;
    setShown(0);
    timer.current = setInterval(() => {
      i += 1;
      setShown(Math.round((result.score * i) / steps));
      if (i >= steps && timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    }, 30);
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, [result.score]);

  const met = result.met;
  const accent = met ? theme.colors.mint : theme.colors.magenta;

  const pills: {label: string; value: string; color: string}[] = [];
  if (result.pegsLit > 0) {
    pills.push({
      label: 'PEGS LIT',
      value: String(result.pegsLit),
      color: theme.colors.cyan,
    });
  }
  if (result.bestSlot > 0) {
    pills.push({
      label: 'BEST SLOT',
      value: formatPoints(result.bestSlot),
      color: theme.colors.violet,
    });
  }
  if (result.prismsUsed > 0) {
    pills.push({
      label: 'PRISMS',
      value: String(result.prismsUsed),
      color: theme.colors.magenta,
    });
  }

  return (
    <View style={styles.card}>
      {met ? (
        <Image source={assets.shard} style={styles.shard} resizeMode="contain" />
      ) : null}

      <Text style={[styles.verdict, {color: accent}]} numberOfLines={1}>
        {met ? 'SPECTRUM LOCKED' : 'LIGHT RAN OUT'}
      </Text>

      <Text style={styles.score} numberOfLines={1}>
        {formatPoints(shown)}
      </Text>
      <Text style={styles.scoreCap}>PTS</Text>
      <Text style={styles.targetLine} numberOfLines={1}>
        {'TARGET ' + formatPoints(result.target)}
      </Text>

      {pills.length >= 2 ? (
        <View style={styles.pills}>
          <StatRow>
            {pills.map(pill => (
              <StatSlot key={pill.label}>
                <StatPill label={pill.label} value={pill.value} color={pill.color} />
              </StatSlot>
            ))}
          </StatRow>
        </View>
      ) : null}

      {met ? (
        <LinearGradient
          colors={[theme.colors.violet, theme.colors.cyan]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.badge}>
          <Text style={styles.badgeText} numberOfLines={1}>
            {'LEVEL ' + (result.level + 1) + ' UNLOCKED'}
          </Text>
        </LinearGradient>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: 'rgba(18,0,38,0.94)',
    borderRadius: theme.radius.xxl,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 22,
    alignItems: 'center',
    shadowColor: theme.colors.violet,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 12},
    elevation: 14,
  },
  shard: {width: 72, height: 72, marginBottom: 10},
  verdict: {fontSize: 26, fontWeight: '800', letterSpacing: 1.5, marginBottom: 6},
  score: {
    fontSize: 46,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  scoreCap: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
    color: theme.colors.textMuted,
    marginTop: -2,
  },
  targetLine: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: theme.colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  pills: {width: '100%', marginTop: 16},
  badge: {
    marginTop: 16,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: theme.colors.bg,
  },
});

export default ResultSummary;
