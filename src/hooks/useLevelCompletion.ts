import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { completedLevelsAtom, completeLevelAtom } from '../store/atoms';
import { useAudio } from './useAudio';
import { levels } from '../data/levels';
import { getCompletedGroupIndices } from '../utils/levelGrouping';

export function useLevelCompletion() {
  const completedLevels = useAtomValue(completedLevelsAtom);
  const dispatchCompleteLevel = useSetAtom(completeLevelAtom);
  const { playFanfare, playVictoryFanfare } = useAudio();
  const navigate = useNavigate();
  const pendingModalRef = useRef<{ groupIndex: number } | null>(null);

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
        pendingModalRef.current = { groupIndex: newGroups[0] };
        playVictoryFanfare();
      } else {
        playFanfare();
      }

      if (newCompleted.length === levels.length) {
        setTimeout(() => navigate('/victory'), 2000);
      } else {
        const nextLevel = levelIndex + 1 < levels.length ? levelIndex + 1 : levelIndex;
        setTimeout(() => navigate(`/map?scrollTo=${nextLevel}`), 2000);
      }
    },
    [completedLevels, dispatchCompleteLevel, navigate, playFanfare, playVictoryFanfare]
  );

  const getPendingModal = useCallback(() => {
    const modal = pendingModalRef.current;
    pendingModalRef.current = null;
    return modal;
  }, []);

  return { completeLevel, getPendingModal };
}
