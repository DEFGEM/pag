import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { Trophy, TrendingUp, TrendingDown, Target, BarChart3, ChevronDown, ChevronUp, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

export default function QuizHistory() {
  const { state } = useStore();
  const navigate = useNavigate();
  const { modules, userProgress } = state;
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);

  // Group quiz attempts by quiz/module
  const quizHistory = modules
    .filter((m) => userProgress.completedQuizzes[m.quiz.id] !== undefined)
    .map((module) => {
      const score = userProgress.completedQuizzes[module.quiz.id];
      const passed = score >= module.quiz.passingScore;
      return {
        moduleId: module.id,
        moduleTitle: module.title,
        moduleIcon: module.thumbnail || '📝',
        quizId: module.quiz.id,
        quizTitle: module.quiz.title,
        score,
        passingScore: module.quiz.passingScore,
        passed,
        attemptCount: module.quiz.questions.length,
      };
    })
    .sort((a, b) => {
      // Show passed first, then by score
      if (a.passed !== b.passed) return a.passed ? -1 : 1;
      return b.score - a.score;
    });

  // Calculate stats
  const totalQuizzes = quizHistory.length;
  const passedQuizzes = quizHistory.filter((q) => q.passed).length;
  const avgScore = totalQuizzes > 0
    ? Math.round(quizHistory.reduce((acc, q) => acc + q.score, 0) / totalQuizzes)
    : 0;
  const passRate = totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-indigo-500" />
            <span className="text-xs text-stone-500">Intentos</span>
          </div>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{totalQuizzes}</p>
        </div>
        <div className="p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-green-500" />
            <span className="text-xs text-stone-500">Aprobados</span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{passedQuizzes}</p>
        </div>
        <div className="p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} className="text-purple-500" />
            <span className="text-xs text-stone-500">Promedio</span>
          </div>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{avgScore}%</p>
        </div>
        <div className="p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-amber-500" />
            <span className="text-xs text-stone-500">Tasa de aprobación</span>
          </div>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{passRate}%</p>
        </div>
      </div>

      {/* Quiz List */}
      {quizHistory.length > 0 ? (
        <div className="space-y-3">
          {quizHistory.map((quiz) => (
            <div
              key={quiz.quizId}
              className={`rounded-xl border overflow-hidden transition-all ${
                quiz.passed
                  ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/10'
                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800'
              }`}
            >
              {/* Quiz Header */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-700/50 transition-colors"
                onClick={() => setExpandedQuiz(expandedQuiz === quiz.quizId ? null : quiz.quizId)}
              >
                <span className="text-2xl">{quiz.moduleIcon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-900 dark:text-stone-100 truncate">
                    {quiz.moduleTitle}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {quiz.quizTitle}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      quiz.passed ? 'text-green-600 dark:text-green-400' : 'text-red-500'
                    }`}>
                      {quiz.score}%
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Para aprobar: {quiz.passingScore}%
                    </p>
                  </div>
                  {quiz.passed ? (
                    <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle size={20} className="text-red-400 flex-shrink-0" />
                  )}
                  {expandedQuiz === quiz.quizId ? (
                    <ChevronUp size={16} className="text-stone-400" />
                  ) : (
                    <ChevronDown size={16} className="text-stone-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedQuiz === quiz.quizId && (
                <div className="px-4 pb-4 pt-2 border-t border-stone-200 dark:border-stone-700">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="p-3 bg-white dark:bg-stone-900 rounded-lg">
                      <p className="text-[11px] text-stone-500 uppercase">Puntuación</p>
                      <p className={`text-lg font-bold ${
                        quiz.passed ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {quiz.score}%
                      </p>
                    </div>
                    <div className="p-3 bg-white dark:bg-stone-900 rounded-lg">
                      <p className="text-[11px] text-stone-500 uppercase">Resultado</p>
                      <p className={`text-lg font-bold ${
                        quiz.passed ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {quiz.passed ? 'Aprobado' : 'No aprobado'}
                      </p>
                    </div>
                    <div className="p-3 bg-white dark:bg-stone-900 rounded-lg">
                      <p className="text-[11px] text-stone-500 uppercase">Preguntas</p>
                      <p className="text-lg font-bold text-stone-900 dark:text-stone-100">
                        {quiz.attemptCount}
                      </p>
                    </div>
                    <div className="p-3 bg-white dark:bg-stone-900 rounded-lg">
                      <p className="text-[11px] text-stone-500 uppercase">Diferencia</p>
                      <p className={`text-lg font-bold flex items-center gap-1 ${
                        quiz.score >= quiz.passingScore ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {quiz.score >= quiz.passingScore ? (
                          <TrendingUp size={16} />
                        ) : (
                          <TrendingDown size={16} />
                        )}
                        {quiz.score - quiz.passingScore > 0 ? '+' : ''}{quiz.score - quiz.passingScore}
                      </p>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-stone-500 mb-1">
                      <span>0%</span>
                      <span>Para aprobar: {quiz.passingScore}%</span>
                      <span>100%</span>
                    </div>
                    <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden relative">
                      {/* Passing line */}
                      <div
                        className="absolute top-0 h-full w-0.5 bg-stone-400 z-10"
                        style={{ left: `${quiz.passingScore}%` }}
                      />
                      {/* Score bar */}
                      <div
                        className={`h-full rounded-full transition-all ${
                          quiz.passed
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-gradient-to-r from-red-500 to-orange-500'
                        }`}
                        style={{ width: `${quiz.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/modules/${quiz.moduleId}/quiz`)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      <RotateCcw size={14} />
                      {quiz.passed ? 'Reintentar' : 'Intentar de nuevo'}
                    </button>
                    <button
                      onClick={() => navigate(`/modules/${quiz.moduleId}`)}
                      className="flex items-center gap-2 px-4 py-2 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-xs font-medium rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      Ver módulo
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
          <Trophy size={48} className="mx-auto text-stone-300 dark:text-stone-600 mb-4" />
          <p className="text-stone-500 dark:text-stone-400 font-medium">
            Aún no has completado ningún examen
          </p>
          <p className="text-sm text-stone-400 dark:text-stone-500 mt-1">
            Completa las lecciones de un módulo para desbloquear su evaluación
          </p>
          <button
            onClick={() => navigate('/modules')}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Ver módulos
          </button>
        </div>
      )}
    </div>
  );
}
