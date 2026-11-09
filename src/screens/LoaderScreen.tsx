import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Image, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Line} from 'react-native-svg';
import {assets} from '../assets';
import AuroraBackdrop from '../components/AuroraBackdrop';
import {LOADER_DURATION_MS} from '../constants/config';
import {theme} from '../constants/theme';

type Props = {
  onDone: () => void;
};

const BAR_LEN = 190;
const BEAMS = [
  {x2: 46, y2: 92, color: '#8B00FF'},
  {x2: 92, y2: 84, color: '#00D4FF'},
  {x2: 128, y2: 64, color: '#FF2FB9'},
];

/**
 * Brand card. No CTA, no stat chips, no tap handler — the only way out is the
 * 8 s timer. Visibly the darkest screen of the app.
 */
export const LoaderScreen: React.FC<Props> = ({onDone}) => {
  const intro = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const beamPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(intro, {
        toValue: 1,
        tension: 48,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: LOADER_DURATION_MS,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(beamPulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(beamPulse, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    const timer = setTimeout(onDone, LOADER_DURATION_MS);
    return () => {
      clearTimeout(timer);
      pulse.stop();
    };
  }, [beamPulse, intro, onDone, progress]);

  const logoScale = intro.interpolate({inputRange: [0, 1], outputRange: [0.78, 1]});
  const fill = progress.interpolate({inputRange: [0, 1], outputRange: [-BAR_LEN, 0]});
  const beamFade = beamPulse.interpolate({inputRange: [0, 1], outputRange: [0.15, 0.55]});

  return (
    <View style={styles.root}>
      <AuroraBackdrop variant="loader" />
      <View style={styles.veil} pointerEvents="none" />

      <View style={styles.center}>
        <Animated.View
          pointerEvents="none"
          style={[styles.brandCard, {opacity: intro, transform: [{scale: logoScale}]}]}>
          <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <Animated.View pointerEvents="none" style={[styles.beams, {opacity: beamFade}]}>
          <Svg width={150} height={100}>
            {BEAMS.map((beam, i) => (
              <Line
                key={'beam' + i}
                x1={0}
                y1={0}
                x2={beam.x2}
                y2={beam.y2}
                stroke={beam.color}
                strokeWidth={2}
              />
            ))}
          </Svg>
        </Animated.View>

        <Animated.View pointerEvents="none" style={{opacity: intro}}>
          <Text style={styles.kicker}>PLONKO</Text>
          <Text style={styles.title}>PRISM DROP</Text>
          <Text style={styles.subtitle}>AIM THE LIGHT</Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressTrack}>
          <Animated.View
            pointerEvents="none"
            style={[styles.progressFill, {transform: [{translateX: fill}]}]}>
            <LinearGradient
              colors={[theme.colors.violet, theme.colors.cyan]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.progressGrad}
            />
          </Animated.View>
        </View>
        <Text style={styles.loading}>LOADING...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.colors.bgDeep},
  veil: {...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(5,0,16,0.45)'},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28},
  brandCard: {
    width: 176,
    height: 176,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26,0,56,0.70)',
    borderWidth: 1,
    borderColor: 'rgba(139,0,255,0.40)',
    shadowColor: theme.colors.violet,
    shadowOpacity: 0.55,
    shadowRadius: 26,
    shadowOffset: {width: 0, height: 10},
    elevation: 14,
    marginBottom: 26,
  },
  logo: {width: 132, height: 132},
  beams: {position: 'absolute', left: 18, top: 24},
  kicker: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 6,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
    color: theme.colors.textPrimary,
    textShadowColor: 'rgba(139,0,255,0.9)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 18,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
    color: theme.colors.textMuted,
  },
  footer: {alignItems: 'center', paddingBottom: 64},
  progressTrack: {
    width: BAR_LEN,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(242,234,255,0.10)',
    overflow: 'hidden',
  },
  progressFill: {width: BAR_LEN, height: 4},
  progressGrad: {flex: 1},
  loading: {
    marginTop: 14,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.textMuted,
  },
});

export default LoaderScreen;
