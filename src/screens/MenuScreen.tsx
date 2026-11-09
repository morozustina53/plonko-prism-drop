import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Image, StyleSheet, Text, View} from 'react-native';
import {HelpCircle, Settings as SettingsIcon, Zap} from 'lucide-react-native';
import {assets} from '../assets';
import AuroraBackdrop from '../components/AuroraBackdrop';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import StatPill, {StatRow, StatSlot} from '../components/StatPill';
import {theme} from '../constants/theme';
import {formatPoints} from '../game/scoring';
import type {Motion} from '../state/settingsStore';

type Props = {
  level: number;
  target: number;
  best: number;
  motion: Motion;
  onPlay: () => void;
  onHowTo: () => void;
  onSettings: () => void;
};

export const MenuScreen: React.FC<Props> = ({
  level,
  target,
  best,
  motion,
  onPlay,
  onHowTo,
  onSettings,
}) => {
  const rise = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const reduced = motion === 'REDUCED';

  useEffect(() => {
    Animated.timing(rise, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [rise]);

  useEffect(() => {
    if (reduced) {
      float.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [float, reduced]);

  const sheetSlide = rise.interpolate({inputRange: [0, 1], outputRange: [24, 0]});
  const prismFloat = float.interpolate({inputRange: [0, 1], outputRange: [-6, 6]});
  const orbFall = float.interpolate({inputRange: [0, 1], outputRange: [-14, 22]});

  return (
    <View style={styles.root}>
      <AuroraBackdrop variant="menu" motion={motion} />

      <View style={styles.hero}>
        <Animated.View
          pointerEvents="none"
          style={[styles.prismWrap, {transform: [{translateY: prismFloat}]}]}>
          <Image source={assets.prism} style={styles.prism} resizeMode="contain" />
        </Animated.View>
        <Animated.View
          pointerEvents="none"
          style={[styles.orbWrap, {transform: [{translateY: orbFall}]}]}>
          <Image source={assets.orb} style={styles.orb} resizeMode="contain" />
        </Animated.View>
        <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={[styles.sheet, {opacity: rise, transform: [{translateY: sheetSlide}]}]}>
        <Text style={styles.kicker}>PLONKO</Text>
        <Text style={styles.title}>PRISM DROP</Text>
        <Text style={styles.tagline}>TAP TO DROP · LIGHT EVERY PEG</Text>

        <View style={styles.stats}>
          <StatRow>
            <StatSlot>
              <StatPill label="LEVEL" value={String(level)} color={theme.colors.cyan} />
            </StatSlot>
            <StatSlot>
              <StatPill
                label="TARGET"
                value={formatPoints(target)}
                color={theme.colors.violet}
              />
            </StatSlot>
            {best > 0 ? (
              <StatSlot>
                <StatPill
                  label="BEST"
                  value={formatPoints(best)}
                  color={theme.colors.magenta}
                />
              </StatSlot>
            ) : null}
          </StatRow>
        </View>

        <PrimaryButton label="PLAY NOW" Icon={Zap} onPress={onPlay} />

        <View style={styles.secondRow}>
          <View style={styles.secondSlot}>
            <SecondaryButton label="HOW TO PLAY" Icon={HelpCircle} onPress={onHowTo} />
          </View>
          <View style={styles.secondSlot}>
            <SecondaryButton label="SETTINGS" Icon={SettingsIcon} onPress={onSettings} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.colors.bg},
  hero: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  logo: {width: 150, height: 150, opacity: 0.95},
  prismWrap: {position: 'absolute', top: '22%', alignSelf: 'center'},
  prism: {width: 120, height: 120, opacity: 0.9},
  orbWrap: {position: 'absolute', top: '58%', left: '26%'},
  orb: {width: 34, height: 34},
  sheet: {
    backgroundColor: 'rgba(18,0,38,0.93)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: theme.colors.hairline,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
    shadowColor: theme.colors.violet,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: -10},
    elevation: 16,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 6,
    color: '#7B2FBE',
  },
  title: {
    marginTop: 4,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.textPrimary,
  },
  tagline: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1,
    color: theme.colors.textSecondary,
  },
  stats: {marginBottom: 18},
  secondRow: {flexDirection: 'row', gap: 12, marginTop: 12},
  secondSlot: {flex: 1},
});

export default MenuScreen;
