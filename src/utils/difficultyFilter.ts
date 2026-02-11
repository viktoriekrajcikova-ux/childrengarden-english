import type { Difficulty, DifficultyKey, LevelItem } from '../types';
import { shuffleArray } from './shuffle';

const difficultyMap: Record<Difficulty, DifficultyKey> = {
  easy: 'kuratko',
  medium: 'listicka',
  hard: 'lev',
};

export function filterByDifficulty<T extends { difficulties?: DifficultyKey[] }>(
  items: T[],
  difficulty: Difficulty
): T[] {
  if (!items || items.length === 0) return [];
  const key = difficultyMap[difficulty];
  return items.filter((item) => {
    if (!item.difficulties || !Array.isArray(item.difficulties)) return true;
    return item.difficulties.includes(key);
  });
}

export function getMaxDisplay(difficulty: Difficulty): number {
  if (difficulty === 'easy') return 3;
  if (difficulty === 'medium') return 4;
  return 6;
}

export function getItemsForLevel(
  items: LevelItem[],
  maxDisplay: number,
  difficulty: Difficulty
): LevelItem[] {
  const filtered = filterByDifficulty(items, difficulty);
  const diffMax = getMaxDisplay(difficulty);
  const limit = Math.min(maxDisplay, diffMax);

  if (filtered.length > limit) {
    return shuffleArray(filtered).slice(0, limit);
  }
  return [...filtered];
}
