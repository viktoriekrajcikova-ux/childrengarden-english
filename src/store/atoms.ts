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

export const volumeAtom = atomWithStorage<number>('englishGameVolume', 0.5);
export const scoreAtom = atomWithStorage<number>('englishGameScore', 0);
export const completedLevelsAtom = atomWithStorage<number[]>('englishGameCompletedLevels', []);
export const difficultyAtom = atomWithStorage<Difficulty | null>('englishGameDifficulty', null, difficultyStorage);
export const fedFoodAtom = atomWithStorage<Record<string, number>>('englishGameFedFood', {});
export const mutedAtom = atomWithStorage<boolean>('englishGameMuted', false);
export const lastSeenPetStageAtom = atomWithStorage<string>('englishGameLastPetStage', 'small');
export const lastFedTimeAtom = atomWithStorage<number>('englishGameLastFedTime', 0);
export const seenTutorialsAtom = atomWithStorage<string[]>('englishGameTutorials', []);
export const petNameAtom = atomWithStorage<string>('englishGamePetName', '');
export const streakAtom = atom(0);
export const achievementsAtom = atomWithStorage<string[]>('englishGameAchievements', []);
export const hasHatchedAtom = atomWithStorage<boolean>('englishGameHasHatched', false);
export const playDatesAtom = atomWithStorage<string[]>('englishGamePlayDates', []);
export const lastVisitTimeAtom = atomWithStorage<number>('englishGameLastVisitTime', 0);
export const petColorsAtom = atomWithStorage<Record<string, string | null>>('englishGamePetColors', {});
export const ownedColorsAtom = atomWithStorage<Record<string, string[]>>('englishGameOwnedColors2', {});
export const ownedAccessoriesAtom = atomWithStorage<Record<string, string[]>>('englishGameOwnedAccessories2', {});
export const equippedAccessoriesAtom = atomWithStorage<Record<string, string | null>>('englishGameEquippedAccessories', {});

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
  set(petNameAtom, '');
  set(seenTutorialsAtom, []);
  set(achievementsAtom, []);
  set(streakAtom, 0);
  set(hasHatchedAtom, false);
  set(playDatesAtom, []);
  set(lastVisitTimeAtom, 0);
  set(petColorsAtom, {});
  set(ownedColorsAtom, {});
  set(ownedAccessoriesAtom, {});
  set(equippedAccessoriesAtom, {});
});
