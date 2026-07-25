import type { Difficulty, DifficultyKey, LevelItem } from '../types';
import { shuffleArray } from './shuffle';

const difficultyMap: Record<Difficulty, DifficultyKey> = {
  easy: 'kuratko',
  medium: 'listicka',
  hard: 'lev',
};

export function filterByDifficulty<T extends { difficulties?: DifficultyKey[]; name?: string }>(
  items: T[],
  difficulty: Difficulty
): T[] {
  if (!items || items.length === 0) return [];
  const key = difficultyMap[difficulty];

  const byDifficulty = items.filter((item) => {
    if (!item.difficulties || !Array.isArray(item.difficulties)) return true;
    return item.difficulties.includes(key);
  });

  // Pravidlo "r" (CLAUDE.md): slova s písmenem "r" jsou obtížná na výslovnost,
  // takže pro nejmenší (kuratko = easy) je vynecháme. Vynucujeme to v kódu, aby
  // to nezáviselo na bezchybně vyplněných datech (často tam "r"-slova prosáknou).
  // Fallback: kdyby po vyřazení nezůstala žádná položka, necháme aspoň jednu.
  if (difficulty === 'easy') {
    const withoutR = byDifficulty.filter(
      (item) => !(typeof item.name === 'string' && /r/i.test(item.name))
    );
    return withoutR.length > 0 ? withoutR : byDifficulty.slice(0, 1);
  }

  return byDifficulty;
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
