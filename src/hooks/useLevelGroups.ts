import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { levels } from '../data/levels';
import { completedLevelsAtom } from '../store/atoms';
import { calculateGroups, getCompletedGroupIndices } from '../utils/levelGrouping';

export function useLevelGroups() {
  const completedLevels = useAtomValue(completedLevelsAtom);

  const groups = useMemo(
    () => calculateGroups(levels, completedLevels),
    [completedLevels]
  );

  const completedGroupIndices = useMemo(
    () => getCompletedGroupIndices(levels, completedLevels),
    [completedLevels]
  );

  return { groups, completedGroupIndices };
}
