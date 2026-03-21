import type { AnimalType, PetStage } from '../../types';

export interface AccessoryDef {
  id: string;
  name: string;
  emoji: string;
  slot: 'head' | 'eyes' | 'neck';
  svg: string;
}

export const ACCESSORY_DEFS: Record<string, AccessoryDef> = {
  partyHat: {
    id: 'partyHat',
    name: 'Party Hat',
    emoji: '🎉',
    slot: 'head',
    svg: `<svg viewBox="0 0 40 40" width="40" height="40">
      <polygon points="20,2 6,36 34,36" fill="#FF6B6B" stroke="#E55555" stroke-width="1.5"/>
      <circle cx="20" cy="2" r="3" fill="#FFD700"/>
      <line x1="10" y1="22" x2="30" y2="22" stroke="#FFD700" stroke-width="2"/>
      <line x1="8" y1="28" x2="32" y2="28" stroke="#4FC3F7" stroke-width="2"/>
    </svg>`,
  },
  crown: {
    id: 'crown',
    name: 'Crown',
    emoji: '👑',
    slot: 'head',
    svg: `<svg viewBox="0 0 44 30" width="44" height="30">
      <polygon points="2,28 6,8 14,18 22,2 30,18 38,8 42,28" fill="#FFD700" stroke="#DAA520" stroke-width="1.5"/>
      <circle cx="14" cy="16" r="2.5" fill="#E53935"/>
      <circle cx="22" cy="6" r="2.5" fill="#4FC3F7"/>
      <circle cx="30" cy="16" r="2.5" fill="#66BB6A"/>
      <rect x="2" y="26" width="40" height="4" rx="2" fill="#DAA520"/>
    </svg>`,
  },
  sunglasses: {
    id: 'sunglasses',
    name: 'Sunglasses',
    emoji: '😎',
    slot: 'eyes',
    svg: `<svg viewBox="0 0 50 22" width="50" height="22">
      <rect x="2" y="4" width="18" height="14" rx="4" fill="#212121" opacity="0.85"/>
      <rect x="30" y="4" width="18" height="14" rx="4" fill="#212121" opacity="0.85"/>
      <path d="M20 10 Q25 14 30 10" stroke="#212121" stroke-width="2" fill="none"/>
      <line x1="2" y1="8" x2="-4" y2="6" stroke="#212121" stroke-width="2" stroke-linecap="round"/>
      <line x1="48" y1="8" x2="54" y2="6" stroke="#212121" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  roundGlasses: {
    id: 'roundGlasses',
    name: 'Round Glasses',
    emoji: '🤓',
    slot: 'eyes',
    svg: `<svg viewBox="0 0 50 22" width="50" height="22">
      <circle cx="13" cy="11" r="9" fill="none" stroke="#5D4037" stroke-width="2.5"/>
      <circle cx="37" cy="11" r="9" fill="none" stroke="#5D4037" stroke-width="2.5"/>
      <path d="M22 11 Q25 14 28 11" stroke="#5D4037" stroke-width="2" fill="none"/>
      <line x1="4" y1="8" x2="-2" y2="6" stroke="#5D4037" stroke-width="2" stroke-linecap="round"/>
      <line x1="46" y1="8" x2="52" y2="6" stroke="#5D4037" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  bowTie: {
    id: 'bowTie',
    name: 'Bow Tie',
    emoji: '🎀',
    slot: 'neck',
    svg: `<svg viewBox="0 0 40 24" width="40" height="24">
      <polygon points="20,12 2,2 2,22" fill="#E53935"/>
      <polygon points="20,12 38,2 38,22" fill="#E53935"/>
      <circle cx="20" cy="12" r="4" fill="#C62828"/>
    </svg>`,
  },
  scarf: {
    id: 'scarf',
    name: 'Scarf',
    emoji: '🧣',
    slot: 'neck',
    svg: `<svg viewBox="0 0 50 28" width="50" height="28">
      <path d="M4 6 Q25 16 46 6" stroke="#4CAF50" stroke-width="8" fill="none" stroke-linecap="round"/>
      <rect x="18" y="10" width="10" height="18" rx="3" fill="#4CAF50"/>
      <line x1="18" y1="16" x2="28" y2="16" stroke="#388E3C" stroke-width="1.5"/>
      <line x1="18" y1="22" x2="28" y2="22" stroke="#388E3C" stroke-width="1.5"/>
    </svg>`,
  },
  flower: {
    id: 'flower',
    name: 'Flower',
    emoji: '🌸',
    slot: 'head',
    svg: `<svg viewBox="0 0 30 30" width="30" height="30">
      <circle cx="15" cy="8" r="6" fill="#F48FB1"/>
      <circle cx="9" cy="14" r="6" fill="#F48FB1"/>
      <circle cx="21" cy="14" r="6" fill="#F48FB1"/>
      <circle cx="11" cy="21" r="6" fill="#F48FB1"/>
      <circle cx="19" cy="21" r="6" fill="#F48FB1"/>
      <circle cx="15" cy="15" r="4" fill="#FFD54F"/>
    </svg>`,
  },
  pirateHat: {
    id: 'pirateHat',
    name: 'Pirate Hat',
    emoji: '🏴‍☠️',
    slot: 'head',
    svg: `<svg viewBox="0 0 50 36" width="50" height="36">
      <ellipse cx="25" cy="32" rx="24" ry="5" fill="#212121"/>
      <path d="M6 32 Q8 10 25 6 Q42 10 44 32" fill="#212121"/>
      <circle cx="25" cy="18" r="5" fill="none" stroke="white" stroke-width="1.5"/>
      <line x1="22" y1="15" x2="28" y2="21" stroke="white" stroke-width="1.5"/>
      <line x1="28" y1="15" x2="22" y2="21" stroke="white" stroke-width="1.5"/>
    </svg>`,
  },
};

export const ACCESSORY_LIST = Object.values(ACCESSORY_DEFS);

// Positions per slot, per animal, per stage (top/left offsets for overlay)
type PosMap = Record<string, Record<AnimalType, Record<PetStage, React.CSSProperties>>>;

const SLOT_POSITIONS: PosMap = {
  head: {
    chick: {
      small: { top: '-18px', left: '50%', transform: 'translateX(-50%)' },
      medium: { top: '-16px', left: '50%', transform: 'translateX(-50%)' },
      adult: { top: '-22px', left: '58%', transform: 'translateX(-50%)' },
    },
    fox: {
      small: { top: '-22px', left: '50%', transform: 'translateX(-50%)' },
      medium: { top: '-24px', left: '50%', transform: 'translateX(-50%)' },
      adult: { top: '-28px', left: '50%', transform: 'translateX(-50%)' },
    },
    lion: {
      small: { top: '-22px', left: '50%', transform: 'translateX(-50%)' },
      medium: { top: '-28px', left: '50%', transform: 'translateX(-50%)' },
      adult: { top: '-32px', left: '50%', transform: 'translateX(-50%)' },
    },
  },
  eyes: {
    chick: {
      small: { top: '22px', left: '50%', transform: 'translateX(-50%)' },
      medium: { top: '24px', left: '50%', transform: 'translateX(-50%)' },
      adult: { top: '6px', left: '58%', transform: 'translateX(-50%)' },
    },
    fox: {
      small: { top: '8px', left: '50%', transform: 'translateX(-50%)' },
      medium: { top: '6px', left: '50%', transform: 'translateX(-50%)' },
      adult: { top: '2px', left: '50%', transform: 'translateX(-50%)' },
    },
    lion: {
      small: { top: '8px', left: '50%', transform: 'translateX(-50%)' },
      medium: { top: '4px', left: '50%', transform: 'translateX(-50%)' },
      adult: { top: '0px', left: '50%', transform: 'translateX(-50%)' },
    },
  },
  neck: {
    chick: {
      small: { top: '56px', left: '50%', transform: 'translateX(-50%)' },
      medium: { top: '64px', left: '50%', transform: 'translateX(-50%)' },
      adult: { top: '36px', left: '56%', transform: 'translateX(-50%)' },
    },
    fox: {
      small: { top: '46px', left: '50%', transform: 'translateX(-50%)' },
      medium: { top: '50px', left: '50%', transform: 'translateX(-50%)' },
      adult: { top: '52px', left: '50%', transform: 'translateX(-50%)' },
    },
    lion: {
      small: { top: '46px', left: '50%', transform: 'translateX(-50%)' },
      medium: { top: '52px', left: '50%', transform: 'translateX(-50%)' },
      adult: { top: '54px', left: '50%', transform: 'translateX(-50%)' },
    },
  },
};

export function getAccessoryPosition(
  accessoryId: string,
  animalType: AnimalType,
  stage: PetStage,
): React.CSSProperties {
  const def = ACCESSORY_DEFS[accessoryId];
  if (!def) return {};
  return SLOT_POSITIONS[def.slot]?.[animalType]?.[stage] ?? {};
}
