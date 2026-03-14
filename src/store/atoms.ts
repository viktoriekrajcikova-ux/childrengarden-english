import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import type { Difficulty, AnimalType } from '../types';

// Custom storage for difficulty — old code stored plain string, not JSON
const difficultyStorage = createJSONStorage<Difficulty | null>(() => localStorage);
const originalGetItem = difficultyStorage.getItem;
difficultyStorage.getItem = (key, initialValue) => {
  const raw = localStorage.getItem(key);
  if (raw === null) return initialValue;
  // Handle old plain-string format (e.g. "easy" instead of JSON "\"easy\"")
  if (raw === 'easy' || raw === 'medium' || raw === 'hard') return raw as Difficulty;
  return originalGetItem(key, initialValue);
};

export const scoreAtom = atomWithStorage<number>('englishGameScore', 0);
export const completedLevelsAtom = atomWithStorage<number[]>('englishGameCompletedLevels', []);
export const difficultyAtom = atomWithStorage<Difficulty | null>('englishGameDifficulty', null, difficultyStorage);
export const fedFoodAtom = atomWithStorage<Record<string, number>>('englishGameFedFood', {});
export const mutedAtom = atomWithStorage<boolean>('englishGameMuted', false);
export const lastSeenPetStageAtom = atomWithStorage<string>('englishGameLastPetStage', 'small');
export const lastFedTimeAtom = atomWithStorage<number>('englishGameLastFedTime', 0);

// Derived write atoms for common actions
export const addScoreAtom = atom(null, (get, set, amount: number) => {
  set(scoreAtom, get(scoreAtom) + amount);
});

export const subtractScoreAtom = atom(null, (get, set, amount: number) => {
  set(scoreAtom, Math.max(0, get(scoreAtom) - amount));
});

export const addFedFoodAtom = atom(null, (get, set, emoji: string) => {
  const current = get(fedFoodAtom);
  set(fedFoodAtom, { ...current, [emoji]: (current[emoji] || 0) + 1 });
});

export const completeLevelAtom = atom(null, (get, set, levelIndex: number) => {
  const completed = get(completedLevelsAtom);
  if (!completed.includes(levelIndex)) {
    set(completedLevelsAtom, [...completed, levelIndex]);
  }
});

export const pendingGroupModalAtom = atom<{ groupIndex: number } | null>(null);

const DIFFICULTY_TO_ANIMAL: Record<Difficulty, AnimalType> = {
  easy: 'chick',
  medium: 'fox',
  hard: 'lion',
};

export const animalTypeAtom = atom<AnimalType>((get) => {
  const difficulty = get(difficultyAtom);
  return difficulty ? DIFFICULTY_TO_ANIMAL[difficulty] : 'chick';
});

export const resetGameAtom = atom(null, (_get, set) => {
  set(scoreAtom, 0);
  set(completedLevelsAtom, []);
  set(difficultyAtom, null);
  set(pendingGroupModalAtom, null);
  set(fedFoodAtom, {});
});
