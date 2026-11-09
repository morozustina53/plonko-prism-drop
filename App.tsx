/**
 * PlonkoPrismDrop — screen state machine.
 * Navigation is a state machine here, not a navigation library: no
 * @react-navigation, no deep links. Gameplay lives in src/.
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, BackHandler, StatusBar, StyleSheet, View} from 'react-native';
import GameScreen from './src/screens/GameScreen';
import HowToPlayScreen from './src/screens/HowToPlayScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import ResultScreen from './src/screens/ResultScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import {targetForLevel} from './src/constants/config';
import {theme} from './src/constants/theme';
import type {RoundResult} from './src/game/round';
import {useProgress} from './src/hooks/useProgress';

type Screen = 'loader' | 'menu' | 'game' | 'result' | 'howto' | 'settings';

const App = (): React.JSX.Element => {
  const [screen, setScreen] = useState<Screen>('loader');
  const [result, setResult] = useState<RoundResult | null>(null);
  const {progress, settings, patchProgress, patchSettings, wipe} = useProgress();
  const fade = useRef(new Animated.Value(1)).current;

  // Cross-fade on every screen change (260 ms, transform/opacity only).
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [fade, screen]);

  // System Back: any screen returns to Menu, Back on Menu closes the app,
  // the loader is never on the back stack.
  useEffect(() => {
    const onBack = () => {
      if (screen === 'menu' || screen === 'loader') {
        return false;
      }
      setScreen('menu');
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [screen]);

  const goMenu = useCallback(() => setScreen('menu'), []);
  const goGame = useCallback(() => setScreen('game'), []);
  const goHowTo = useCallback(() => setScreen('howto'), []);
  const goSettings = useCallback(() => setScreen('settings'), []);

  const handleGameOver = useCallback(
    (record: RoundResult) => {
      setResult(record);
      patchProgress({
        level: record.met ? record.level + 1 : record.level,
        best: Math.max(progress.best, record.score),
        rounds: progress.rounds + 1,
        pegsLit: progress.pegsLit + record.pegsLit,
        prismsUsed: progress.prismsUsed + record.prismsUsed,
        attempt: progress.attempt + 1,
      });
      setScreen('result');
    },
    [patchProgress, progress],
  );

  const renderScreen = () => {
    switch (screen) {
      case 'loader':
        return <LoaderScreen onDone={goMenu} />;
      case 'menu':
        return (
          <MenuScreen
            level={progress.level}
            target={targetForLevel(progress.level)}
            best={progress.best}
            motion={settings.motion}
            onPlay={goGame}
            onHowTo={goHowTo}
            onSettings={goSettings}
          />
        );
      case 'game':
        return (
          <GameScreen
            key={'round-' + progress.level + '-' + progress.attempt}
            level={progress.level}
            attempt={progress.attempt}
            aimGuide={settings.aimGuide}
            speed={settings.speed}
            motion={settings.motion}
            onMenu={goMenu}
            onGameOver={handleGameOver}
          />
        );
      case 'result':
        return result ? (
          <ResultScreen
            result={result}
            motion={settings.motion}
            onAgain={goGame}
            onMenu={goMenu}
            onHowTo={goHowTo}
          />
        ) : (
          <MenuScreen
            level={progress.level}
            target={targetForLevel(progress.level)}
            best={progress.best}
            motion={settings.motion}
            onPlay={goGame}
            onHowTo={goHowTo}
            onSettings={goSettings}
          />
        );
      case 'howto':
        return <HowToPlayScreen motion={settings.motion} onMenu={goMenu} />;
      case 'settings':
        return (
          <SettingsScreen
            settings={settings}
            onPatch={patchSettings}
            onWipe={wipe}
            onMenu={goMenu}
          />
        );
      default:
        return <LoaderScreen onDone={goMenu} />;
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Animated.View pointerEvents="box-none" style={[styles.fill, {opacity: fade}]}>
        {renderScreen()}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.colors.bg},
  fill: {flex: 1},
});

export default App;
