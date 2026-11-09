/**
 * Local progress record. The dependency list for this pipeline contains no
 * key-value native module (adding one is exactly the dependency class that
 * breaks the Windows release build), so the whole persistence surface is
 * isolated behind these four functions — swapping in a native store later is
 * a one-file change.
 */
export type Progress = {
  level: number;
  best: number;
  rounds: number;
  pegsLit: number;
  prismsUsed: number;
  attempt: number;
};

export const DEFAULT_PROGRESS: Progress = {
  level: 1,
  best: 0,
  rounds: 0,
  pegsLit: 0,
  prismsUsed: 0,
  attempt: 1,
};

let record: Progress = {...DEFAULT_PROGRESS};

export const loadProgress = async (): Promise<Progress> => ({...record});

export const saveProgress = async (patch: Partial<Progress>): Promise<Progress> => {
  record = {...record, ...patch};
  return {...record};
};

export const resetProgress = async (): Promise<Progress> => {
  record = {...DEFAULT_PROGRESS};
  return {...record};
};

export const peekProgress = (): Progress => ({...record});
