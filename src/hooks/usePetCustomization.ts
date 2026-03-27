import { useCallback } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import type { PrimitiveAtom } from 'jotai';
import {
  petColorsAtom, ownedColorsAtom,
  ownedAccessoriesAtom, equippedAccessoriesAtom,
  animalTypeAtom,
} from '../store/atoms';

/** Generic helper for per-animal-type atom maps. */
function useAnimalMap<T>(atom: PrimitiveAtom<Record<string, T>>, defaultValue: T) {
  const animalType = useAtomValue(animalTypeAtom);
  const [map, setMap] = useAtom(atom);
  const value = map[animalType] ?? defaultValue;
  const setValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setMap(prev => ({
        ...prev,
        [animalType]: typeof updater === 'function'
          ? (updater as (prev: T) => T)(prev[animalType] ?? defaultValue)
          : updater,
      }));
    },
    [animalType, setMap, defaultValue],
  );
  return [value, setValue] as const;
}

export function usePetCustomization() {
  const [petColor, setPetColor] = useAnimalMap(petColorsAtom, null as string | null);
  const [ownedColors, setOwnedColors] = useAnimalMap(ownedColorsAtom, [] as string[]);
  const [ownedAccessories, setOwnedAccessories] = useAnimalMap(ownedAccessoriesAtom, [] as string[]);
  const [equippedAccessory, setEquippedAccessory] = useAnimalMap(equippedAccessoriesAtom, null as string | null);

  return {
    petColor, setPetColor,
    ownedColors, setOwnedColors,
    ownedAccessories, setOwnedAccessories,
    equippedAccessory, setEquippedAccessory,
  };
}
