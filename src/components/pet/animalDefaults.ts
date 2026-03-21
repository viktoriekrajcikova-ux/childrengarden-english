import type { AnimalType } from '../../types';
import { derivePalette, type ColorPalette } from '../../utils/colorUtils';

interface AnimalColors {
  body: string;
  accent: string;
  outline?: string;
  mane?: string;
  maneBump?: string;
}

const DEFAULTS: Record<AnimalType, AnimalColors> = {
  chick: { body: '#FFD54F', accent: '#FFC107', outline: '#F9A825' },
  fox: { body: '#E67E22', accent: '#FFCC80' },
  lion: { body: '#D4A017', accent: '#C69214', mane: '#8B6914', maneBump: '#A07A14' },
};

export interface ResolvedPalette extends AnimalColors {
  palette: ColorPalette | null;
}

/** Resolves body color override into a full color set for an animal SVG. */
export function resolveColors(animalType: AnimalType, bodyColor?: string): ResolvedPalette {
  const defaults = DEFAULTS[animalType];
  if (!bodyColor) {
    return { ...defaults, palette: null };
  }
  const palette = derivePalette(bodyColor);
  return {
    body: palette.body,
    accent: palette.accent,
    outline: palette.outline,
    mane: palette.outline,
    maneBump: palette.accent,
    palette,
  };
}
