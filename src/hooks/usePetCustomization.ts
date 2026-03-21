import { useCallback } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  petColorsAtom, ownedColorsAtom,
  ownedAccessoriesAtom, equippedAccessoriesAtom,
  animalTypeAtom,
} from '../store/atoms';

export function usePetCustomization() {
  const animalType = useAtomValue(animalTypeAtom);
  const [petColorsMap, setPetColorsMap] = useAtom(petColorsAtom);
  const [ownedColorsMap, setOwnedColorsMap] = useAtom(ownedColorsAtom);
  const [ownedAccessoriesMap, setOwnedAccessoriesMap] = useAtom(ownedAccessoriesAtom);
  const [equippedAccessoriesMap, setEquippedAccessoriesMap] = useAtom(equippedAccessoriesAtom);

  const petColor = petColorsMap[animalType] ?? null;
  const setPetColor = useCallback((color: string | null) => {
    setPetColorsMap(prev => ({ ...prev, [animalType]: color }));
  }, [animalType, setPetColorsMap]);

  const ownedColors = ownedColorsMap[animalType] ?? [];
  const setOwnedColors = useCallback((updater: (prev: string[]) => string[]) => {
    setOwnedColorsMap(prev => ({ ...prev, [animalType]: updater(prev[animalType] ?? []) }));
  }, [animalType, setOwnedColorsMap]);

  const ownedAccessories = ownedAccessoriesMap[animalType] ?? [];
  const setOwnedAccessories = useCallback((updater: (prev: string[]) => string[]) => {
    setOwnedAccessoriesMap(prev => ({ ...prev, [animalType]: updater(prev[animalType] ?? []) }));
  }, [animalType, setOwnedAccessoriesMap]);

  const equippedAccessory = equippedAccessoriesMap[animalType] ?? null;
  const setEquippedAccessory = useCallback((accId: string | null) => {
    setEquippedAccessoriesMap(prev => ({ ...prev, [animalType]: accId }));
  }, [animalType, setEquippedAccessoriesMap]);

  return {
    petColor, setPetColor,
    ownedColors, setOwnedColors,
    ownedAccessories, setOwnedAccessories,
    equippedAccessory, setEquippedAccessory,
  };
}
