import type { PetStage, AnimalType } from '../../types';
import { ANIMAL_REGISTRY } from './animalRegistry';
import { ACCESSORY_DEFS, getAccessoryPosition } from './accessories';
import styles from './Pet.module.css';

export type PetAnimation =
  | 'idle' | 'happy' | 'eating' | 'showering' | 'pooping' | 'relieved' | 'sleeping'
  | 'scratching' | 'yawning' | 'jumping' | 'dancing' | 'waving';
export type PetMood = 'happy' | 'sad' | 'neutral';

interface PetProps {
  stage: PetStage;
  animation: PetAnimation;
  mood?: PetMood;
  animalType?: AnimalType;
  bodyColor?: string;
  accessoryId?: string | null;
}

export default function Pet({
  stage,
  animation,
  mood = 'neutral',
  animalType = 'chick',
  bodyColor,
  accessoryId,
}: PetProps) {
  const PetSvg = ANIMAL_REGISTRY[animalType].stages[stage];

  return (
    <div className={`${styles.petWrapper} ${styles[animation]}`}>
      <PetSvg mood={mood} bodyColor={bodyColor} />
      {accessoryId && ACCESSORY_DEFS[accessoryId] && (
        <div
          className={styles.accessoryOverlay}
          style={getAccessoryPosition(accessoryId, animalType, stage)}
          dangerouslySetInnerHTML={{ __html: ACCESSORY_DEFS[accessoryId].svg }}
        />
      )}
    </div>
  );
}
