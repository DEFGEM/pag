import { useStore } from '@/hooks/useStore';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Module, Question } from '@/types';
import { Edit3, Trash2, Eye, Search, Plus, BookOpen, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { difficultyBadge } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import QuizEditor from '@/components/QuizEditor';

export default function AdminModules() {
  const { state, dispatch, addNotification } = useStore();
  const { modules, importedModules } = state;
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [editModule, setEditModule] = useState<Module | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editQuestions, setEditQuestions] = useState<Question[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (editModule) {
      setEditTitle(editModule.title);
      setEditDescription(editModule.description);
      setEditQuestions(editModule.quiz?.questions || []);
    }
  }, [editModule]);

  const filtered = modules.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
  );

  const isImported = (moduleId: string) => {
    return importedModules.some((m) => m.id === moduleId);
  };

  const statusBadge = (moduleId: string) => {
    const custom = isImported(moduleId);
    return custom
      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
  };

  const handleDeleteClick = (moduleId: string) => {
    if (!isImported(moduleId)) {
      addNotification('error', 'No puedes eliminar módulos del sistema.');
      return;
    }
    setModuleToDelete(moduleId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (moduleToDelete) {
      dispatch({ type: 'DELETE_IMPORTED_MODULE', moduleId: moduleToDelete });
      addNotification('success', 'Módulo personalizado eliminado exitosamente.');
      setModuleToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium text-stone-900 dark:text-stone-100">
            Gestión de Módulos
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            {modules.length} módulos en total ({importedModules.length} personalizados)
          </p>
        </div>
        <button
          onClick={() => navigate('/import')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl transition-colors cursor-pointer shadow-sm hover:shadow"
        >
          <Plus size={16} />
          Nuevo Módulo (IA)
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Buscar módulos..."
          aria-label="Buscar módulos"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/20">
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Módulo
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Dificultad
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Lecciones
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Origen / Tipo
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((mod) => (
                <tr
                  key={mod.id}
                  className="border-b border-stone-100 dark:border-stone-700/50 last:border-0 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 rounded bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center flex-shrink-0 text-indigo-500">
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                          {mod.title}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                          {mod.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${difficultyBadge(mod.difficulty)}`}>
                      {mod.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-stone-600 dark:text-stone-400">
                      <BookOpen size={13} />
                      {mod.lessons.length}
                      <span className="text-stone-300 dark:text-stone-700 mx-1">·</span>
                      <Clock size={13} />
                      {mod.estimatedHours}h
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusBadge(mod.id)}`}>
                      {isImported(mod.id) ? 'Personalizado' : 'Sistema'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/modules/${mod.id}`)}
                        className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg transition-colors cursor-pointer group"
                        aria-label="Ver módulo"
                      >
                        <Eye size={15} className="text-stone-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                      </button>
                      <button
                        onClick={() => { setEditModule(mod); setDialogOpen(true); }}
                        className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
                        aria-label="Editar módulo"
                      >
                        <Edit3 size={15} className="text-stone-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(mod.id)}
                        disabled={!isImported(mod.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isImported(mod.id)
                            ? 'hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500'
                            : 'text-stone-300 dark:text-stone-750 cursor-not-allowed'
                        }`}
                        aria-label="Eliminar módulo"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Módulo</DialogTitle>
          </DialogHeader>
          {editModule && (
            <div className="space-y-5 py-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-wider">Título</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-lg text-sm bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1.5 uppercase tracking-wider">Descripción</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-lg text-sm bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                />
              </div>

              {/* Quiz Editor */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-700">
                <QuizEditor
                  questions={editQuestions}
                  onChange={setEditQuestions}
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-lg">
                <ShieldCheck size={16} className="text-amber-500 flex-shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  Los cambios se guardarán inmediatamente al presionar "Guardar".
                </p>
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
              onClick={() => {
                if (editModule) {
                  dispatch({
                    type: 'UPDATE_MODULE',
                    moduleId: editModule.id,
                    updates: {
                      title: editTitle,
                      description: editDescription,
                      quiz: { ...editModule.quiz, questions: editQuestions },
                    },
                  });
                  addNotification('success', 'Módulo actualizado correctamente');
                }
                setDialogOpen(false);
              }}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer font-medium"
            >
              Guardar Cambios
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle size={20} />
              ¿Confirmar eliminación?
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 text-sm text-stone-600 dark:text-stone-400">
            Esta acción eliminará de forma permanente este módulo y todo su progreso de aprendizaje asociado. Esta operación no se puede deshacer.
          </div>
          <DialogFooter>
            <button
              onClick={() => setDeleteConfirmOpen(false)}
              className="px-4 py-2 text-sm text-stone-650 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-850 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-sm bg-rose-600 text-white hover:bg-rose-700 rounded-lg transition-colors cursor-pointer font-medium"
            >
              Eliminar Permanentemente
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
