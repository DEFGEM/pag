import { useStore } from '@/hooks/useStore';
import { useState } from 'react';
import type { Module } from '@/types';
import { Edit3, Trash2, Eye, Search, Plus, BookOpen, Clock } from 'lucide-react';
import { difficultyBadge } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function AdminModules() {
  const { state } = useStore();
  const { modules } = state;
  const [search, setSearch] = useState('');
  const [editModule, setEditModule] = useState<Module | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = modules.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (active: boolean) => {
    return active
      ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
      : 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-400';
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
            {modules.length} módulos en total
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl transition-colors cursor-pointer">
          <Plus size={16} />
          Nuevo Módulo
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
          className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-700">
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Módulo
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Dificultad
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Lecciones
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
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
                      <img src={mod.thumbnail} alt="" className="w-10 h-7 object-cover rounded" />
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
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyBadge(mod.difficulty)}`}>
                      {mod.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-stone-600 dark:text-stone-400">
                      <BookOpen size={14} />
                      {mod.lessons.length}
                      <span className="text-stone-400 mx-1">·</span>
                      <Clock size={14} />
                      {mod.estimatedHours}h
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge(true)}`}>
                      Activo
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
                        aria-label="Ver módulo"
                      >
                        <Eye size={15} className="text-stone-500" />
                      </button>
                      <button
                        onClick={() => { setEditModule(mod); setDialogOpen(true); }}
                        className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
                        aria-label="Editar módulo"
                      >
                        <Edit3 size={15} className="text-stone-500" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors cursor-pointer"
                        aria-label="Eliminar módulo"
                      >
                        <Trash2 size={15} className="text-rose-500" />
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Módulo</DialogTitle>
          </DialogHeader>
          {editModule && (
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm text-stone-600 dark:text-stone-400 mb-1.5">Título</label>
                <input
                  type="text"
                  defaultValue={editModule.title}
                  className="w-full px-4 py-2 border border-stone-200 dark:border-stone-700 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-600 dark:text-stone-400 mb-1.5">Descripción</label>
                <textarea
                  defaultValue={editModule.description}
                  rows={3}
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
              onClick={() => { setDialogOpen(false); }}
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
