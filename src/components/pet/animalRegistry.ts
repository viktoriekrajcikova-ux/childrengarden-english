import type { AnimalType, PetStage } from '../../types';
import type { PetMood } from './Pet';
import ChickSmall from './chick/ChickSmall';
import ChickMedium from './chick/ChickMedium';
import ChickAdult from './chick/ChickAdult';
import FoxSmall from './fox/FoxSmall';
import FoxMedium from './fox/FoxMedium';
import FoxAdult from './fox/FoxAdult';
import LionSmall from './lion/LionSmall';
import LionMedium from './lion/LionMedium';
import LionAdult from './lion/LionAdult';

export interface PetSvgProps {
  mood: PetMood;
  bodyColor?: string;
}

interface AnimalDef {
  stages: Record<PetStage, React.FC<PetSvgProps>>;
  emoji: Record<PetStage, string>;
}

export const ANIMAL_REGISTRY: Record<AnimalType, AnimalDef> = {
  chick: {
    stages: { small: ChickSmall, medium: ChickMedium, adult: ChickAdult },
    emoji: { small: '🐣', medium: '🐥', adult: '🐔' },
  },
  fox: {
    stages: { small: FoxSmall, medium: FoxMedium, adult: FoxAdult },
    emoji: { small: '🦊', medium: '🦊', adult: '🦊' },
  },
  lion: {
    stages: { small: LionSmall, medium: LionMedium, adult: LionAdult },
    emoji: { small: '🦁', medium: '🦁', adult: '🦁' },
  },
};
