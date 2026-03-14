import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { completedLevelsAtom, completeLevelAtom, pendingGroupModalAtom } from '../store/atoms';
import { useAudio } from './useAudio';
import { useTimers } from './useTimers';
import { levels } from '../data/levels';
import { getCompletedGroupIndices } from '../utils/levelGrouping';
import { DELAY_TRANSITION } from '../constants';

export function useLevelCompletion() {
  const completedLevels = useAtomValue(completedLevelsAtom);
  const dispatchCompleteLevel = useSetAtom(completeLevelAtom);
  const setPendingModal = useSetAtom(pendingGroupModalAtom);
  const { playFanfare, playVictoryFanfare } = useAudio();
  const setTimer = useTimers();
  const navigate = useNavigate();

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

      if (newCompleted.length === levels.length) {
        setTimer(() => navigate('/victory'), DELAY_TRANSITION);
      } else {
        const nextLevel = levelIndex + 1 < levels.length ? levelIndex + 1 : levelIndex;
        setTimer(() => navigate(`/map?scrollTo=${nextLevel}`), DELAY_TRANSITION);
      }
    },
    [completedLevels, dispatchCompleteLevel, setPendingModal, navigate, playFanfare, playVictoryFanfare, setTimer]
  );

  return { completeLevel };
}
