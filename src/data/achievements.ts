export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_level', title: 'První krok', description: 'Dokončení prvního levelu', emoji: '🌟' },
  { id: 'streak_3', title: '3x Combo', description: '3 správné odpovědi v řadě', emoji: '🔥' },
  { id: 'streak_5', title: '5x Combo', description: '5 správných odpovědí v řadě', emoji: '💥' },
  { id: 'all_standard', title: 'Znalec', description: 'Všechny standardní levely', emoji: '📚' },
  { id: 'pet_fed_10', title: 'Kuchař', description: 'Nakrmit mazlíčka 10x', emoji: '🍽️' },
  { id: 'pet_adult', title: 'Odchovatel', description: 'Mazlíček vyrostl na dospělého', emoji: '🐣' },
  { id: 'no_errors_level', title: 'Bezchybný', description: 'Level bez jediné chyby', emoji: '💎' },
  { id: 'speed_run', title: 'Blesk', description: 'Level do 30 sekund', emoji: '⚡' },
  { id: 'all_levels', title: 'Mistr', description: 'Všechny levely dokončeny', emoji: '🏆' },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
