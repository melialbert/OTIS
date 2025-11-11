export interface Progress {
  moduleId: string;
  currentWeek: number;
  currentDay: number;
  completedActivities: string[];
  earnedXP: number;
  earnedBadges: string[];
  startedAt: string;
  lastAccessedAt: string;
  completionPercentage: number;
}

export interface DailyProgress {
  date: string;
  xpEarned: number;
  activitiesCompleted: number;
  timeSpent: number;
}