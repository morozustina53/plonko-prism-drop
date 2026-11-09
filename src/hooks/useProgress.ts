import {useCallback, useEffect, useRef, useState} from 'react';
import {
  DEFAULT_PROGRESS,
  loadProgress,
  resetProgress,
  saveProgress,
  type Progress,
} from '../state/progressStore';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  resetSettings,
  saveSettings,
  type Settings,
} from '../state/settingsStore';

export type ProgressApi = {
  ready: boolean;
  progress: Progress;
  settings: Settings;
  patchProgress: (patch: Partial<Progress>) => void;
  patchSettings: (patch: Partial<Settings>) => void;
  wipe: () => void;
};

export const useProgress = (): ProgressApi => {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    Promise.all([loadProgress(), loadSettings()])
      .then(([p, s]) => {
        if (!alive.current) {
          return;
        }
        setProgress(p);
        setSettings(s);
        setReady(true);
      })
      .catch(() => {
        if (alive.current) {
          setReady(true);
        }
      });
    return () => {
      alive.current = false;
    };
  }, []);

  const patchProgress = useCallback((patch: Partial<Progress>) => {
    saveProgress(patch)
      .then(next => {
        if (alive.current) {
          setProgress(next);
        }
      })
      .catch(() => {});
  }, []);

  const patchSettings = useCallback((patch: Partial<Settings>) => {
    saveSettings(patch)
      .then(next => {
        if (alive.current) {
          setSettings(next);
        }
      })
      .catch(() => {});
  }, []);

  const wipe = useCallback(() => {
    Promise.all([resetProgress(), resetSettings()])
      .then(([p, s]) => {
        if (!alive.current) {
          return;
        }
        setProgress(p);
        setSettings(s);
      })
      .catch(() => {});
  }, []);

  return {ready, progress, settings, patchProgress, patchSettings, wipe};
};
