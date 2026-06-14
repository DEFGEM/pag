import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { Plus, BookOpen, Trash2, Clock, FileText, Search, X } from 'lucide-react';
import { difficultyBadge } from '@/lib/utils';
import type { Difficulty, Module, Lesson, Question } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function MyModules() {
  const { state, dispatch, addNotification } = useStore();
  const { currentUserId, usersData } = state;
  const currentUser = currentUserId ? usersData[currentUserId] : null;
  const customModules = currentUser?.customModules || [];

  const [search, setSearch] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Create form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('basico');
  const [newLessons, setNewLessons] = useState<{ title: string; content: string; duration: number }[]>([
    { title: '', content: '', duration: 10 },
  ]);

  const filtered = customModules.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
  );

  const resetCreateForm = () => {
    setNewTitle('');
    setNewDescription('');
    setNewDifficulty('basico');
    setNewLessons([{ title: '', content: '', duration: 10 }]);
  };

  const handleCreate = () => {
    if (!newTitle.trim()) {
      addNotification('error', 'El título es obligatorio');
      return;
    }
    if (newLessons.some((l) => !l.title.trim())) {
      addNotification('error', 'Todas las lecciones deben tener título');
      return;
    }

    const moduleId = `user-mod-${Date.now()}`;
    const lessons: Lesson[] = newLessons
      .filter((l) => l.title.trim())
      .map((l, i) => ({
        id: `user-lesson-${Date.now()}-${i}`,
        moduleId,
        title: l.title,
        description: l.content.slice(0, 150).trim() || l.title,
        duration: l.duration,
        order: i + 1,
        content: [
          { type: 'text' as const, content: l.content || 'Sin contenido' },
        ],
      }));

    const questions: Question[] = [
      {
        id: `user-q-${Date.now()}-0`,
        question: `Pregunta de ejemplo para ${newTitle}`,
        options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        correctAnswer: 0,
        explanation: 'Esta es una pregunta de ejemplo. Puedes editarla después.',
      },
    ];

    const newModule: Module = {
      id: moduleId,
      title: newTitle,
      description: newDescription || `Módulo personalizado: ${newTitle}`,
      difficulty: newDifficulty,
      thumbnail: '/images/module-advanced.jpg',
      lessons,
      estimatedHours: Math.ceil(lessons.reduce((acc, l) => acc + l.duration, 0) / 60),
      order: state.modules.length + 1,
      category: 'Personalizado',
      quiz: {
        id: `quiz-${moduleId}`,
        moduleId,
        title: `Evaluación: ${newTitle}`,
        passingScore: 70,
        questions,
      },
    };

    dispatch({ type: 'ADD_USER_MODULE', module: newModule });
    addNotification('success', 'Módulo creado exitosamente');
    setShowCreateDialog(false);
    resetCreateForm();
  };

  const handleDelete = (moduleId: string) => {
    dispatch({ type: 'DELETE_USER_MODULE', moduleId });
    addNotification('success', 'Módulo eliminado');
    setDeleteConfirm(null);
  };

  const addLesson = () => {
    setNewLessons([...newLessons, { title: '', content: '', duration: 10 }]);
  };

  const removeLesson = (index: number) => {
    if (newLessons.length > 1) {
      setNewLessons(newLessons.filter((_, i) => i !== index));
    }
  };

  const updateLesson = (index: number, field: 'title' | 'content' | 'duration', value: string | number) => {
    const updated = [...newLessons];
    updated[index] = { ...updated[index], [field]: value };
    setNewLessons(updated);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium text-stone-900 dark:text-stone-100">
            Mis Módulos
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            {customModules.length} módulo{customModules.length !== 1 ? 's' : ''} personalizado{customModules.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { resetCreateForm(); setShowCreateDialog(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
        >
          <Plus size={16} />
          Nuevo Módulo
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Buscar mis módulos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
        />
      </div>

      {/* Modules List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={32} className="text-indigo-400" />
          </div>
          <h3 className="font-medium text-stone-900 dark:text-stone-100 mb-2">
            {search ? 'No se encontraron módulos' : 'No tienes módulos personalizados'}
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
            {search
              ? 'Intenta con otros términos de búsqueda'
              : 'Crea tu primer módulo para organizar tu contenido personalizado.'}
          </p>
          {!search && (
            <button
              onClick={() => { resetCreateForm(); setShowCreateDialog(true); }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
            >
              <Plus size={16} className="inline mr-2" />
              Crear Módulo
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((mod) => (
            <div
              key={mod.id}
              className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Module Header */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${difficultyBadge(mod.difficulty)}`}>
                    {mod.difficulty}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    Personalizado
                  </span>
                </div>
                <h3 className="font-medium text-stone-900 dark:text-stone-100 mb-1 line-clamp-1">
                  {mod.title}
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 mb-4">
                  {mod.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
                  <span className="flex items-center gap-1">
                    <FileText size={12} />
                    {mod.lessons.length} lecciones
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {mod.estimatedHours}h
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 py-3 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-700/50 flex items-center justify-end gap-1">
                <button
                  onClick={() => setDeleteConfirm(mod.id)}
                  className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500 rounded-lg transition-colors cursor-pointer"
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Módulo</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-wider">
                Título del módulo *
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ej: Mi módulo de React Native"
                className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-lg text-sm bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-wider">
                Descripción
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe de qué trata este módulo..."
                rows={3}
                className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-lg text-sm bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-wider">
                Dificultad
              </label>
              <div className="flex gap-2">
                {(['basico', 'intermedio', 'avanzado'] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setNewDifficulty(d)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer uppercase tracking-wider ${
                      newDifficulty === d
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Lessons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Lecciones
                </label>
                <button
                  onClick={addLesson}
                  className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium cursor-pointer"
                >
                  <Plus size={12} />
                  Agregar
                </button>
              </div>
              <div className="space-y-3">
                {newLessons.map((lesson, i) => (
                  <div key={i} className="p-3 bg-stone-50 dark:bg-stone-900/50 rounded-lg border border-stone-200 dark:border-stone-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                        Lección {i + 1}
                      </span>
                      {newLessons.length > 1 && (
                        <button
                          onClick={() => removeLesson(i)}
                          className="p-1 text-stone-400 hover:text-rose-500 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) => updateLesson(i, 'title', e.target.value)}
                      placeholder="Título de la lección"
                      className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 mb-2"
                    />
                    <textarea
                      value={lesson.content}
                      onChange={(e) => updateLesson(i, 'content', e.target.value)}
                      placeholder="Contenido de la lección..."
                      rows={3}
                      className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none mb-2"
                    />
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-stone-400" />
                      <input
                        type="number"
                        value={lesson.duration}
                        onChange={(e) => updateLesson(i, 'duration', parseInt(e.target.value) || 10)}
                        min={1}
                        max={120}
                        className="w-16 px-2 py-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-xs text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      />
                      <span className="text-xs text-stone-400">min</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowCreateDialog(false)}
              className="px-4 py-2 text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer font-medium"
            >
              Crear Módulo
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-600">¿Eliminar módulo?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Esta acción eliminará el módulo y todo su contenido permanentemente.
          </p>
          <DialogFooter>
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="px-4 py-2 text-sm bg-rose-600 text-white hover:bg-rose-700 rounded-lg transition-colors cursor-pointer font-medium"
            >
              Eliminar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}