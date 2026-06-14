import { adminStats } from '@/data';
import { useStore } from '@/hooks/useStore';
import { Users, BookOpen, ClipboardCheck, TrendingUp, BarChart3 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AdminStats() {
  const { state } = useStore();
  const cardsRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);
  const stats = adminStats;

  // Compute live state metrics
  const liveUsersCount = Object.keys(state.usersData).length;
  // Fallback to mock base if 0, otherwise add to base stats
  const totalStudents = stats.totalStudents + liveUsersCount;
  const activeModulesCount = state.modules.length;
  
  // Calculate completed quizzes by all users
  const totalCompletedQuizzes = Object.values(state.usersData).reduce((acc, user) => {
    return acc + Object.keys(user.progress.completedQuizzes).length;
  }, 0);
  const completedEvaluations = stats.completedEvaluations + totalCompletedQuizzes;

  useEffect(() => {
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
    if (chartsRef.current) {
      gsap.fromTo(
        chartsRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
      );
    }
  }, []);

  const statCards = [
    {
      label: 'Total Estudiantes',
      value: totalStudents.toLocaleString(),
      icon: Users,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      trend: '+12%',
    },
    {
      label: 'Módulos Activos',
      value: activeModulesCount.toString(),
      icon: BookOpen,
      color: 'text-teal-500',
      bg: 'bg-teal-50 dark:bg-teal-900/20',
      trend: `+${state.importedModules.length}`,
    },
    {
      label: 'Evaluaciones Completadas',
      value: completedEvaluations.toLocaleString(),
      icon: ClipboardCheck,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      trend: `+${totalCompletedQuizzes}`,
    },
    {
      label: 'Tasa de Aprobación',
      value: `${stats.passRate}%`,
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
      trend: '+5%',
    },
  ];

  // Line chart data - student progress over time
  const maxProgress = Math.max(...stats.studentProgress.map((d) => d.completed));
  const minProgress = Math.min(...stats.studentProgress.map((d) => d.completed));
  const progressRange = maxProgress - minProgress || 1;

  // Module popularity chart (include imported modules with mock count for visualization)
  const dynamicModulePopularity = [
    ...stats.modulePopularity,
    ...state.importedModules.map((m) => ({
      moduleId: m.id,
      count: 15 + Math.floor(Math.random() * 45),
    })),
  ];
  const maxPopularity = Math.max(...dynamicModulePopularity.map((d) => d.count));

  // Level distribution
  const totalLevel = stats.levelDistribution.reduce((s, d) => s + d.count, 0);
  const levelColors: Record<string, string> = {
    basico: 'bg-green-500',
    intermedio: 'bg-amber-500',
    avanzado: 'bg-rose-500',
  };
  const levelLabels: Record<string, string> = {
    basico: 'Básico',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado',
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-medium text-stone-900 dark:text-stone-100">
          Estadísticas
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
          Métricas de aprendizaje y progreso de estudiantes
        </p>
      </div>

      {/* Stat Cards */}
      <div ref={cardsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon size={20} className={stat.color} />
                </div>
                <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mt-3 animate-textReel">
                {stat.value}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm">
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2 text-sm">
            <BarChart3 size={16} className="text-indigo-500" />
            Progreso de Estudiantes (30 días)
          </h3>
          <div className="h-48 flex items-end gap-1">
            {stats.studentProgress.map((d, i) => {
              const height = ((d.completed - minProgress) / progressRange) * 100;
              return (
                <div
                  key={d.date}
                  className="flex-1 flex flex-col items-center gap-1 group"
                >
                  <div className="relative w-full">
                    <div
                      className="w-full bg-indigo-400 dark:bg-indigo-600 rounded-t transition-all duration-350 group-hover:bg-indigo-500 dark:group-hover:bg-indigo-500"
                      style={{ height: `${Math.max(height * 1.3, 4)}px` }}
                    />
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-850 dark:bg-stone-950 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10 shadow">
                      {d.completed}
                    </div>
                  </div>
                  {i % 5 === 0 && (
                    <span className="text-[9px] text-stone-400 dark:text-stone-500 mt-1">
                      {d.date.slice(5)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Module Popularity */}
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm">
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-4 text-sm">
            Módulos más Populares
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {dynamicModulePopularity.map((m) => {
              const pct = (m.count / maxPopularity) * 100;
              return (
                <div key={m.moduleId} className="flex items-center gap-3">
                  <span className="text-xs text-stone-500 dark:text-stone-400 w-24 truncate text-right">
                    {m.moduleId.replace(/-/g, ' ').replace(/^rn /, '').slice(0, 18)}
                  </span>
                  <div className="flex-1 h-4 bg-stone-100 dark:bg-stone-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 w-8 text-right font-medium">
                    {m.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level Distribution */}
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm">
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-4 text-sm">
            Distribución por Nivel
          </h3>
          <div className="space-y-4">
            {stats.levelDistribution.map((l) => {
              const pct = Math.round((l.count / totalLevel) * 100);
              return (
                <div key={l.level}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-stone-600 dark:text-stone-400">
                      {levelLabels[l.level]}
                    </span>
                    <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                      {l.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${levelColors[l.level]} rounded-full transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mini donut */}
          <div className="flex items-center justify-center mt-6">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {stats.levelDistribution.reduce(
                  (acc, l) => {
                    const prevOffset = acc.offset;
                    const pct = (l.count / totalLevel) * 100;
                    const dashArray = `${pct * 2.51} ${251 - pct * 2.51}`;
                    const colors: Record<string, string> = {
                      basico: '#22c55e',
                      intermedio: '#f59e0b',
                      avanzado: '#f43f5e',
                    };
                    acc.elements.push(
                      <circle
                        key={l.level}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={colors[l.level]}
                        strokeWidth="12"
                        strokeDasharray={dashArray}
                        strokeDashoffset={-prevOffset * 2.51}
                        className="transition-all"
                      />
                    );
                    acc.offset += pct;
                    return acc;
                  },
                  { elements: [] as React.ReactNode[], offset: 0 }
                ).elements}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-semibold text-stone-900 dark:text-stone-100 leading-none">
                  {totalLevel}
                </span>
                <span className="text-[9px] text-stone-400 mt-0.5">Temas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Registered Students Table */}
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm">
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-4 text-sm">
            Usuarios de la Plataforma
          </h3>
          <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
            {Object.values(state.usersData).length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-xs">
                No hay otros usuarios registrados en el navegador.
              </div>
            ) : (
              Object.values(state.usersData).map(({ user, progress }) => {
                const totalCompleted = progress.completedLessons.length;
                const progressPct = state.modules.length > 0 
                  ? Math.round((totalCompleted / state.modules.reduce((acc, m) => acc + m.lessons.length, 0)) * 100) 
                  : 0;

                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 py-2.5 border-b border-stone-100 dark:border-stone-700/50 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-semibold text-indigo-650 dark:text-indigo-400 flex-shrink-0">
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-stone-900 dark:text-stone-100 truncate">{user.name}</p>
                      <p className="text-[10px] text-stone-400 dark:text-stone-500">Racha: {progress.dailyStreak}d · Estudiado: {progress.studyTimeMinutes}m</p>
                    </div>
                    <div className="w-20 h-1.5 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden flex-shrink-0">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 w-8 text-right flex-shrink-0">
                      {progressPct}%
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
