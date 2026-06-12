import { useNavigate } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { ClipboardCheck, CheckCircle2, Lock, Clock, ArrowRight } from 'lucide-react';

export default function Evaluations() {
  const { state, getModuleProgress } = useStore();
  const navigate = useNavigate();
  const { modules, userProgress } = state;

  const evaluations = modules.map((mod) => {
    const progress = getModuleProgress(mod.id);
    const allLessonsDone = mod.lessons.every((l) =>
      userProgress.completedLessons.includes(l.id)
    );
    const quizScore = userProgress.completedQuizzes[mod.quiz.id];
    const status = quizScore
      ? 'completed'
      : allLessonsDone
      ? 'ready'
      : progress > 0
      ? 'in-progress'
      : 'locked';

    return { mod, progress, allLessonsDone, quizScore, status };
  });

  const statusConfig: Record<string, {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: typeof CheckCircle2;
  }> = {
    completed: {
      label: 'Completada',
      color: 'text-teal-700 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-900/20',
      border: 'border-teal-200 dark:border-teal-800/40',
      icon: CheckCircle2,
    },
    ready: {
      label: 'Lista para tomar',
      color: 'text-indigo-700 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      border: 'border-indigo-200 dark:border-indigo-800/40',
      icon: ClipboardCheck,
    },
    'in-progress': {
      label: 'En progreso',
      color: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800/40',
      icon: Clock,
    },
    locked: {
      label: 'Bloqueada',
      color: 'text-stone-500 dark:text-stone-500',
      bg: 'bg-stone-50 dark:bg-stone-800/50',
      border: 'border-stone-200 dark:border-stone-700',
      icon: Lock,
    },
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-stone-900 dark:text-stone-100">
          Evaluaciones
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mt-1">
          Completa las evaluaciones para validar tus conocimientos.
        </p>
      </div>

      <div className="space-y-3">
        {evaluations.map(({ mod, quizScore, status }) => {
          const config = statusConfig[status];
          const Icon = config.icon;

          return (
            <div
              key={mod.id}
              onClick={() => {
                if (status === 'ready' || status === 'completed') {
                  navigate(`/modules/${mod.id}/quiz`);
                }
              }}
              className={`
                flex items-center gap-4 p-4 rounded-xl border transition-all duration-200
                ${
                  status === 'locked' || status === 'in-progress'
                    ? 'bg-stone-50 dark:bg-stone-800/30 border-stone-200 dark:border-stone-700/50 cursor-default opacity-70'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer'
                }
              `}
            >
              <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={config.color} />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-stone-900 dark:text-stone-100 text-sm">{mod.title}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                  {quizScore && (
                    <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                      {quizScore}%
                    </span>
                  )}
                </div>
              </div>

              {(status === 'ready' || status === 'completed') && (
                <ArrowRight size={16} className="text-stone-400 dark:text-stone-600 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
