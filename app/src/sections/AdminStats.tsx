import { adminStats } from '@/data';
import { Users, BookOpen, ClipboardCheck, TrendingUp, BarChart3 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AdminStats() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);
  const stats = adminStats;

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
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      trend: '+12%',
    },
    {
      label: 'Módulos Activos',
      value: stats.activeModules.toString(),
      icon: BookOpen,
      color: 'text-teal-500',
      bg: 'bg-teal-50 dark:bg-teal-900/20',
      trend: '+3',
    },
    {
      label: 'Evaluaciones Completadas',
      value: stats.completedEvaluations.toLocaleString(),
      icon: ClipboardCheck,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      trend: '+8%',
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

  // Module popularity chart
  const maxPopularity = Math.max(...stats.modulePopularity.map((d) => d.count));

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
              className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon size={20} className={stat.color} />
                </div>
                <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-medium text-stone-900 dark:text-stone-100 mt-3">
                {stat.value}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5">
          <h3 className="font-medium text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
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
                      className="w-full bg-indigo-400 dark:bg-indigo-600 rounded-t transition-all duration-300 group-hover:bg-indigo-500 dark:group-hover:bg-indigo-500"
                      style={{ height: `${Math.max(height * 1.5, 4)}px` }}
                    />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-800 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                      {d.completed}
                    </div>
                  </div>
                  {i % 5 === 0 && (
                    <span className="text-[9px] text-stone-400 dark:text-stone-500 rotate-0">
                      {d.date.slice(5)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Module Popularity */}
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5">
          <h3 className="font-medium text-stone-900 dark:text-stone-100 mb-4">
            Módulos más Populares
          </h3>
          <div className="space-y-3">
            {stats.modulePopularity.slice(0, 8).map((m) => {
              const pct = (m.count / maxPopularity) * 100;
              return (
                <div key={m.moduleId} className="flex items-center gap-3">
                  <span className="text-xs text-stone-500 dark:text-stone-400 w-20 truncate text-right">
                    {m.moduleId.replace(/-/g, ' ').replace(/^rn /, '').slice(0, 15)}
                  </span>
                  <div className="flex-1 h-5 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-400 to-teal-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-stone-500 dark:text-stone-400 w-8 text-right">
                    {m.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level Distribution */}
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5">
          <h3 className="font-medium text-stone-900 dark:text-stone-100 mb-4">
            Distribución por Nivel
          </h3>
          <div className="space-y-4">
            {stats.levelDistribution.map((l) => {
              const pct = Math.round((l.count / totalLevel) * 100);
              return (
                <div key={l.level}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-stone-600 dark:text-stone-400">
                      {levelLabels[l.level]}
                    </span>
                    <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                      {l.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-3 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
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
            <div className="relative w-28 h-28">
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
                        strokeWidth="16"
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
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-medium text-stone-900 dark:text-stone-100">
                  {totalLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Students Table */}
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5">
          <h3 className="font-medium text-stone-900 dark:text-stone-100 mb-4">
            Estudiantes Recientes
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Ana García', progress: 78, lastActive: 'Hace 2h', avatar: 'AG' },
              { name: 'Carlos Ruiz', progress: 45, lastActive: 'Hace 5h', avatar: 'CR' },
              { name: 'María López', progress: 92, lastActive: 'Hace 1d', avatar: 'ML' },
              { name: 'Pedro Sánchez', progress: 23, lastActive: 'Hace 2d', avatar: 'PS' },
              { name: 'Laura Martín', progress: 67, lastActive: 'Hace 3d', avatar: 'LM' },
              { name: 'Diego Torres', progress: 56, lastActive: 'Hace 4d', avatar: 'DT' },
            ].map((student, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2 border-b border-stone-100 dark:border-stone-700/50 last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-medium text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  {student.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-stone-900 dark:text-stone-100">{student.name}</p>
                </div>
                <div className="w-20 h-1.5 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 rounded-full"
                    style={{ width: `${student.progress}%` }}
                  />
                </div>
                <span className="text-xs text-stone-400 dark:text-stone-500 flex-shrink-0 w-14 text-right">
                  {student.lastActive}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
