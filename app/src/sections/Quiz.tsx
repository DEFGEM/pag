import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Trophy, ArrowLeft, RotateCcw } from 'lucide-react';
import gsap from 'gsap';

export default function Quiz() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { state, completeQuiz, addNotification } = useStore();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const questionRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const mod = state.modules.find((m) => m.id === moduleId);
  const quiz = mod?.quiz;

  useEffect(() => {
    if (questionRef.current) {
      gsap.fromTo(
        questionRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (isFinished && resultRef.current) {
      gsap.fromTo(
        resultRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
      );
    }
  }, [isFinished]);

  if (!mod || !quiz) {
    return (
      <div className="p-6 text-center">
        <p className="text-stone-500 dark:text-stone-400">Evaluación no encontrada.</p>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;
  const hasAnswered = selectedAnswers[question.id] !== undefined;
  const isCorrect = hasAnswered && selectedAnswers[question.id] === question.correctAnswer;

  function handleSelectAnswer(optionIndex: number) {
    if (showFeedback) return;
    setSelectedAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
    setShowFeedback(true);
  }

  function handleNext() {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setShowFeedback(false);
    } else {
      // Calculate final score
      let correct = 0;
      quiz!.questions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctAnswer) correct++;
      });
      const finalScore = Math.round((correct / totalQuestions) * 100);
      setScore(finalScore);
      setIsFinished(true);
      completeQuiz(quiz!.id, finalScore);

      if (finalScore >= quiz!.passingScore) {
        addNotification('success', `¡Evaluación aprobada con ${finalScore}%! 🎉`);
      } else {
        addNotification('info', `Obtuviste ${finalScore}%. Necesitas ${quiz!.passingScore}% para aprobar.`);
      }
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowFeedback(false);
    setIsFinished(false);
    setScore(0);
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  if (isFinished) {
    const passed = score >= quiz.passingScore;
    const correctCount = quiz.questions.filter(
      (q) => selectedAnswers[q.id] === q.correctAnswer
    ).length;

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div ref={resultRef} className="text-center space-y-6">
          {/* Score Circle */}
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-stone-200 dark:text-stone-700" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 327} 327`}
                className={passed ? 'text-teal-500' : 'text-amber-500'}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${passed ? 'text-teal-600 dark:text-teal-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {score}%
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {correctCount}/{totalQuestions}
              </span>
            </div>
          </div>

          {/* Result Message */}
          <div>
            {passed ? (
              <>
                <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mx-auto mb-3">
                  <Trophy size={32} className="text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-medium text-stone-900 dark:text-stone-100">
                  ¡Felicitaciones! 🎉
                </h3>
                <p className="text-stone-600 dark:text-stone-400 mt-1">
                  Has aprobado la evaluación de {mod.title}
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-3">
                  <RotateCcw size={32} className="text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-medium text-stone-900 dark:text-stone-100">
                  Sigue practicando
                </h3>
                <p className="text-stone-600 dark:text-stone-400 mt-1">
                  Necesitas {quiz.passingScore}% para aprobar. ¡Tú puedes!
                </p>
              </>
            )}
          </div>

          {/* Question Review */}
          <div className="text-left bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5">
            <h4 className="font-medium text-stone-900 dark:text-stone-100 mb-3">Revisión Detallada</h4>
            <div className="space-y-4">
              {quiz.questions.map((q, i) => {
                const correct = selectedAnswers[q.id] === q.correctAnswer;
                const userAnswer = selectedAnswers[q.id];
                return (
                  <div key={q.id} className="p-3 rounded-lg bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-700/50">
                    <div className="flex items-center gap-3 mb-2">
                      {correct ? (
                        <CheckCircle2 size={18} className="text-teal-500 flex-shrink-0" />
                      ) : (
                        <XCircle size={18} className="text-rose-500 flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium text-stone-900 dark:text-stone-100 flex-1">
                        Pregunta {i + 1}: {q.question}
                      </span>
                      <span className={`text-xs font-medium ${correct ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {correct ? 'Correcta' : 'Incorrecta'}
                      </span>
                    </div>

                    {/* Show user's answer if wrong */}
                    {!correct && userAnswer !== undefined && (
                      <div className="ml-7 mb-2">
                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Tu respuesta:</p>
                        <p className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800/40">
                          {optionLabels[userAnswer]}. {q.options[userAnswer]}
                        </p>
                      </div>
                    )}

                    {/* Show correct answer */}
                    {!correct && (
                      <div className="ml-7 mb-2">
                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Respuesta correcta:</p>
                        <p className="text-sm text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-3 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800/40">
                          {optionLabels[q.correctAnswer]}. {q.options[q.correctAnswer]}
                        </p>
                      </div>
                    )}

                    {/* Explanation */}
                    <div className="ml-7 mt-2">
                      <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Explicación:</p>
                      <p className="text-sm text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-3 py-2 rounded-lg">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => navigate(`/modules/${mod.id}`)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft size={16} />
              Volver al Módulo
            </button>
            {!passed && (
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw size={16} />
                Reintentar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Quiz Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-stone-900 dark:text-stone-100">
            Evaluación: {mod.title}
          </h2>
          <span className="text-sm text-stone-500 dark:text-stone-400">
            Pregunta {currentQuestion + 1} de {totalQuestions}
          </span>
        </div>
        {/* Progress */}
        <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div ref={questionRef}>
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-6 mb-6">
          <p className="text-lg text-stone-900 dark:text-stone-100 font-medium">
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswers[question.id] === index;
            const isCorrectOption = index === question.correctAnswer;
            const showCorrect = showFeedback && isCorrectOption;
            const showWrong = showFeedback && isSelected && !isCorrectOption;

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={showFeedback}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer
                  ${
                    showCorrect
                      ? 'border-teal-400 bg-teal-50 dark:bg-teal-900/20 dark:border-teal-600'
                      : showWrong
                      ? 'border-rose-400 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-600'
                      : isSelected
                      ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-600'
                      : 'border-stone-200 dark:border-stone-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                  }
                `}
              >
                {/* Letter Badge */}
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium
                    ${
                      showCorrect
                        ? 'bg-teal-500 text-white'
                        : showWrong
                        ? 'bg-rose-500 text-white'
                        : isSelected
                        ? 'bg-indigo-500 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }
                  `}
                >
                  {optionLabels[index]}
                </div>
                <span className={`flex-1 ${showCorrect ? 'text-teal-800 dark:text-teal-300' : showWrong ? 'text-rose-800 dark:text-rose-300' : 'text-stone-700 dark:text-stone-300'}`}>
                  {option}
                </span>
                {showCorrect && <CheckCircle2 size={18} className="text-teal-500 flex-shrink-0" />}
                {showWrong && <XCircle size={18} className="text-rose-500 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`
              rounded-xl border p-4 mb-6
              ${isCorrect
                ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/40'
                : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/40'
              }
            `}
          >
            <p className={`text-sm font-medium ${isCorrect ? 'text-teal-800 dark:text-teal-300' : 'text-rose-800 dark:text-rose-300'}`}>
              {isCorrect ? '¡Correcto! ✅' : 'Incorrecto ❌'}
            </p>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion((prev) => prev - 1);
                setShowFeedback(false);
              }
            }}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft size={16} />
            Anterior
          </button>

          {showFeedback && (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
            >
              {currentQuestion < totalQuestions - 1 ? (
                <>
                  Siguiente
                  <ChevronRight size={16} />
                </>
              ) : (
                'Finalizar'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
