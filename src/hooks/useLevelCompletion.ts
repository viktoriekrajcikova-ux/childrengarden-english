import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { completedLevelsAtom, completeLevelAtom, pendingGroupModalAtom, achievementsAtom } from '../store/atoms';
import { useAudio } from './useAudio';
import { useTimers } from './useTimers';
import { levels } from '../data/levels';
import { getCompletedGroupIndices } from '../utils/levelGrouping';
import { DELAY_TRANSITION } from '../constants';

export function useLevelCompletion() {
  const completedLevels = useAtomValue(completedLevelsAtom);
  const dispatchCompleteLevel = useSetAtom(completeLevelAtom);
  const setPendingModal = useSetAtom(pendingGroupModalAtom);
  const [achievements, setAchievements] = [useAtomValue(achievementsAtom), useSetAtom(achievementsAtom)];
  const { playFanfare, playVictoryFanfare } = useAudio();
  const setTimer = useTimers();
  const navigate = useNavigate();

  const unlockAchievement = useCallback(
    (id: string) => {
      if (!achievements.includes(id)) {
        setAchievements([...achievements, id]);
      }
    },
    [achievements, setAchievements]
  );

  const completeLevel = useCallback(
    (levelIndex: number) => {
      const previousGroups = getCompletedGroupIndices(levels, completedLevels);
      dispatchCompleteLevel(levelIndex);

      const newCompleted = completedLevels.includes(levelIndex)
        ? completedLevels
        : [...completedLevels, levelIndex];

      const currentGroups = getCompletedGroupIndices(levels, newCompleted);
      const newGroups = currentGroups.filter((g) => !previousGroups.includes(g));

      if (newGroups.length > 0) {
        setPendingModal({ groupIndex: newGroups[0] });
        playVictoryFanfare();
      } else {
        playFanfare();
      }

      // Achievement checks
      if (newCompleted.length === 1) unlockAchievement('first_level');
      if (newCompleted.length === levels.length) unlockAchievement('all_levels');

      // Check all standard levels completed
      const allStandard = levels.every((l, i) => l.type !== 'standard' || newCompleted.includes(i));
      if (allStandard) unlockAchievement('all_standard');

      if (newCompleted.length === levels.length) {
        setTimer(() => navigate('/victory'), DELAY_TRANSITION);
      } else {
        const nextLevel = levelIndex + 1 < levels.length ? levelIndex + 1 : levelIndex;
        setTimer(() => navigate(`/map?scrollTo=${nextLevel}`), DELAY_TRANSITION);
      }
    },
    [completedLevels, dispatchCompleteLevel, setPendingModal, navigate, playFanfare, playVictoryFanfare, setTimer, unlockAchievement]
  );

  return { completeLevel };
}
