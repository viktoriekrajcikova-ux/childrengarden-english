import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { streakAtom } from '../store/atoms';
import { STREAK_BONUS_3, STREAK_BONUS_5, SCORE_CORRECT } from '../constants';

export function useStreak() {
  const [streak, setStreak] = useAtom(streakAtom);

  const incrementStreak = useCallback(() => setStreak((s) => s + 1), [setStreak]);
  const resetStreak = useCallback(() => setStreak(0), [setStreak]);

  /** Calculate bonus for the NEXT streak value (since state hasn't updated yet). */
  const getNextBonus = useCallback((): number => {
    const next = streak + 1;
    return next >= 5 ? STREAK_BONUS_5 : next >= 3 ? STREAK_BONUS_3 : 0;
  }, [streak]);

  /** Total score for a correct answer including streak bonus. */
  const getCorrectScore = useCallback((): { total: number; bonus: number } => {
    const bonus = getNextBonus();
    return { total: SCORE_CORRECT + bonus, bonus };
  }, [getNextBonus]);

  return { streak, incrementStreak, resetStreak, getNextBonus, getCorrectScore };
}
