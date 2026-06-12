import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { AppState, Module, Notification } from '@/types';
import { modules, achievements } from '@/data';

type Action =
  | { type: 'COMPLETE_LESSON'; lessonId: string }
  | { type: 'COMPLETE_MODULE'; moduleId: string }
  | { type: 'COMPLETE_QUIZ'; quizId: string; score: number }
  | { type: 'SET_CURRENT_LESSON'; moduleId: string; lessonId: string }
  | { type: 'ADD_NOTIFICATION'; notification: Notification }
  | { type: 'REMOVE_NOTIFICATION'; id: string }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'ADD_IMPORTED_MODULE'; module: Module }
  | { type: 'TOGGLE_ADMIN' }
  | { type: 'UPDATE_STUDY_TIME'; minutes: number }
  | { type: 'UNLOCK_ACHIEVEMENT'; achievementId: string };

const initialState: AppState = {
  modules,
  userProgress: {
    completedLessons: ['js-1', 'js-2', 'js-3', 'react-1', 'react-2'],
    completedModules: ['js-fundamentals'],
    completedQuizzes: { 'quiz-js': 80 },
    currentModuleId: 'react-basics',
    currentLessonId: 'react-3',
    studyTimeMinutes: 360,
    dailyStreak: 5,
    lastStudyDate: '2026-06-11',
  },
  achievements,
  isAdmin: true,
  darkMode: false,
  sidebarOpen: true,
  notifications: [],
  importedModules: [],
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'COMPLETE_LESSON': {
      if (state.userProgress.completedLessons.includes(action.lessonId)) {
        return state;
      }
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          completedLessons: [...state.userProgress.completedLessons, action.lessonId],
        },
      };
    }
    case 'COMPLETE_MODULE': {
      if (state.userProgress.completedModules.includes(action.moduleId)) {
        return state;
      }
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          completedModules: [...state.userProgress.completedModules, action.moduleId],
        },
      };
    }
    case 'COMPLETE_QUIZ': {
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          completedQuizzes: {
            ...state.userProgress.completedQuizzes,
            [action.quizId]: action.score,
          },
        },
      };
    }
    case 'SET_CURRENT_LESSON': {
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          currentModuleId: action.moduleId,
          currentLessonId: action.lessonId,
        },
      };
    }
    case 'ADD_NOTIFICATION': {
      return {
        ...state,
        notifications: [...state.notifications, action.notification],
      };
    }
    case 'REMOVE_NOTIFICATION': {
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.id),
      };
    }
    case 'TOGGLE_DARK_MODE': {
      return { ...state, darkMode: !state.darkMode };
    }
    case 'TOGGLE_SIDEBAR': {
      return { ...state, sidebarOpen: !state.sidebarOpen };
    }
    case 'ADD_IMPORTED_MODULE': {
      return {
        ...state,
        importedModules: [...state.importedModules, action.module],
      };
    }
    case 'TOGGLE_ADMIN': {
      return { ...state, isAdmin: !state.isAdmin };
    }
    case 'UPDATE_STUDY_TIME': {
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          studyTimeMinutes: state.userProgress.studyTimeMinutes + action.minutes,
        },
      };
    }
    case 'UNLOCK_ACHIEVEMENT': {
      return {
        ...state,
        achievements: state.achievements.map((a) =>
          a.id === action.achievementId ? { ...a, unlockedAt: new Date().toISOString() } : a
        ),
      };
    }
    default:
      return state;
  }
}

interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  completeLesson: (lessonId: string) => void;
  completeQuiz: (quizId: string, score: number) => void;
  addNotification: (type: Notification['type'], message: string) => void;
  getModuleProgress: (moduleId: string) => number;
  getOverallProgress: () => number;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const completeLesson = useCallback((lessonId: string) => {
    dispatch({ type: 'COMPLETE_LESSON', lessonId });
  }, []);

  const completeQuiz = useCallback((quizId: string, score: number) => {
    dispatch({ type: 'COMPLETE_QUIZ', quizId, score });
  }, []);

  const addNotification = useCallback((type: Notification['type'], message: string) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      createdAt: Date.now(),
    };
    dispatch({ type: 'ADD_NOTIFICATION', notification });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', id: notification.id });
    }, 3000);
  }, []);

  const getModuleProgress = useCallback(
    (moduleId: string) => {
      const module = state.modules.find((m) => m.id === moduleId);
      if (!module) return 0;
      const completedLessons = module.lessons.filter((l) =>
        state.userProgress.completedLessons.includes(l.id)
      ).length;
      return Math.round((completedLessons / module.lessons.length) * 100);
    },
    [state.modules, state.userProgress.completedLessons]
  );

  const getOverallProgress = useCallback(() => {
    const totalLessons = state.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedLessons = state.userProgress.completedLessons.length;
    return Math.round((completedLessons / totalLessons) * 100);
  }, [state.modules, state.userProgress.completedLessons]);

  return (
    <StoreContext.Provider
      value={{
        state,
        dispatch,
        completeLesson,
        completeQuiz,
        addNotification,
        getModuleProgress,
        getOverallProgress,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
