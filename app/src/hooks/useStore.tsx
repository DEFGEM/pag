import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react';
import type { AppState, Module, Notification, UserProgress, UsersData, AppSettings } from '@/types';
import { modules, achievements } from '@/data';

const STORAGE_KEY_USERS = 'pag_users';
const STORAGE_KEY_CURRENT_USER = 'pag_current_user';
const STORAGE_KEY_SETTINGS = 'pag_settings';
const STORAGE_KEY_IMPORTED = 'pag_imported_modules';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

const defaultProgress: UserProgress = {
  completedLessons: [],
  completedModules: [],
  completedQuizzes: {},
  currentModuleId: null,
  currentLessonId: null,
  studyTimeMinutes: 0,
  dailyStreak: 0,
  lastStudyDate: null,
};

function getDefaultSettings(): AppSettings {
  return {
    isAdmin: false,
    darkMode: false,
    sidebarOpen: true,
  };
}

function initializeState(): AppState {
  const usersData = loadFromStorage<UsersData>(STORAGE_KEY_USERS, {});
  const currentUserId = loadFromStorage<string | null>(STORAGE_KEY_CURRENT_USER, null);
  const settings = loadFromStorage<AppSettings>(STORAGE_KEY_SETTINGS, getDefaultSettings());
  const importedModules = loadFromStorage<Module[]>(STORAGE_KEY_IMPORTED, []);

  const currentProgress = currentUserId && usersData[currentUserId]
    ? usersData[currentUserId].progress
    : defaultProgress;

  return {
    modules: [...modules, ...importedModules],
    userProgress: currentProgress,
    achievements,
    usersData,
    currentUserId,
    isAdmin: settings.isAdmin,
    darkMode: settings.darkMode,
    sidebarOpen: settings.sidebarOpen,
    notifications: [],
    importedModules,
  };
}

function persistProgress(usersData: UsersData, userId: string, progress: UserProgress) {
  if (usersData[userId]) {
    usersData[userId].progress = progress;
  }
  saveToStorage(STORAGE_KEY_USERS, usersData);
}

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
  | { type: 'DELETE_IMPORTED_MODULE'; moduleId: string }
  | { type: 'TOGGLE_ADMIN' }
  | { type: 'UPDATE_STUDY_TIME'; minutes: number }
  | { type: 'UNLOCK_ACHIEVEMENT'; achievementId: string }
  | { type: 'SET_USER'; userId: string }
  | { type: 'REGISTER_USER'; userId: string; userName: string }
  | { type: 'LOGOUT' };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'COMPLETE_LESSON': {
      if (state.userProgress.completedLessons.includes(action.lessonId)) {
        return state;
      }
      const newProgress = {
        ...state.userProgress,
        completedLessons: [...state.userProgress.completedLessons, action.lessonId],
      };
      return { ...state, userProgress: newProgress };
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
      const updatedImported = [...state.importedModules, action.module];
      return {
        ...state,
        importedModules: updatedImported,
        modules: [...modules, ...updatedImported],
      };
    }
    case 'DELETE_IMPORTED_MODULE': {
      const updatedImported = state.importedModules.filter((m) => m.id !== action.moduleId);
      return {
        ...state,
        importedModules: updatedImported,
        modules: [...modules, ...updatedImported],
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
    case 'SET_USER': {
      const userData = state.usersData[action.userId];
      return {
        ...state,
        currentUserId: action.userId,
        userProgress: userData ? userData.progress : defaultProgress,
      };
    }
    case 'REGISTER_USER': {
      const newUsersData: UsersData = {
        ...state.usersData,
        [action.userId]: {
          user: {
            id: action.userId,
            name: action.userName,
            createdAt: new Date().toISOString(),
          },
          progress: defaultProgress,
        },
      };
      return {
        ...state,
        usersData: newUsersData,
        currentUserId: action.userId,
        userProgress: defaultProgress,
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        currentUserId: null,
        userProgress: defaultProgress,
      };
    }
    default:
      return state;
  }
}

function saveAppState(state: AppState) {
  saveToStorage(STORAGE_KEY_SETTINGS, {
    isAdmin: state.isAdmin,
    darkMode: state.darkMode,
    sidebarOpen: state.sidebarOpen,
  });
  saveToStorage(STORAGE_KEY_CURRENT_USER, state.currentUserId);
  saveToStorage(STORAGE_KEY_USERS, state.usersData);
  saveToStorage(STORAGE_KEY_IMPORTED, state.importedModules);

  if (state.currentUserId && state.usersData[state.currentUserId]) {
    persistProgress(state.usersData, state.currentUserId, state.userProgress);
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
  setUser: (userId: string) => void;
  registerUser: (userId: string, userName: string) => void;
  logout: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, initializeState);

  useEffect(() => {
    saveAppState(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.usersData, state.currentUserId, state.userProgress, state.isAdmin, state.darkMode, state.sidebarOpen, state.importedModules]);

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

  const setUser = useCallback((userId: string) => {
    dispatch({ type: 'SET_USER', userId });
  }, []);

  const registerUser = useCallback((userId: string, userName: string) => {
    dispatch({ type: 'REGISTER_USER', userId, userName });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

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
        setUser,
        registerUser,
        logout,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

/* eslint-disable react-refresh/only-export-components */
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
