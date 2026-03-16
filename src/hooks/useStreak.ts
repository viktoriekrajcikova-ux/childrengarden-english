import { useAtom } from 'jotai';
import { streakAtom } from '../store/atoms';
import { STREAK_BONUS_3, STREAK_BONUS_5 } from '../constants';

export function useStreak() {
  const [streak, setStreak] = useAtom(streakAtom);

  const incrementStreak = () => setStreak((s) => s + 1);
  const resetStreak = () => setStreak(0);
  const getBonus = () => (streak >= 5 ? STREAK_BONUS_5 : streak >= 3 ? STREAK_BONUS_3 : 0);

  return { streak, incrementStreak, resetStreak, getBonus };
}
