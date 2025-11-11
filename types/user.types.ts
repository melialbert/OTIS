export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  totalXP: number;
  currentXP: number;
  xpToNextLevel: number;
  badges: Badge[];
  completedModules: string[];
  currentModule?: string;
  joinedDate: string;
  skills: Skill[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Skill {
  name: string;
  level: number;
  maxLevel: number;
}