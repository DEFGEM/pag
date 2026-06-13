import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { Clock, CheckCircle2, Lock, ChevronRight, PlayCircle, ClipboardCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { difficultyBadge } from '@/lib/utils';

export default function ModuleDetail() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { state, getModuleProgress } = useStore();
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);

  const { modules, userProgress } = state;
  const mod = modules.find((m) => m.id === moduleId);

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [moduleId]);

  if (!mod) {
    return (
      <div className="p-6 text-center">
        <p className="text-stone-500 dark:text-stone-400">Módulo no encontrado.</p>
        <button
          onClick={() => navigate('/modules')}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Volver a Módulos
        </button>
      </div>
    );
  }

  const progress = getModuleProgress(mod.id);
  const completedLessonsCount = mod.lessons.filter((l) =>
    userProgress.completedLessons.includes(l.id)
  ).length;
  const allLessonsCompleted = completedLessonsCount === mod.lessons.length;
  const quizDone = userProgress.completedQuizzes[mod.quiz.id];

  const lessonStatus = (lessonId: string, index: number) => {
    const isCompleted = userProgress.completedLessons.includes(lessonId);
    const isFirstIncomplete =
      !isCompleted &&
      mod.lessons.slice(0, index).every((l) => userProgress.completedLessons.includes(l.id));
    const isLocked =
      !isCompleted &&
      !isFirstIncomplete &&
      index > 0 &&
      !userProgress.completedLessons.includes(mod.lessons[index - 1].id);

    return { isCompleted, isFirstIncomplete, isLocked };
  };

  return (
    <div className="p-6 max-w-4xl">
      {/* Module Header */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <img src={mod.thumbnail} alt={mod.title} className="w-full aspect-[21/9] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className={`inline-block text-[11px] font-medium px-2.5 py-1 rounded-full mb-2 ${difficultyBadge(mod.difficulty)}`}>
            {mod.difficulty}
          </span>
          <h2 className="text-2xl font-medium text-white">{mod.title}</h2>
          <p className="text-white/80 text-sm mt-1 max-w-xl">{mod.description}</p>
          <div className="flex items-center gap-4 mt-3 text-white/70 text-xs">
            <span className="flex items-center gap-1">
              <Clock size={13} /> {mod.estimatedHours}h estimadas
            </span>
            <span>{mod.lessons.length} lecciones</span>
            <span>{mod.category}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4 mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-stone-600 dark:text-stone-400">Progreso del módulo</span>
          <span className="font-medium text-stone-900 dark:text-stone-100">
            {completedLessonsCount}/{mod.lessons.length} lecciones ({progress}%)
          </span>
        </div>
        <div className="h-2.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Lessons List */}
      <div ref={listRef} className="space-y-2">
        {mod.lessons.map((lesson, index) => {
          const { isCompleted, isLocked } = lessonStatus(lesson.id, index);

          return (
            <div
              key={lesson.id}
              onClick={() => {
                if (!isLocked) {
                  navigate(`/modules/${mod.id}/lessons/${lesson.id}`);
                }
              }}
              className={`
                flex items-center gap-4 p-4 rounded-xl border transition-all duration-200
                ${
                  isLocked
                    ? 'bg-stone-50 dark:bg-stone-800/50 border-stone-100 dark:border-stone-800 cursor-not-allowed opacity-60'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md cursor-pointer'
                }
              `}
            >
              {/* Status Icon */}
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                    <CheckCircle2 size={18} className="text-teal-600 dark:text-teal-400" />
                  </div>
                ) : isLocked ? (
                  <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-700 flex items-center justify-center">
                    <Lock size={16} className="text-stone-400 dark:text-stone-500" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <PlayCircle size={18} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 dark:text-stone-500 font-mono">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h4 className={`font-medium truncate ${isCompleted ? 'text-stone-500 dark:text-stone-400 line-through' : 'text-stone-900 dark:text-stone-100'}`}>
                    {lesson.title}
                  </h4>
                </div>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {lesson.description}
                </p>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500 flex-shrink-0">
                <Clock size={12} />
                {lesson.duration}min
              </div>

              {!isLocked && <ChevronRight size={16} className="text-stone-300 dark:text-stone-600 flex-shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Quiz Button */}
      <div className="mt-6">
        {allLessonsCompleted ? (
          quizDone ? (
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200 dark:border-teal-800/40 p-5 flex items-center gap-4">
              <CheckCircle2 size={24} className="text-teal-600 dark:text-teal-400" />
              <div>
                <p className="font-medium text-teal-800 dark:text-teal-300">Evaluación completada</p>
                <p className="text-sm text-teal-600 dark:text-teal-400">Puntuación: {quizDone}%</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate(`/modules/${mod.id}/quiz`)}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors cursor-pointer"
            >
              <ClipboardCheck size={20} />
              Tomar Evaluación
            </button>
          )
        ) : (
          <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 p-5 flex items-center gap-4">
            <Lock size={20} className="text-stone-400 dark:text-stone-600" />
            <p className="text-stone-500 dark:text-stone-400">
              Completa todas las lecciones para desbloquear la evaluación
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
