export type Speed = 'NORMAL' | 'FAST';
export type Motion = 'FULL' | 'REDUCED';

export type Settings = {
  aimGuide: boolean;
  speed: Speed;
  motion: Motion;
};

export const DEFAULT_SETTINGS: Settings = {
  aimGuide: true,
  speed: 'NORMAL',
  motion: 'FULL',
};

let record: Settings = {...DEFAULT_SETTINGS};

export const loadSettings = async (): Promise<Settings> => ({...record});

export const saveSettings = async (patch: Partial<Settings>): Promise<Settings> => {
  record = {...record, ...patch};
  return {...record};
};

export const resetSettings = async (): Promise<Settings> => {
  record = {...DEFAULT_SETTINGS};
  return {...record};
};
