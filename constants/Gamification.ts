import { Badge } from '@/types/user.types';

export const XP_PER_LEVEL = 500;

export const calculateLevel = (totalXP: number): number => {
  return Math.floor(totalXP / XP_PER_LEVEL) + 1;
};

export const calculateXPForNextLevel = (totalXP: number): number => {
  const currentLevel = calculateLevel(totalXP);
  return currentLevel * XP_PER_LEVEL;
};

export const calculateCurrentLevelXP = (totalXP: number): number => {
  const previousLevelXP = (calculateLevel(totalXP) - 1) * XP_PER_LEVEL;
  return totalXP - previousLevelXP;
};

export const ALL_BADGES: Badge[] = [
  {
    id: 'first-step',
    name: 'Premier Pas',
    description: 'Terminer la Semaine 1 d\'un module',
    icon: '🎓',
    unlockedAt: '',
    rarity: 'common',
  },
  {
    id: 'technician',
    name: 'Technicien',
    description: 'Réussir tous les exercices techniques',
    icon: '📸',
    unlockedAt: '',
    rarity: 'rare',
  },
  {
    id: 'light-hunter',
    name: 'Chasseur de Lumière',
    description: 'Shooting Golden Hour validé',
    icon: '🌅',
    unlockedAt: '',
    rarity: 'rare',
  },
  {
    id: 'visual-artist',
    name: 'Artiste Visuel',
    description: 'Score ≥ 85/100 au projet final',
    icon: '🎨',
    unlockedAt: '',
    rarity: 'epic',
  },
  {
    id: 'eagle-eye',
    name: 'Œil d\'Aigle',
    description: 'Compléter le module Photographie',
    icon: '🏆',
    unlockedAt: '',
    rarity: 'legendary',
  },
  {
    id: 'perfectionist',
    name: 'Perfectionniste',
    description: '100% de validation sans refaire d\'exercice',
    icon: '⚡',
    unlockedAt: '',
    rarity: 'legendary',
  },
];