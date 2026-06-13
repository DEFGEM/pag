import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { Progress } from '@/components/ui/progress';
import { difficultyBadge } from '@/lib/utils';
import {
  BookOpen,
  Clock,
  ClipboardCheck,
  Flame,
  Play,
  CheckCircle2,
  Lock,
  ChevronRight,
  Trophy,
  Star,
} from 'lucide-react';
import gsap from 'gsap';

export default function Dashboard() {
  const { state, getModuleProgress, getOverallProgress } = useStore();
  const currentUser = state.currentUserId ? state.usersData[state.currentUserId]?.user : null;
  const navigate = useNavigate();
  const cardsRef = useRef<HTMLDivElement>(null);
  const modulesRef = useRef<HTMLDivElement>(null);

  const { modules, userProgress, achievements } = state;
  const overallProgress = getOverallProgress();

  // Stats
  const completedModules = userProgress.completedModules.length;
  const totalModules = modules.length;
  const studyHours = Math.floor(userProgress.studyTimeMinutes / 60);
  const completedQuizzes = Object.keys(userProgress.completedQuizzes).length;
  const totalQuizzes = modules.length;
  const streak = userProgress.dailyStreak;

  // Active modules (in progress)
  const activeModules = modules.filter(
    (m) => !userProgress.completedModules.includes(m.id) && getModuleProgress(m.id) > 0
  );

  // Recommended next module
  const nextModule = modules.find(
    (m) => !userProgress.completedModules.includes(m.id) && getModuleProgress(m.id) === 0
  );

  // Recent achievements
  const recentAchievements = achievements
    .filter((a) => a.unlockedAt)
    .sort((a, b) => (b.unlockedAt || '').localeCompare(a.unlockedAt || ''))
    .slice(0, 3);

  useEffect(() => {
    // Animate stat cards
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.1 }
      );
    }
    // Animate module cards
    if (modulesRef.current) {
      gsap.fromTo(
        modulesRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.4 }
      );
    }
  }, []);

  const statCards = [
    {
      label: 'Módulos Completados',
      value: `${completedModules}/${totalModules}`,
      icon: BookOpen,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      label: 'Horas de Estudio',
      value: `${studyHours}h`,
      icon: Clock,
      color: 'text-teal-500',
      bg: 'bg-teal-50 dark:bg-teal-900/20',
    },
    {
      label: 'Evaluaciones Aprobadas',
      value: `${completedQuizzes}/${totalQuizzes}`,
      icon: ClipboardCheck,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      label: 'Racha Diaria',
      value: `${streak} días`,
      icon: Flame,
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 via-teal-500/5 to-purple-500/10 dark:from-indigo-900/20 dark:via-teal-900/10 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30 p-8">
        <div className="relative z-10">
          <h2 className="text-2xl font-medium text-stone-900 dark:text-stone-100">
            Hola, {currentUser?.name || 'Estudiante'} 👋
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mt-1">
            Continúa tu aprendizaje donde lo dejaste.
          </p>
          {/* Overall Progress */}
          <div className="mt-6 max-w-md">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-stone-600 dark:text-stone-400">Progreso General</span>
              <span className="font-medium text-stone-900 dark:text-stone-100">{overallProgress}%</span>
            </div>
            <div className="h-2.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div ref={cardsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-2xl font-medium text-stone-900 dark:text-stone-100">{stat.value}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div ref={modulesRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Modules */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Play size={18} className="text-indigo-500" />
            Módulos en Progreso
          </h3>

          {activeModules.length === 0 && (
            <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-6 text-center">
              <p className="text-stone-500 dark:text-stone-400">No tienes módulos en progreso.</p>
              <button
                onClick={() => navigate('/modules')}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Explorar Módulos
              </button>
            </div>
          )}

          {activeModules.map((mod) => {
            const progress = getModuleProgress(mod.id);
            const completedLessons = mod.lessons.filter((l) =>
              userProgress.completedLessons.includes(l.id)
            ).length;

            return (
              <div
                key={mod.id}
                onClick={() => navigate(`/modules/${mod.id}`)}
                className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-250 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={mod.thumbnail}
                    alt={mod.title}
                    className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${difficultyBadge(mod.difficulty)}`}>
                        {mod.difficulty}
                      </span>
                    </div>
                    <h4 className="font-medium text-stone-900 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {mod.title}
                    </h4>
                    <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">{mod.description}</p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                        <span>{completedLessons}/{mod.lessons.length} lecciones</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-stone-300 dark:text-stone-600 mt-1 flex-shrink-0" />
                </div>
              </div>
            );
          })}

          {/* Next Recommended Module */}
          {nextModule && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-3">
                <Star size={18} className="text-amber-500" />
                Recomendado para ti
              </h3>
              <div
                onClick={() => navigate(`/modules/${nextModule.id}`)}
                className="bg-white dark:bg-stone-800 rounded-xl border border-amber-200 dark:border-amber-800/40 p-5 hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-250 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={nextModule.thumbnail}
                    alt={nextModule.title}
                    className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${difficultyBadge(nextModule.difficulty)}`}>
                      {nextModule.difficulty}
                    </span>
                    <h4 className="font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mt-1">
                      {nextModule.title}
                    </h4>
                    <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{nextModule.description}</p>
                  </div>
                  <ChevronRight size={18} className="text-stone-300 dark:text-stone-600 mt-1 flex-shrink-0" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5">
            <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-4">
              <Trophy size={16} className="text-amber-500" />
              Logros Recientes
            </h3>
            {recentAchievements.length === 0 ? (
              <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-4">
                Completa módulos para desbloquear logros
              </p>
            ) : (
              <div className="space-y-3">
                {recentAchievements.map((ach) => (
                  <div key={ach.id} className="flex items-center gap-3">
                    <img src={ach.icon} alt={ach.title} className="w-10 h-10 object-contain" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{ach.title}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{ach.description}</p>
                    </div>
                    <CheckCircle2 size={16} className="text-teal-500 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate('/achievements')}
              className="w-full mt-4 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium transition-colors"
            >
              Ver todos los logros →
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5">
            <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-4">Próximas Evaluaciones</h3>
            <div className="space-y-3">
              {modules.slice(0, 4).map((mod) => {
                const quizDone = userProgress.completedQuizzes[mod.quiz.id];
                const canTake = mod.lessons.every((l) =>
                  userProgress.completedLessons.includes(l.id)
                );

                return (
                  <div key={mod.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      {quizDone ? (
                        <CheckCircle2 size={14} className="text-teal-500 flex-shrink-0" />
                      ) : canTake ? (
                        <Star size={14} className="text-amber-500 flex-shrink-0" />
                      ) : (
                        <Lock size={14} className="text-stone-300 dark:text-stone-600 flex-shrink-0" />
                      )}
                      <span className="text-sm text-stone-700 dark:text-stone-300 truncate">{mod.title}</span>
                    </div>
                    <span className="text-xs text-stone-500 dark:text-stone-400 flex-shrink-0 ml-2">
                      {quizDone ? `${quizDone}%` : canTake ? 'Lista' : 'Bloqueada'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
