import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { Clock, BookOpen, CheckCircle2, Lock } from 'lucide-react';
import gsap from 'gsap';
import type { Difficulty } from '@/types';

const filters: { label: string; value: Difficulty | 'todos' }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Básico', value: 'basico' },
  { label: 'Intermedio', value: 'intermedio' },
  { label: 'Avanzado', value: 'avanzado' },
];

const difficultyBadge = (diff: Difficulty) => {
  const styles: Record<string, string> = {
    basico: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermedio: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    avanzado: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  };
  return styles[diff] || styles.basico;
};

export default function Modules() {
  const { state, getModuleProgress } = useStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Difficulty | 'todos'>('todos');
  const gridRef = useRef<HTMLDivElement>(null);

  const { modules, userProgress } = state;

  const filteredModules =
    filter === 'todos' ? modules : modules.filter((m) => m.difficulty === filter);

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [filter]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-stone-900 dark:text-stone-100">
          Módulos de Aprendizaje
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mt-1">
          Domina React Native paso a paso.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`
              px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
              ${
                filter === f.value
                  ? 'bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900'
                  : 'bg-transparent border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-500'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredModules.map((mod) => {
          const progress = getModuleProgress(mod.id);
          const isCompleted = userProgress.completedModules.includes(mod.id);

          return (
            <div
              key={mod.id}
              onClick={() => navigate(`/modules/${mod.id}`)}
              className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:-translate-y-1 transition-all duration-250 cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={mod.thumbnail}
                  alt={mod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${difficultyBadge(mod.difficulty)}`}>
                    {mod.difficulty}
                  </span>
                </div>
                {isCompleted && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-medium text-stone-900 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                  {mod.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100 dark:border-stone-700/50">
                  <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1">
                      <BookOpen size={13} />
                      {mod.lessons.length} lecciones
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {mod.estimatedHours}h
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {progress > 0 && !isCompleted && (
                      <div className="w-16 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                    {isCompleted ? (
                      <CheckCircle2 size={16} className="text-teal-500" />
                    ) : progress === 0 ? (
                      <Lock size={14} className="text-stone-300 dark:text-stone-600" />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
