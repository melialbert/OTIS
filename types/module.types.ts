export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  duration: string;
  totalXP: number;
  startDate: string;
  endDate: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  badge: string;
  weeks: Week[];
  theory: TheorySection;
  practice: PracticeSection;
  finalProject: FinalProject;
}

export interface Week {
  weekNumber: number;
  title: string;
  objective: string;
  days: Day[];
  totalXP: number;
}

export interface Day {
  dayNumber: number;
  title: string;
  activities: Activity[];
  duration: number;
  xp: number;
  completed: boolean;
}

export interface Activity {
  id: string;
  type: 'lecture' | 'video' | 'quiz' | 'exercise' | 'project';
  title: string;
  duration: number;
  xp: number;
  completed: boolean;
}

export interface TheorySection {
  title: string;
  sections: TheoryContent[];
}

export interface TheoryContent {
  id: string;
  title: string;
  content: string;
  images?: string[];
}

export interface PracticeSection {
  title: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  xp: number;
  completed: boolean;
}

export interface FinalProject {
  title: string;
  description: string;
  requirements: string[];
  criteria: EvaluationCriteria[];
  maxPoints: number;
  deadline: string;
}

export interface EvaluationCriteria {
  name: string;
  points: number;
  description: string;
}