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
  Sparkles,
  Target,
  Rocket,
} from 'lucide-react';
import gsap from 'gsap';

export default function Dashboard() {
  const { state, getModuleProgress, getOverallProgress } = useStore();
  const currentUser = state.currentUserId ? state.usersData[state.currentUserId]?.user : null;
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
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
  const completedLessonsTotal = userProgress.completedLessons.length;
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

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

  // Determine greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  useEffect(() => {
    // Animate hero
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
    // Animate stat cards
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.15 }
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
      label: 'Módulos',
      value: `${completedModules}/${totalModules}`,
      sublabel: 'completados',
      icon: BookOpen,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      gradient: 'from-indigo-500/10 to-purple-500/10',
    },
    {
      label: 'Horas',
      value: `${studyHours}h`,
      sublabel: 'de estudio',
      icon: Clock,
      color: 'text-teal-500',
      bg: 'bg-teal-50 dark:bg-teal-900/20',
      gradient: 'from-teal-500/10 to-emerald-500/10',
    },
    {
      label: 'Evaluaciones',
      value: `${completedQuizzes}/${totalQuizzes}`,
      sublabel: 'aprobadas',
      icon: ClipboardCheck,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      gradient: 'from-amber-500/10 to-orange-500/10',
    },
    {
      label: 'Racha',
      value: `${streak}`,
      sublabel: 'días seguidos',
      icon: Flame,
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      gradient: 'from-rose-500/10 to-pink-500/10',
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Hero */}
      <div
        ref={heroRef}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 via-teal-500/5 to-purple-500/10 dark:from-indigo-900/30 dark:via-teal-900/15 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30 p-8"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/5 dark:bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-teal-400/5 dark:bg-teal-500/10 rounded-full blur-2xl translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-indigo-500 animate-pulse" />
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Panel de aprendizaje
              </span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
              {getGreeting()}, {currentUser?.name || 'Estudiante'} 👋
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mt-1">
              {completedLessonsTotal === 0
                ? 'Comienza tu camino en el desarrollo móvil con React Native.'
                : `Has completado ${completedLessonsTotal} de ${totalLessons} lecciones. ¡Sigue adelante!`}
            </p>

            {/* Overall Progress */}
            <div className="mt-6 max-w-md">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                  <Target size={14} className="text-indigo-500" />
                  Progreso General
                </span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">{overallProgress}%</span>
              </div>
              <div className="h-3 bg-stone-200/80 dark:bg-stone-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500 rounded-full transition-all duration-1000 ease-out animate-gradient"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5 text-[11px] text-stone-400 dark:text-stone-500">
                <span>{completedLessonsTotal} lecciones completadas</span>
                <span>{totalLessons - completedLessonsTotal} restantes</span>
              </div>
            </div>
          </div>

          {/* Quick action */}
          {(activeModules.length > 0 || nextModule) && (
            <button
              onClick={() => {
                if (activeModules.length > 0) {
                  navigate(`/modules/${activeModules[0].id}`);
                } else if (nextModule) {
                  navigate(`/modules/${nextModule.id}`);
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all cursor-pointer"
            >
              <Rocket size={16} />
              {activeModules.length > 0 ? 'Continuar Aprendiendo' : 'Comenzar Módulo'}
            </button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div ref={cardsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5 card-hover group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} dark:${stat.bg} flex items-center justify-center`}>
                  <Icon size={20} className={stat.color} />
                </div>
                <span className={`text-xs font-medium ${stat.color} opacity-60`}>
                  {stat.sublabel}
                </span>
              </div>
              <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-3">
                {stat.value}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div ref={modulesRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Modules */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Play size={18} className="text-indigo-500" />
            Módulos en Progreso
          </h3>

          {activeModules.length === 0 && (
            <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mx-auto mb-3">
                <BookOpen size={24} className="text-indigo-400" />
              </div>
              <p className="text-stone-500 dark:text-stone-400">No tienes módulos en progreso.</p>
              <p className="text-sm text-stone-400 dark:text-stone-500 mt-1">
                Empieza tu primer módulo y comienza a aprender.
              </p>
              <button
                onClick={() => navigate('/modules')}
                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all cursor-pointer shadow-md shadow-indigo-500/20"
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
                className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-250 cursor-pointer group card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={24} className="text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${difficultyBadge(mod.difficulty)}`}>
                        {mod.difficulty}
                      </span>
                      <span className="text-[11px] text-stone-400 dark:text-stone-500">{mod.category}</span>
                    </div>
                    <h4 className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {mod.title}
                    </h4>
                    <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">{mod.description}</p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                        <span>{completedLessons}/{mod.lessons.length} lecciones</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-stone-300 dark:text-stone-600 mt-1 flex-shrink-0 group-hover:text-indigo-500 transition-colors" />
                </div>
              </div>
            );
          })}

          {/* Next Recommended Module */}
          {nextModule && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-3">
                <Star size={18} className="text-amber-500" />
                Recomendado para ti
              </h3>
              <div
                onClick={() => navigate(`/modules/${nextModule.id}`)}
                className="bg-white dark:bg-stone-800 rounded-xl border border-amber-200 dark:border-amber-800/40 p-5 hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-250 cursor-pointer group card-hover relative overflow-hidden"
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 dark:from-amber-900/10 dark:to-orange-900/10 pointer-events-none" />
                <div className="relative flex items-start gap-4">
                  <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
                    <Rocket size={24} className="text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${difficultyBadge(nextModule.difficulty)}`}>
                      {nextModule.difficulty}
                    </span>
                    <h4 className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mt-1">
                      {nextModule.title}
                    </h4>
                    <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{nextModule.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-stone-400 dark:text-stone-500">
                      <span className="flex items-center gap-1"><BookOpen size={12} /> {nextModule.lessons.length} lecciones</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {nextModule.estimatedHours}h</span>
                    </div>
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
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-4">
              <Trophy size={16} className="text-amber-500" />
              Logros Recientes
            </h3>
            {recentAchievements.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mx-auto mb-2">
                  <Trophy size={24} className="text-amber-300" />
                </div>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Completa módulos para desbloquear logros
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAchievements.map((ach) => (
                  <div key={ach.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
                      <Trophy size={16} className="text-amber-500" />
                    </div>
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
              className="w-full mt-4 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium transition-colors cursor-pointer py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              Ver todos los logros →
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-4">Próximas Evaluaciones</h3>
            <div className="space-y-3">
              {modules.slice(0, 5).map((mod) => {
                const quizDone = userProgress.completedQuizzes[mod.quiz.id];
                const canTake = mod.lessons.every((l) =>
                  userProgress.completedLessons.includes(l.id)
                );

                return (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700/30 transition-colors cursor-pointer"
                    onClick={() => {
                      if (quizDone || canTake) navigate(`/modules/${mod.id}/quiz`);
                      else navigate(`/modules/${mod.id}`);
                    }}
                  >
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
                    <span className={`text-xs flex-shrink-0 ml-2 font-medium px-2 py-0.5 rounded-full ${
                      quizDone ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400'
                      : canTake ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                      : 'text-stone-400 dark:text-stone-500'
                    }`}>
                      {quizDone ? `${quizDone}%` : canTake ? 'Lista' : 'Bloqueada'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Learning Path CTA */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border border-indigo-200/50 dark:border-indigo-800/30 p-5">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-2">
              Ruta de Aprendizaje
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
              15 módulos organizados desde JavaScript hasta arquitecturas avanzadas.
            </p>
            <button
              onClick={() => navigate('/modules')}
              className="w-full py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-white/50 dark:bg-stone-800/50 rounded-lg hover:bg-white dark:hover:bg-stone-800 transition-colors cursor-pointer border border-indigo-200/50 dark:border-indigo-700/30"
            >
              Ver ruta completa →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
