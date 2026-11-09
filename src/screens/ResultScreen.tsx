import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {HelpCircle, Home, RotateCcw} from 'lucide-react-native';
import AuroraBackdrop from '../components/AuroraBackdrop';
import PrimaryButton from '../components/PrimaryButton';
import ResultSummary from '../components/ResultSummary';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import {theme} from '../constants/theme';
import type {RoundResult} from '../game/round';
import type {Motion} from '../state/settingsStore';

type Props = {
  result: RoundResult;
  motion: Motion;
  onAgain: () => void;
  onMenu: () => void;
  onHowTo: () => void;
};

export const ResultScreen: React.FC<Props> = ({result, motion, onAgain, onMenu, onHowTo}) => {
  const rise = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    rise.setValue(0);
    Animated.spring(rise, {
      toValue: 1,
      tension: 52,
      friction: 9,
      useNativeDriver: true,
    }).start();
  }, [rise]);

  const cardSlide = rise.interpolate({inputRange: [0, 1], outputRange: [40, 0]});

  return (
    <View style={styles.root}>
      <AuroraBackdrop variant="result" motion={motion} />

      <ScreenHeader
        title={result.met ? 'ROUND CLEARED' : 'ROUND ENDED'}
        kicker={'LEVEL ' + result.level}
      />

      <View style={styles.body}>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.card, {opacity: rise, transform: [{translateY: cardSlide}]}]}>
          <ResultSummary result={result} />
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="DROP AGAIN" Icon={RotateCcw} onPress={onAgain} />
        <View style={styles.secondRow}>
          <View style={styles.secondSlot}>
            <SecondaryButton label="MENU" Icon={Home} onPress={onMenu} />
          </View>
          <View style={styles.secondSlot}>
            <SecondaryButton label="HOW TO PLAY" Icon={HelpCircle} onPress={onHowTo} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.colors.bg},
  body: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24},
  card: {width: '100%'},
  actions: {paddingHorizontal: 24, paddingBottom: 32},
  secondRow: {flexDirection: 'row', gap: 12, marginTop: 12},
  secondSlot: {flex: 1},
});

export default ResultScreen;
