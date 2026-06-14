import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { Bookmark, BookmarkCheck, Plus, Trash2, Edit3, Save, X, Clock } from 'lucide-react';
import type { Note } from '@/types';

interface NotesBookmarksProps {
  lessonId: string;
}

export default function NotesBookmarks({ lessonId }: NotesBookmarksProps) {
  const { state, dispatch } = useStore();
  const { userProgress, modules } = state;
  const [activeTab, setActiveTab] = useState<'notes' | 'bookmarks'>('notes');
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editContent, setEditContent] = useState('');

  const isBookmarked = userProgress.bookmarks.includes(lessonId);
  const lessonNotes = userProgress.notes.filter((n) => n.lessonId === lessonId);

  // Get bookmarked lessons
  const bookmarkedLessons = userProgress.bookmarks
    .map((bId) => {
      for (const mod of modules) {
        const lesson = mod.lessons.find((l) => l.id === bId);
        if (lesson) return { ...lesson, moduleTitle: mod.title, moduleIcon: mod.thumbnail || '📚' };
      }
      return null;
    })
    .filter(Boolean);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    dispatch({ type: 'ADD_NOTE', lessonId, content: newNote.trim() });
    setNewNote('');
  };

  const handleUpdateNote = () => {
    if (!editingNote || !editContent.trim()) return;
    dispatch({ type: 'UPDATE_NOTE', noteId: editingNote.id, content: editContent.trim() });
    setEditingNote(null);
    setEditContent('');
  };

  const handleDeleteNote = (noteId: string) => {
    dispatch({ type: 'DELETE_NOTE', noteId });
  };

  const handleToggleBookmark = () => {
    dispatch({ type: 'TOGGLE_BOOKMARK', lessonId });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {/* Bookmark Button */}
      <button
        onClick={handleToggleBookmark}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
          isBookmarked
            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
        }`}
      >
        {isBookmarked ? (
          <BookmarkCheck size={18} className="text-amber-500" />
        ) : (
          <Bookmark size={18} />
        )}
        {isBookmarked ? 'Guardado en favoritos' : 'Guardar en favoritos'}
      </button>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 dark:border-stone-700">
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 text-sm font-medium border-b-2 px-4 transition-all cursor-pointer ${
            activeTab === 'notes'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-700 dark:text-stone-400'
          }`}
        >
          Notas ({lessonNotes.length})
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`pb-3 text-sm font-medium border-b-2 px-4 transition-all cursor-pointer ${
            activeTab === 'bookmarks'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-700 dark:text-stone-400'
          }`}
        >
          Favoritos ({bookmarkedLessons.length})
        </button>
      </div>

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className="space-y-3">
          {/* Add Note */}
          <div className="flex gap-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Escribe una nota sobre esta lección..."
              rows={2}
              className="flex-1 px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
            />
            <button
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 dark:disabled:bg-stone-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed h-fit"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Notes List */}
          {lessonNotes.length > 0 ? (
            <div className="space-y-2">
              {lessonNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                >
                  {editingNote?.id === note.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateNote}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                        >
                          <Save size={12} />
                          Guardar
                        </button>
                        <button
                          onClick={() => { setEditingNote(null); setEditContent(''); }}
                          className="flex items-center gap-1 px-3 py-1.5 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-xs font-medium rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                        >
                          <X size={12} />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 dark:border-stone-700">
                        <span className="text-[11px] text-stone-400 flex items-center gap-1">
                          <Clock size={10} />
                          {formatDate(note.updatedAt)}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => { setEditingNote(note); setEditContent(note.content); }}
                            className="p-1 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors cursor-pointer"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-stone-400 py-6">
              No hay notas aún. Escribe tu primera nota sobre esta lección.
            </p>
          )}
        </div>
      )}

      {/* Bookmarks Tab */}
      {activeTab === 'bookmarks' && (
        <div>
          {bookmarkedLessons.length > 0 ? (
            <div className="space-y-2">
              {bookmarkedLessons.map((lesson) => (
                <div
                  key={lesson!.id}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors cursor-pointer"
                  onClick={() => {
                    const mod = modules.find((m) => m.lessons.some((l) => l.id === lesson!.id));
                    if (mod) {
                      window.location.href = `/modules/${mod.id}/lessons/${lesson!.id}`;
                    }
                  }}
                >
                  <span className="text-xl">{lesson!.moduleIcon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                      {lesson!.title}
                    </p>
                    <p className="text-[11px] text-stone-400 truncate">
                      {lesson!.moduleTitle}
                    </p>
                  </div>
                  <BookmarkCheck size={16} className="text-amber-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-stone-400 py-6">
              No hay lecciones guardadas. Haz clic en el botón de favorito para guardar una lección.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
