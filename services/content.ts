import { supabase } from './supabase';
import { Lesson, Quiz, QuizQuestion } from '@/types/content.types';

export const contentService = {
  async getLessonByActivityId(activityId: string): Promise<Lesson | null> {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('activity_id', activityId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching lesson:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getLessonByActivityId:', error);
      return null;
    }
  },

  async getQuizByActivityId(activityId: string): Promise<Quiz | null> {
    try {
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('activity_id', activityId)
        .maybeSingle();

      if (quizError || !quizData) {
        console.error('Error fetching quiz:', quizError);
        return null;
      }

      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizData.id)
        .order('question_number', { ascending: true });

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        return quizData;
      }

      return {
        ...quizData,
        questions: questionsData as QuizQuestion[],
      };
    } catch (error) {
      console.error('Error in getQuizByActivityId:', error);
      return null;
    }
  },

  async getAllLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', moduleId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching lessons:', error);
        return [];
      }

      return data as Lesson[];
    } catch (error) {
      console.error('Error in getAllLessonsByModuleId:', error);
      return [];
    }
  },

  async getAllQuizzesByModuleId(moduleId: string): Promise<Quiz[]> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('module_id', moduleId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching quizzes:', error);
        return [];
      }

      return data as Quiz[];
    } catch (error) {
      console.error('Error in getAllQuizzesByModuleId:', error);
      return [];
    }
  },
};
