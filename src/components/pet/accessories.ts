export interface AccessoryDef {
  id: string;
  name: string;
  emoji: string;
}

export const ACCESSORY_DEFS: Record<string, AccessoryDef> = {
  bow:        { id: 'bow',        name: 'Mašlička',   emoji: '🎀' },
  crown:      { id: 'crown',      name: 'Korunka',    emoji: '👑' },
  flower:     { id: 'flower',     name: 'Květinka',    emoji: '🌸' },
  hat:        { id: 'hat',        name: 'Klobouček',  emoji: '🎩' },
  star:       { id: 'star',       name: 'Hvězdička',  emoji: '⭐' },
  heart:      { id: 'heart',      name: 'Srdíčko',    emoji: '💖' },
};

export const ACCESSORY_LIST = Object.values(ACCESSORY_DEFS);
