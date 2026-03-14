import type { PetStage } from '../types';
import { PET_GROWTH_MEDIUM, PET_GROWTH_ADULT } from '../constants';

export function getPetStage(completedGroupCount: number): PetStage {
  if (completedGroupCount >= PET_GROWTH_ADULT) return 'adult';
  if (completedGroupCount >= PET_GROWTH_MEDIUM) return 'medium';
  return 'small';
}

export function getPetEmoji(stage: PetStage): string {
  switch (stage) {
    case 'small': return '🐣';
    case 'medium': return '🐥';
    case 'adult': return '🐔';
  }
}
