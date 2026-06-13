import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { Atom, User, ArrowRight, LogIn, Plus } from 'lucide-react';

export default function UserLogin() {
  const { state, setUser, registerUser } = useStore();
  const [showNewUser, setShowNewUser] = useState(false);
  const [newName, setNewName] = useState('');

  const existingUsers = Object.values(state.usersData);

  const handleSelectUser = (userId: string) => {
    setUser(userId);
  };

  const handleCreateUser = () => {
    const name = newName.trim();
    if (!name) return;
    const userId = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (!userId) return;
    registerUser(userId, name);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center mx-auto mb-4">
            <Atom size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-medium text-stone-900 dark:text-stone-100">
            React Native desde Cero
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-2">
            Selecciona un usuario para continuar
          </p>
        </div>

        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 space-y-4">
          {existingUsers.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                Usuarios existentes
              </p>
              {existingUsers.map(({ user }) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-stone-200 dark:border-stone-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{user.name}</p>
                  </div>
                  <LogIn size={16} className="text-stone-300 dark:text-stone-600 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))}
            </div>
          )}

          {!showNewUser ? (
            <button
              onClick={() => setShowNewUser(true)}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl text-sm font-medium text-stone-600 dark:text-stone-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
            >
              <Plus size={16} />
              Nuevo usuario
            </button>
          ) : (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                Nuevo usuario
              </p>
              <input
                type="text"
                placeholder="Tu nombre"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateUser()}
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowNewUser(false); setNewName(''); }}
                  className="flex-1 py-2.5 text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={!newName.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 dark:disabled:bg-stone-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ArrowRight size={16} />
                  Entrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
