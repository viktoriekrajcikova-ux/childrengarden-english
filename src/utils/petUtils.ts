import type { PetStage, AnimalType } from '../types';
import { PET_GROWTH_MEDIUM, PET_GROWTH_ADULT } from '../constants';
import { ANIMAL_REGISTRY } from '../components/pet/animalRegistry';

export function getPetStage(completedGroupCount: number): PetStage {
  if (completedGroupCount >= PET_GROWTH_ADULT) return 'adult';
  if (completedGroupCount >= PET_GROWTH_MEDIUM) return 'medium';
  return 'small';
}

export function getPetEmoji(stage: PetStage, animalType: AnimalType = 'chick'): string {
  return ANIMAL_REGISTRY[animalType].emoji[stage];
}
