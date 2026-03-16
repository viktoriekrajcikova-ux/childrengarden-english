import { useCallback, useState } from 'react';
import { useAtom } from 'jotai';
import { achievementsAtom } from '../store/atoms';
import { getAchievementById } from '../data/achievements';
import type { Achievement } from '../data/achievements';

export function useAchievements() {
  const [achievements, setAchievements] = useAtom(achievementsAtom);
  const [toast, setToast] = useState<Achievement | null>(null);

  const checkAndUnlock = useCallback(
    (id: string, condition: boolean) => {
      if (!condition || achievements.includes(id)) return false;
      const achievement = getAchievementById(id);
      if (!achievement) return false;
      setAchievements([...achievements, id]);
      setToast(achievement);
      setTimeout(() => setToast(null), 3000);
      return true;
    },
    [achievements, setAchievements]
  );

  const hasAchievement = useCallback(
    (id: string) => achievements.includes(id),
    [achievements]
  );

  const dismissToast = useCallback(() => setToast(null), []);

  return { achievements, checkAndUnlock, hasAchievement, toast, dismissToast };
}
