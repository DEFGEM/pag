import { useState } from 'react';
import { Plus, Trash2, X, Edit3, Save, BookOpen, Clock } from 'lucide-react';
import type { Lesson } from '@/types';

interface LessonEditorProps {
  lessons: Lesson[];
  onChange: (lessons: Lesson[]) => void;
}

export default function LessonEditor({ lessons, onChange }: LessonEditorProps) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editData, setEditData] = useState<Lesson | null>(null);

  const handleAdd = () => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      moduleId: lessons[0]?.moduleId || '',
      title: '',
      description: '',
      duration: 15,
      order: lessons.length + 1,
      content: [{ type: 'text', content: '' }],
    };
    onChange([...lessons, newLesson]);
    setEditingIdx(lessons.length);
    setEditData(newLesson);
  };

  const handleDelete = (idx: number) => {
    const updated = lessons
      .filter((_, i) => i !== idx)
      .map((l, i) => ({ ...l, order: i + 1 }));
    onChange(updated);
    if (editingIdx === idx) {
      setEditingIdx(null);
      setEditData(null);
    }
  };

  const handleEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditData({ ...lessons[idx] });
  };

  const handleSave = () => {
    if (editingIdx !== null && editData) {
      const updated = lessons.map((l, i) => (i === editingIdx ? { ...editData, order: i + 1 } : l));
      onChange(updated);
      setEditingIdx(null);
      setEditData(null);
    }
  };

  const handleCancel = () => {
    setEditingIdx(null);
    setEditData(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Lecciones ({lessons.length})
        </h4>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
        >
          <Plus size={13} />
          Agregar lección
        </button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {lessons.map((lesson, idx) => (
          <div
            key={lesson.id}
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
                  Editando lección {idx + 1}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] text-stone-500 mb-1 uppercase tracking-wider">Título</label>
                    <input
                      type="text"
                      value={editData?.title || ''}
                      onChange={(e) => setEditData(editData ? { ...editData, title: e.target.value } : null)}
                      className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      placeholder="Nombre de la lección"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1 uppercase tracking-wider">Duración (min)</label>
                    <input
                      type="number"
                      value={editData?.duration || 15}
                      onChange={(e) => setEditData(editData ? { ...editData, duration: parseInt(e.target.value) || 15 } : null)}
                      min={5}
                      max={120}
                      className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-stone-500 mb-1 uppercase tracking-wider">Descripción</label>
                  <input
                    type="text"
                    value={editData?.description || ''}
                    onChange={(e) => setEditData(editData ? { ...editData, description: e.target.value } : null)}
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    placeholder="Breve descripción de la lección"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-stone-500 mb-1 uppercase tracking-wider">Contenido</label>
                  <textarea
                    value={editData?.content?.[0]?.content || ''}
                    onChange={(e) => {
                      if (!editData) return;
                      const newContent = [...(editData.content || [])];
                      if (newContent.length > 0) {
                        newContent[0] = { ...newContent[0], content: e.target.value };
                      } else {
                        newContent.push({ type: 'text', content: e.target.value });
                      }
                      setEditData({ ...editData, content: newContent });
                    }}
                    rows={6}
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none font-mono text-xs"
                    placeholder="Contenido de la lección (texto, código, etc.)"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleSave}
                    disabled={!editData?.title?.trim()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-600 hover:bg-green-700 disabled:bg-stone-300 dark:disabled:bg-stone-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
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
              <div className="p-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">
                    {lesson.title || '(Sin título)'}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[11px] text-stone-400 flex items-center gap-1">
                      <Clock size={10} />
                      {lesson.duration}min
                    </span>
                    {lesson.description && (
                      <span className="text-[11px] text-stone-400 truncate max-w-[200px]">
                        {lesson.description}
                      </span>
                    )}
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

      {lessons.length === 0 && (
        <div className="text-center py-8 text-stone-400 dark:text-stone-500">
          <BookOpen size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No hay lecciones aún.</p>
          <button onClick={handleAdd} className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
            Agregar primera lección
          </button>
        </div>
      )}
    </div>
  );
}
