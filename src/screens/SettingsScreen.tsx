import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Home} from 'lucide-react-native';
import AuroraBackdrop from '../components/AuroraBackdrop';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import ToggleRow from '../components/ToggleRow';
import {ROW_STEP_MS, SWEEP_MS} from '../constants/config';
import {theme} from '../constants/theme';
import type {Settings} from '../state/settingsStore';

type Props = {
  settings: Settings;
  onPatch: (patch: Partial<Settings>) => void;
  onWipe: () => void;
  onMenu: () => void;
};

export const SettingsScreen: React.FC<Props> = ({settings, onPatch, onWipe, onMenu}) => {
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (confirmTimer.current) {
        clearTimeout(confirmTimer.current);
      }
    },
    [],
  );

  const handleReset = useCallback(() => {
    if (!confirming) {
      setConfirming(true);
      confirmTimer.current = setTimeout(() => setConfirming(false), 3000);
      return;
    }
    if (confirmTimer.current) {
      clearTimeout(confirmTimer.current);
      confirmTimer.current = null;
    }
    setConfirming(false);
    setCleared(true);
    onWipe();
  }, [confirming, onWipe]);

  return (
    <View style={styles.root}>
      <AuroraBackdrop variant="sheet" motion={settings.motion} />

      <ScreenHeader
        title="SETTINGS"
        kicker="PRISM DROP"
        leftSlot={<SecondaryButton label="MENU" Icon={Home} onPress={onMenu} />}
      />

      <View style={styles.body}>
        <View style={styles.rows}>
          <ToggleRow
            label="AIM GUIDE"
            hint="Dashed launch line and the target slot"
            value={settings.aimGuide ? 'ON' : 'OFF'}
            onPress={() => onPatch({aimGuide: !settings.aimGuide})}
          />
          <ToggleRow
            label="BALL SPEED"
            hint={'Row step ' + ROW_STEP_MS[settings.speed] + ' ms · sweep ' + SWEEP_MS[settings.speed] + ' ms'}
            value={settings.speed}
            onPress={() => onPatch({speed: settings.speed === 'NORMAL' ? 'FAST' : 'NORMAL'})}
          />
          <ToggleRow
            label="MOTION"
            hint="Aurora drift, motes and hero float"
            value={settings.motion}
            onPress={() => onPatch({motion: settings.motion === 'FULL' ? 'REDUCED' : 'FULL'})}
          />
          <ToggleRow
            label="RESET PROGRESS"
            hint={cleared ? 'Level, best and counters cleared' : 'Clears level, best score and counters'}
            value={confirming ? 'CONFIRM' : cleared ? 'CLEARED' : 'RESET'}
            onPress={handleReset}
            tone="danger"
          />
        </View>

        <Text style={styles.note} numberOfLines={2}>
          {confirming
            ? 'TAP AGAIN TO CONFIRM'
            : cleared
            ? 'PROGRESS CLEARED'
            : 'Offline · points only · no sound, no ads, no purchases'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.colors.bg},
  body: {flex: 1, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28},
  rows: {flex: 1, gap: 12, justifyContent: 'center'},
  note: {
    marginTop: 16,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
});

export default SettingsScreen;
