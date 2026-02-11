import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { completedLevelsAtom, completeLevelAtom } from '../store/atoms';
import { useAudio } from './useAudio';
import { useTimers } from './useTimers';
import { levels } from '../data/levels';
import { getCompletedGroupIndices } from '../utils/levelGrouping';
import { DELAY_TRANSITION } from '../constants';

export function useLevelCompletion() {
  const completedLevels = useAtomValue(completedLevelsAtom);
  const dispatchCompleteLevel = useSetAtom(completeLevelAtom);
  const { playFanfare, playVictoryFanfare } = useAudio();
  const setTimer = useTimers();
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
        setTimer(() => navigate('/victory'), DELAY_TRANSITION);
      } else {
        const nextLevel = levelIndex + 1 < levels.length ? levelIndex + 1 : levelIndex;
        setTimer(() => navigate(`/map?scrollTo=${nextLevel}`), DELAY_TRANSITION);
      }
    },
    [completedLevels, dispatchCompleteLevel, navigate, playFanfare, playVictoryFanfare, setTimer]
  );

  const getPendingModal = useCallback(() => {
    const modal = pendingModalRef.current;
    pendingModalRef.current = null;
    return modal;
  }, []);

  return { completeLevel, getPendingModal };
}
