export interface LessonSection {
  title: string;
  content: string;
}

export interface Resource {
  type: string;
  title: string;
  url?: string;
}

export interface Lesson {
  id: string;
  activity_id: string;
  module_id: string;
  title: string;
  content_type: string;
  introduction: string | null;
  sections: LessonSection[];
  key_points: string[];
  practical_tips: string[];
  resources: Resource[];
  created_at: string;
  updated_at: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_number: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false';
  options: QuizOption[];
  correct_answer: string;
  explanation: string | null;
  points: number;
  created_at: string;
}

export interface Quiz {
  id: string;
  activity_id: string;
  module_id: string;
  title: string;
  description: string | null;
  passing_score: number;
  time_limit: number | null;
  questions?: QuizQuestion[];
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  quiz_id: string;
  user_id: string;
  answers: { [questionId: string]: string };
  score: number;
  passed: boolean;
  completed_at: string;
}
