export type RewardType = 'food' | 'color' | 'accessory' | 'growth' | 'bonus';

export interface Reward {
  emoji: string;
  title: string;
  description: string;
  type: RewardType;
  /** ID of the item to unlock (food emoji, color id, accessory id) */
  unlockId?: string;
  points?: number;
}

/**
 * Progressive rewards - each game group completion unlocks something new.
 * Cycle: STANDARD → GAME → AWARD
 */
export const REWARDS: Reward[] = [
  // 1. first reward: new food
  { emoji: '🍎', title: 'Nové jídlo!', description: 'Odemkl/a jsi jablíčko pro zvířátko!', type: 'food', unlockId: '🍎' },
  // 2. first color
  { emoji: '🩷', title: 'Nová barva!', description: 'Růžová barva pro zvířátko!', type: 'color', unlockId: 'pink' },
  // 3. first accessory
  { emoji: '🎀', title: 'Nový doplněk!', description: 'Mašlička pro zvířátko!', type: 'accessory', unlockId: 'bow' },
  // 4. growth
  { emoji: '🌱', title: 'Zvířátko roste!', description: 'Tvoje zvířátko vyrostlo!', type: 'growth' },
  // 5. cake
  { emoji: '🎂', title: 'Dort!', description: 'Odemkl/a jsi dort pro zvířátko!', type: 'food', unlockId: '🎂' },
  // 6. blue color
  { emoji: '💙', title: 'Modrá barva!', description: 'Nová modrá barva pro zvířátko!', type: 'color', unlockId: 'blue' },
  // 7. crown
  { emoji: '👑', title: 'Korunka!', description: 'Královská korunka pro zvířátko!', type: 'accessory', unlockId: 'crown' },
  // 8. bonus points
  { emoji: '💰', title: 'Bonus!', description: '+50 bodů za skvělou práci!', type: 'bonus', points: 50 },
  // 9. green color
  { emoji: '💚', title: 'Zelená barva!', description: 'Nová zelená barva!', type: 'color', unlockId: 'green' },
  // 10. flower
  { emoji: '🌸', title: 'Květinka!', description: 'Krásná květinka pro zvířátko!', type: 'accessory', unlockId: 'flower' },
  // 11. growth again
  { emoji: '🌱', title: 'Zvířátko roste!', description: 'Tvoje zvířátko je ještě větší!', type: 'growth' },
  // 12. hat
  { emoji: '🎩', title: 'Klobouček!', description: 'Elegantní klobouček!', type: 'accessory', unlockId: 'hat' },
  // 13. purple
  { emoji: '💜', title: 'Fialová barva!', description: 'Nová fialová barva!', type: 'color', unlockId: 'purple' },
  // 14. star
  { emoji: '⭐', title: 'Hvězdička!', description: 'Zářivá hvězdička pro zvířátko!', type: 'accessory', unlockId: 'star' },
  // 15. big bonus
  { emoji: '💰', title: 'Velký bonus!', description: '+100 bodů za vynikající práci!', type: 'bonus', points: 100 },
  // 16. gold color
  { emoji: '💛', title: 'Zlatá barva!', description: 'Zlatá barva pro zvířátko!', type: 'color', unlockId: 'gold' },
  // 17. heart
  { emoji: '💖', title: 'Srdíčko!', description: 'Srdíčko plné lásky!', type: 'accessory', unlockId: 'heart' },
  // 18. red
  { emoji: '❤️', title: 'Červená barva!', description: 'Ohnivě červená barva!', type: 'color', unlockId: 'red' },
  // 19. cyan
  { emoji: '🩵', title: 'Tyrkysová!', description: 'Nová tyrkysová barva!', type: 'color', unlockId: 'cyan' },
  // 20. orange
  { emoji: '🧡', title: 'Oranžová!', description: 'Nová oranžová barva!', type: 'color', unlockId: 'orange' },
];

export function getRewardForGroup(gameGroupIndex: number): Reward {
  return REWARDS[gameGroupIndex % REWARDS.length];
}

/** Get all unlockIds from claimed rewards up to given index */
export function getUnlockedIds(claimedIndices: number[]): {
  foods: Set<string>;
  colors: Set<string>;
  accessories: Set<string>;
} {
  const foods = new Set<string>(['🌾']); // grain always available
  const colors = new Set<string>();
  const accessories = new Set<string>();

  for (const idx of claimedIndices) {
    const reward = REWARDS[idx % REWARDS.length];
    if (!reward?.unlockId) continue;
    if (reward.type === 'food') foods.add(reward.unlockId);
    if (reward.type === 'color') colors.add(reward.unlockId);
    if (reward.type === 'accessory') accessories.add(reward.unlockId);
  }

  return { foods, colors, accessories };
}
