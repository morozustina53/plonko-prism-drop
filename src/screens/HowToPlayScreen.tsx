import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Home} from 'lucide-react-native';
import {assets} from '../assets';
import AuroraBackdrop from '../components/AuroraBackdrop';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StepCard from '../components/StepCard';
import {PEG_LIGHT_POINTS, ROW_BONUS_POINTS, tierColor} from '../constants/config';
import {theme} from '../constants/theme';
import type {Motion} from '../state/settingsStore';

type Props = {
  motion: Motion;
  onMenu: () => void;
};

const STEPS = [
  {
    title: 'AIM',
    body: 'The prism carriage slides across the top. Tap DROP and the orb launches from that lane.',
    color: theme.colors.cyan,
  },
  {
    title: 'BRANCH',
    body: 'Every peg sends the orb half a lane left or right. Rim slots pay most and are hardest to reach.',
    color: theme.colors.violet,
  },
  {
    title: 'LIGHT',
    body:
      'A peg lights the first time it is touched: +' +
      PEG_LIGHT_POINTS +
      ' and +1 charge. A fully lit row pays +' +
      ROW_BONUS_POINTS +
      '.',
    color: theme.colors.mint,
  },
  {
    title: 'PRISM',
    body: 'A full charge arms PRISM DROP: the slot value doubles for that launch.',
    color: theme.colors.magenta,
  },
];

const TIER_CHIPS = [500, 220, 120, 60, 25, 0];

export const HowToPlayScreen: React.FC<Props> = ({motion, onMenu}) => (
  <View style={styles.root}>
    <AuroraBackdrop variant="sheet" motion={motion} />

    <ScreenHeader
      title="HOW TO PLAY"
      kicker="PRISM DROP"
      leftSlot={<SecondaryButton label="MENU" Icon={Home} onPress={onMenu} />}
    />

    <View style={styles.body}>
      <View style={styles.steps}>
        {STEPS.map((step, i) => (
          <StepCard
            key={step.title}
            index={i + 1}
            title={step.title}
            body={step.body}
            color={step.color}
          />
        ))}
      </View>

      <View style={styles.payout}>
        <View style={styles.payoutHead}>
          <Image source={assets.shard} style={styles.shard} resizeMode="contain" />
          <Text style={styles.payoutTitle}>SLOT VALUES</Text>
        </View>
        <View style={styles.chips}>
          {TIER_CHIPS.map(tier => {
            const color = tierColor(tier);
            return (
              <View
                key={'tier' + tier}
                style={[
                  styles.chip,
                  {borderColor: color + '88', backgroundColor: color + '1F'},
                ]}>
                <Text style={[styles.chipText, {color}]} numberOfLines={1}>
                  {tier > 0 ? String(tier) : 'VOID'}
                </Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.note}>Points only · no bet, no currency, no real money</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.colors.bg},
  body: {flex: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28},
  steps: {flex: 1, justifyContent: 'center', gap: 10},
  payout: {
    marginTop: 14,
    backgroundColor: theme.colors.glass,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    borderRadius: theme.radius.xl,
    padding: 14,
  },
  payoutHead: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10},
  shard: {width: 24, height: 24},
  payoutTitle: {
    fontSize: 13,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.textPrimary,
  },
  chips: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chip: {
    minWidth: 54,
    height: 34,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  chipText: {fontSize: 13, fontWeight: '800', fontVariant: ['tabular-nums']},
  note: {
    marginTop: 12,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    color: theme.colors.textMuted,
  },
});

export default HowToPlayScreen;
