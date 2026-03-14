import type { PetStage } from '../../types';
import PetSmall from './PetSmall';
import PetMedium from './PetMedium';
import PetAdult from './PetAdult';
import styles from './Pet.module.css';

export type PetAnimation = 'idle' | 'happy' | 'eating' | 'showering' | 'pooping' | 'relieved';

interface PetProps {
  stage: PetStage;
  animation: PetAnimation;
}

export default function Pet({ stage, animation }: PetProps) {
  const PetSvg = stage === 'adult' ? PetAdult : stage === 'medium' ? PetMedium : PetSmall;

  return (
    <div className={`${styles.petWrapper} ${styles[animation]}`}>
      <PetSvg />
    </div>
  );
}
