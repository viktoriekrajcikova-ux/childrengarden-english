import type { Level, LevelGroup } from '../types';

export function isGameLevel(level: Level): boolean {
  return (
    level.type === 'memory' ||
    level.type === 'coloring' ||
    level.type === 'dragDrop' ||
    level.type === 'counting' ||
    level.type === 'restaurant' ||
    level.type === 'rhythm'
  );
}

export function calculateGroups(
  levels: Level[],
  completedLevels: number[]
): LevelGroup[] {
  const groups: LevelGroup[] = [];
  let currentGroupLevels: { level: Level; index: number }[] = [];
  let levelsInCurrentGroup = 0;

  const flush = () => {
    if (currentGroupLevels.length > 0) {
      groups.push({
        groupNumber: groups.length + 1,
        levels: currentGroupLevels,
        isLocked: false,
        isCompleted: false,
      });
      currentGroupLevels = [];
      levelsInCurrentGroup = 0;
    }
  };

  levels.forEach((level, index) => {
    const prevLevel = index > 0 ? levels[index - 1] : null;
    let shouldStart = false;

    if (index === 0) {
      shouldStart = true;
    } else if (isGameLevel(level)) {
      shouldStart = true;
    } else if (prevLevel && isGameLevel(prevLevel)) {
      shouldStart = true;
    } else if (levelsInCurrentGroup >= 5) {
      shouldStart = true;
    }

    if (shouldStart && index > 0) {
      flush();
    }

    currentGroupLevels.push({ level, index });
    levelsInCurrentGroup++;
  });

  flush();

  // Compute completed groups count
  let completedGroupsCount = 0;
  groups.forEach((group) => {
    const isComplete = group.levels.every((l) =>
      completedLevels.includes(l.index)
    );
    group.isCompleted = isComplete;
    if (isComplete) completedGroupsCount++;
  });

  // Admin mode — defaultne zapnuto, vypnout lze pres localStorage.setItem('role', 'user')
  const role = localStorage.getItem('role');
  const isAdmin = role === null || role === 'admin';

  // Group is locked if groupNumber > completedGroupsCount + 1 (unless admin)
  groups.forEach((group) => {
    group.isLocked = isAdmin ? false : group.groupNumber > completedGroupsCount + 1;
  });

  return groups;
}

export function getCompletedGroupIndices(
  levels: Level[],
  completedLevels: number[]
): number[] {
  const groups = calculateGroups(levels, completedLevels);
  return groups
    .filter((g) => g.isCompleted)
    .map((g) => g.groupNumber - 1); // 0-based
}

export function getLevelIcon(level: Level, isLocked: boolean): string {
  if (isLocked) return '🔒';
  switch (level.type) {
    case 'autoReview': return '🔄';
    case 'memory': return '🃏';
    case 'coloring': return '🎨';
    case 'dragDrop': return '🎯';
    case 'counting': return '🔢';
    case 'restaurant': return '🍽️';
    case 'rhythm': return '🎵';
    case 'standard':
      return level.items.length > 0 ? level.items[0].emoji : '🎮';
    default:
      return '🎮';
  }
}
