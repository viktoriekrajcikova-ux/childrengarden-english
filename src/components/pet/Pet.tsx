import type { PetStage, AnimalType } from '../../types';
import { ANIMAL_REGISTRY } from './animalRegistry';
import styles from './Pet.module.css';

export type PetAnimation = 'idle' | 'happy' | 'eating' | 'showering' | 'pooping' | 'relieved';
export type PetMood = 'happy' | 'sad' | 'neutral';

interface PetProps {
  stage: PetStage;
  animation: PetAnimation;
  mood?: PetMood;
  animalType?: AnimalType;
}

export default function Pet({ stage, animation, mood = 'neutral', animalType = 'chick' }: PetProps) {
  const PetSvg = ANIMAL_REGISTRY[animalType].stages[stage];

  return (
    <div className={`${styles.petWrapper} ${styles[animation]}`}>
      <PetSvg mood={mood} />
    </div>
  );
}
