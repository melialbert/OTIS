/*
  # Création des tables pour les leçons et quiz
  
  1. Nouvelles Tables
    - `lessons` : Contenu détaillé des leçons
      - `id` (uuid, primary key)
      - `activity_id` (text, unique) - ID de l'activité correspondante
      - `module_id` (text) - ID du module
      - `title` (text) - Titre de la leçon
      - `content_type` (text) - Type de contenu (lecture, video, exercise, project)
      - `introduction` (text) - Introduction
      - `sections` (jsonb) - Sections du contenu avec titres et textes
      - `key_points` (jsonb) - Points clés à retenir
      - `practical_tips` (jsonb) - Conseils pratiques
      - `resources` (jsonb) - Ressources supplémentaires
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `quizzes` : Quiz d'évaluation
      - `id` (uuid, primary key)
      - `activity_id` (text, unique) - ID de l'activité correspondante
      - `module_id` (text) - ID du module
      - `title` (text) - Titre du quiz
      - `description` (text) - Description
      - `passing_score` (integer) - Score minimum pour réussir (en %)
      - `time_limit` (integer) - Temps limite en minutes (optionnel)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `quiz_questions` : Questions des quiz
      - `id` (uuid, primary key)
      - `quiz_id` (uuid, foreign key) - Référence au quiz
      - `question_number` (integer) - Numéro d'ordre de la question
      - `question_text` (text) - Texte de la question
      - `question_type` (text) - Type de question (multiple_choice, true_false)
      - `options` (jsonb) - Options de réponse
      - `correct_answer` (text) - Réponse correcte
      - `explanation` (text) - Explication de la réponse
      - `points` (integer) - Points attribués pour cette question
      - `created_at` (timestamptz)
  
  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques pour permettre la lecture à tous les utilisateurs authentifiés
    - Seuls les admins peuvent écrire (à implémenter plus tard)
*/

-- Table des leçons
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id text UNIQUE NOT NULL,
  module_id text NOT NULL,
  title text NOT NULL,
  content_type text NOT NULL,
  introduction text,
  sections jsonb DEFAULT '[]'::jsonb,
  key_points jsonb DEFAULT '[]'::jsonb,
  practical_tips jsonb DEFAULT '[]'::jsonb,
  resources jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tous les utilisateurs peuvent lire les leçons"
  ON lessons FOR SELECT
  TO public
  USING (true);

-- Table des quiz
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id text UNIQUE NOT NULL,
  module_id text NOT NULL,
  title text NOT NULL,
  description text,
  passing_score integer DEFAULT 70,
  time_limit integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tous les utilisateurs peuvent lire les quiz"
  ON quizzes FOR SELECT
  TO public
  USING (true);

-- Table des questions de quiz
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_number integer NOT NULL,
  question_text text NOT NULL,
  question_type text NOT NULL DEFAULT 'multiple_choice',
  options jsonb DEFAULT '[]'::jsonb,
  correct_answer text NOT NULL,
  explanation text,
  points integer DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  UNIQUE(quiz_id, question_number)
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tous les utilisateurs peuvent lire les questions"
  ON quiz_questions FOR SELECT
  TO public
  USING (true);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_lessons_activity_id ON lessons(activity_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_activity_id ON quizzes(activity_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_module_id ON quizzes(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
