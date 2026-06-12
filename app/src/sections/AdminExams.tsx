import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { Plus, Edit3, Trash2, CheckCircle2, XCircle, GripVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface EditingQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function AdminExams() {
  const { state } = useStore();
  const { modules } = state;
  const [selectedModule, setSelectedModule] = useState(modules[0]?.id || '');
  const [editQuestion, setEditQuestion] = useState<EditingQuestion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const mod = modules.find((m) => m.id === selectedModule);

  const handleSave = () => {
    setDialogOpen(false);
    setEditQuestion(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium text-stone-900 dark:text-stone-100">
            Gestión de Exámenes
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Edita las preguntas y respuestas de las evaluaciones
          </p>
        </div>
      </div>

      {/* Module Selector */}
      <div className="mb-6">
        <label className="block text-sm text-stone-600 dark:text-stone-400 mb-2">Módulo</label>
        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        >
          {modules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title} ({m.quiz.questions.length} preguntas)
            </option>
          ))}
        </select>
      </div>

      {mod && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-stone-900 dark:text-stone-100">{mod.quiz.title}</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Puntuación mínima: {mod.quiz.passingScore}% · {mod.quiz.questions.length} preguntas
              </p>
            </div>
            <button
              onClick={() => {
                setEditQuestion({
                  id: `new-${Date.now()}`,
                  question: '',
                  options: ['', '', '', ''],
                  correctAnswer: 0,
                  explanation: '',
                });
                setDialogOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Añadir Pregunta
            </button>
          </div>

          {/* Questions List */}
          <div className="space-y-3">
            {mod.quiz.questions.map((q, index) => (
              <div
                key={q.id}
                className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5"
              >
                <div className="flex items-start gap-3">
                  <GripVertical size={16} className="text-stone-300 mt-1 cursor-grab" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <span className="text-xs text-stone-400 font-mono">#{index + 1}</span>
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100 mt-0.5">
                          {q.question}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditQuestion({ ...q });
                            setDialogOpen(true);
                          }}
                          className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 size={14} className="text-stone-500" />
                        </button>
                        <button className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors cursor-pointer">
                          <Trash2 size={14} className="text-rose-500" />
                        </button>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                            optIdx === q.correctAnswer
                              ? 'bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/40'
                              : 'bg-stone-50 dark:bg-stone-900/30 border border-stone-100 dark:border-stone-700/50'
                          }`}
                        >
                          {optIdx === q.correctAnswer ? (
                            <CheckCircle2 size={14} className="text-teal-500 flex-shrink-0" />
                          ) : (
                            <XCircle size={14} className="text-stone-300 flex-shrink-0" />
                          )}
                          <span
                            className={
                              optIdx === q.correctAnswer
                                ? 'text-teal-800 dark:text-teal-300'
                                : 'text-stone-600 dark:text-stone-400'
                            }
                          >
                            {opt}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 italic">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editQuestion?.question ? 'Editar Pregunta' : 'Nueva Pregunta'}</DialogTitle>
          </DialogHeader>
          {editQuestion && (
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm text-stone-600 dark:text-stone-400 mb-1.5">Pregunta</label>
                <textarea
                  value={editQuestion.question}
                  onChange={(e) => setEditQuestion({ ...editQuestion, question: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-stone-200 dark:border-stone-700 rounded-lg text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-stone-600 dark:text-stone-400">Opciones</label>
                {editQuestion.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <button
                      onClick={() => setEditQuestion({ ...editQuestion, correctAnswer: idx })}
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                        idx === editQuestion.correctAnswer
                          ? 'bg-teal-500 text-white'
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                      }`}
                    >
                      {idx === editQuestion.correctAnswer ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <span className="text-xs">{String.fromCharCode(65 + idx)}</span>
                      )}
                    </button>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...editQuestion.options];
                        newOptions[idx] = e.target.value;
                        setEditQuestion({ ...editQuestion, options: newOptions });
                      }}
                      placeholder={`Opción ${String.fromCharCode(65 + idx)}`}
                      className="flex-1 px-4 py-2 border border-stone-200 dark:border-stone-700 rounded-lg text-sm"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm text-stone-600 dark:text-stone-400 mb-1.5">
                  Explicación
                </label>
                <textarea
                  value={editQuestion.explanation}
                  onChange={(e) => setEditQuestion({ ...editQuestion, explanation: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-stone-200 dark:border-stone-700 rounded-lg text-sm"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => setDialogOpen(false)}
              className="px-4 py-2 text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Guardar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
