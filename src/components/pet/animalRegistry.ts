import type { AnimalType, PetStage } from '../../types';
import type { PetMood } from './Pet';
import ChickSmall from './chick/ChickSmall';
import ChickMedium from './chick/ChickMedium';
import ChickAdult from './chick/ChickAdult';

interface AnimalDef {
  stages: Record<PetStage, React.FC<{ mood: PetMood }>>;
  emoji: Record<PetStage, string>;
}

export const ANIMAL_REGISTRY: Record<AnimalType, AnimalDef> = {
  chick: {
    stages: { small: ChickSmall, medium: ChickMedium, adult: ChickAdult },
    emoji: { small: '🐣', medium: '🐥', adult: '🐔' },
  },
  fox: {
    // Placeholder — reuses chick SVGs until fox artwork is added
    stages: { small: ChickSmall, medium: ChickMedium, adult: ChickAdult },
    emoji: { small: '🦊', medium: '🦊', adult: '🦊' },
  },
  lion: {
    // Placeholder — reuses chick SVGs until lion artwork is added
    stages: { small: ChickSmall, medium: ChickMedium, adult: ChickAdult },
    emoji: { small: '🦁', medium: '🦁', adult: '🦁' },
  },
};
