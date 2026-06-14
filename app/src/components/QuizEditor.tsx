import { useState } from 'react';
import { Plus, Trash2, Check, X, Edit3, Save, GripVertical } from 'lucide-react';
import type { Question } from '@/types';

interface QuizEditorProps {
  questions: Question[];
  onChange: (questions: Question[]) => void;
}

export default function QuizEditor({ questions, onChange }: QuizEditorProps) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editData, setEditData] = useState<Question | null>(null);

  const handleAdd = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    };
    onChange([...questions, newQuestion]);
    setEditingIdx(questions.length);
    setEditData(newQuestion);
  };

  const handleDelete = (idx: number) => {
    const updated = questions.filter((_, i) => i !== idx);
    onChange(updated);
    if (editingIdx === idx) {
      setEditingIdx(null);
      setEditData(null);
    }
  };

  const handleEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditData({ ...questions[idx] });
  };

  const handleSave = () => {
    if (editingIdx !== null && editData) {
      const updated = questions.map((q, i) => (i === editingIdx ? editData : q));
      onChange(updated);
      setEditingIdx(null);
      setEditData(null);
    }
  };

  const handleCancel = () => {
    setEditingIdx(null);
    setEditData(null);
  };

  const updateOption = (optIdx: number, value: string) => {
    if (!editData) return;
    const newOptions = [...editData.options];
    newOptions[optIdx] = value;
    setEditData({ ...editData, options: newOptions });
  };

  const addOption = () => {
    if (!editData) return;
    setEditData({ ...editData, options: [...editData.options, ''] });
  };

  const removeOption = (optIdx: number) => {
    if (!editData || editData.options.length <= 2) return;
    const newOptions = editData.options.filter((_, i) => i !== optIdx);
    let newCorrect = editData.correctAnswer;
    if (optIdx < newCorrect) newCorrect--;
    else if (optIdx === newCorrect) newCorrect = 0;
    setEditData({ ...editData, options: newOptions, correctAnswer: newCorrect });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Preguntas ({questions.length})
        </h4>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
        >
          <Plus size={13} />
          Agregar pregunta
        </button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className={`rounded-xl border transition-all ${
              editingIdx === idx
                ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10'
                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800'
            }`}
          >
            {editingIdx === idx ? (
              /* Edit Mode */
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                  <Edit3 size={13} />
                  Editando pregunta {idx + 1}
                </div>

                <div>
                  <label className="block text-[11px] text-stone-500 mb-1 uppercase tracking-wider">Pregunta</label>
                  <textarea
                    value={editData?.question || ''}
                    onChange={(e) => setEditData(editData ? { ...editData, question: e.target.value } : null)}
                    rows={2}
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                    placeholder="Escribe la pregunta..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-stone-500 mb-1 uppercase tracking-wider">
                    Opciones (selecciona la correcta)
                  </label>
                  <div className="space-y-2">
                    {editData?.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <button
                          onClick={() => setEditData(editData ? { ...editData, correctAnswer: optIdx } : null)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all cursor-pointer ${
                            editData?.correctAnswer === optIdx
                              ? 'bg-green-500 text-white shadow-md shadow-green-500/30'
                              : 'bg-stone-100 dark:bg-stone-700 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-600'
                          }`}
                          title={editData?.correctAnswer === optIdx ? 'Respuesta correcta' : 'Marcar como correcta'}
                        >
                          {editData?.correctAnswer === optIdx ? <Check size={12} /> : String.fromCharCode(65 + optIdx)}
                        </button>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateOption(optIdx, e.target.value)}
                          className="flex-1 px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                          placeholder={`Opción ${String.fromCharCode(65 + optIdx)}`}
                        />
                        {editData && editData.options.length > 2 && (
                          <button
                            onClick={() => removeOption(optIdx)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {editData && editData.options.length < 6 && (
                    <button
                      onClick={addOption}
                      className="mt-2 flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      <Plus size={12} />
                      Agregar opción
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] text-stone-500 mb-1 uppercase tracking-wider">Explicación</label>
                  <textarea
                    value={editData?.explanation || ''}
                    onChange={(e) => setEditData(editData ? { ...editData, explanation: e.target.value } : null)}
                    rows={2}
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                    placeholder="Explicación de la respuesta correcta..."
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    <Save size={13} />
                    Guardar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-xs font-medium rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    <X size={13} />
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="p-3 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <GripVertical size={12} className="text-stone-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-stone-800 dark:text-stone-200 line-clamp-2">
                    {idx + 1}. {q.question || '(Sin texto)'}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {q.options.map((opt, optIdx) => (
                      <span
                        key={optIdx}
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          optIdx === q.correctAnswer
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium'
                            : 'bg-stone-100 dark:bg-stone-700 text-stone-500'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}) {opt.slice(0, 30)}{opt.length > 30 ? '...' : ''}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(idx)}
                    className="p-1.5 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-8 text-stone-400 dark:text-stone-500">
          <p className="text-sm">No hay preguntas aún.</p>
          <button onClick={handleAdd} className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
            Agregar primera pregunta
          </button>
        </div>
      )}
    </div>
  );
}
