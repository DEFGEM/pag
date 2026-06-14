export type Difficulty = 'basico' | 'intermedio' | 'avanzado';

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  duration: number; // minutos
  content: LessonContent[];
  order: number;
}

export type ContentType = 'text' | 'code' | 'summary' | 'tip';

export interface LessonContent {
  type: ContentType;
  content: string;
  language?: string; // para código
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  questions: Question[];
  passingScore: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // índice de la opción correcta
  explanation: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  thumbnail: string;
  lessons: Lesson[];
  quiz: Quiz;
  estimatedHours: number;
  order: number;
  category: string;
}

export interface Note {
  id: string;
  lessonId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  completedLessons: string[]; // IDs de lecciones completadas
  completedModules: string[]; // IDs de módulos completados
  completedQuizzes: { [quizId: string]: number }; // quizId -> score
  currentModuleId: string | null;
  currentLessonId: string | null;
  studyTimeMinutes: number;
  dailyStreak: number;
  lastStudyDate: string | null;
  notes: Note[];
  bookmarks: string[]; // lessonIds
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  condition: AchievementCondition;
}

export type AchievementCondition =
  | { type: 'complete_module'; moduleId: string }
  | { type: 'complete_quiz'; score: number }
  | { type: 'streak'; days: number }
  | { type: 'complete_all_modules' }
  | { type: 'study_time'; minutes: number };

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  createdAt: string;
}

export interface UsersData {
  [userId: string]: {
    user: User;
    progress: UserProgress;
    customModules: Module[]; // módulos creados por este usuario (solo él los ve)
  };
}

export interface AppSettings {
  isAdmin: boolean;
  darkMode: boolean;
  sidebarOpen: boolean;
}

export interface AppState {
  modules: Module[];
  userProgress: UserProgress;
  achievements: Achievement[];
  usersData: UsersData;
  currentUserId: string | null;
  isAdmin: boolean;
  darkMode: boolean;
  sidebarOpen: boolean;
  notifications: Notification[];
  importedModules: Module[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  createdAt: number;
}

export interface AdminStats {
  totalStudents: number;
  activeModules: number;
  completedEvaluations: number;
  passRate: number;
  studentProgress: { date: string; completed: number }[];
  modulePopularity: { moduleId: string; count: number }[];
  levelDistribution: { level: Difficulty; count: number }[];
}

export interface ImportConfig {
  name: string;
  difficulty: Difficulty;
  lessonCount: number;
  file: File | null;
}
