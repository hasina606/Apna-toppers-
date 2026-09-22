export type StudentClass =
  | 'Nursery'
  | 'LKG'
  | 'UKG'
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10;

export type SubjectId =
  | 'maths'
  | 'social_science'
  | 'science'
  | 'english_grammar'
  | 'english_speaking'
  | 'hindi'
  | 'assamese'
  | 'social';

export type LanguageCode = 'en' | 'hi' | 'as';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type MathTopic =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'tables'
  | 'fractions'
  | 'decimals'
  | 'integers'
  | 'percentage'
  | 'algebra'
  | 'geometry'
  | 'word_problems'
  | 'social_studies';

export interface SocialChapterQA {
  id: string;
  question: string;
  answer: string;
  type?: 'short' | 'mcq' | 'descriptive' | 'fill';
  options?: string[];
  correctOptionIndex?: number;
}

export interface SocialScienceChapter {
  chapterNumber: number;
  title: string;
  titleEn: string;
  icon: string;
  summary: string;
  questions: SocialChapterQA[];
}

export interface Question {
  id: string;
  class: StudentClass;
  topic: MathTopic;
  topicTitle: string;
  difficulty: Difficulty;
  question: string;
  options: (number | string)[];
  correctAnswer: number | string;
  explanation: string;
  hint: string;
}

export interface LevelConfig {
  id: number;
  name: string;
  difficulty: Difficulty;
  description: string;
  requiredAccuracy: number; // percentage needed to unlock next
  topics: MathTopic[];
  unlocksLevelId?: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
  maxProgress: number;
}

export interface TopicStat {
  total: number;
  correct: number;
}

export interface StudentProfile {
  username: string;
  class: StudentClass;
  avatarId: string;
  currentSubject: SubjectId;
  language: LanguageCode;
  darkMode: boolean;
  xp: number;
  coins: number;
  currentLevel: number;
  unlockedLevels: number[]; // e.g. [1, 2, ... 50]
  levelHighScores: Record<number, { score: number; accuracy: number; stars: number }>;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalQuestionsSolved: number;
  totalCorrectAnswers: number;
  difficultyStats: Record<Difficulty, { total: number; correct: number }>;
  topicStats: Record<string, TopicStat>;
  badges: Badge[];
  dailyChallengeCompletedDate?: string;
  soundEnabled: boolean;
}

export type ScreenType =
  | 'splash'
  | 'username'
  | 'class_select'
  | 'subjects'
  | 'home'
  | 'level_select'
  | 'gameplay'
  | 'practice'
  | 'daily_challenge'
  | 'level_complete'
  | 'game_over'
  | 'progress'
  | 'badges'
  | 'leaderboard'
  | 'profile'
  | 'social_qa_reader'
  | 'admin';

export interface StudentActivityItem {
  id: string;
  levelName: string;
  subject: string;
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  xpEarned: number;
  coinsEarned?: number;
  starsEarned?: number;
  timeSpentSeconds: number;
  isDailyChallenge?: boolean;
  timestamp: number;
}

export interface AdminStudentSummary {
  id: string;
  username: string;
  class: StudentClass;
  avatarId: string;
  currentSubject: SubjectId;
  language: LanguageCode;
  xp: number;
  coins: number;
  currentLevel: number;
  totalGamesPlayed: number;
  accuracy: number;
  totalQuestionsSolved: number;
  totalCorrectAnswers: number;
  streak: number;
  joinDate: string;
  lastActive: string;
  recentActivities: StudentActivityItem[];
  rank?: number;
  totalTimeSpentSeconds?: number;
}

export interface AdminOverviewData {
  totalStudents: number;
  totalGamesPlayed: number;
  overallAccuracy: number;
  totalXp: number;
  classCounts: Record<string, number>;
  students: AdminStudentSummary[];
}

export interface GameResult {
  levelId: number;
  levelName: string;
  difficulty: Difficulty;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeSpentSeconds: number;
  xpEarned: number;
  coinsEarned: number;
  starsEarned: number;
  newLevelUnlocked: number | null;
  isDailyChallenge?: boolean;
}
