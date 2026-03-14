import type { PetStage } from '../../types';
import PetSmall from './PetSmall';
import PetMedium from './PetMedium';
import PetAdult from './PetAdult';
import styles from './Pet.module.css';

export type PetAnimation = 'idle' | 'happy' | 'eating' | 'showering' | 'pooping' | 'relieved';
export type PetMood = 'happy' | 'sad' | 'neutral';

interface PetProps {
  stage: PetStage;
  animation: PetAnimation;
  mood?: PetMood;
}

export default function Pet({ stage, animation, mood = 'neutral' }: PetProps) {
  const PetSvg = stage === 'adult' ? PetAdult : stage === 'medium' ? PetMedium : PetSmall;

  return (
    <div className={`${styles.petWrapper} ${styles[animation]}`}>
      <PetSvg mood={mood} />
    </div>
  );
}
