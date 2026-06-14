import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/hooks/useStore';
import { Atom, User, ArrowRight, LogIn, Plus, Sparkles, BookOpen, Trophy, Zap } from 'lucide-react';
import gsap from 'gsap';

export default function UserLogin() {
  const { state, setUser, registerUser } = useStore();
  const [showNewUser, setShowNewUser] = useState(false);
  const [newName, setNewName] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const existingUsers = Object.values(state.usersData);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (heroRef.current) {
      tl.fromTo(heroRef.current.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 });
    }
    if (cardRef.current) {
      tl.fromTo(cardRef.current, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, '-=0.3');
    }
    if (featuresRef.current) {
      tl.fromTo(featuresRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, '-=0.3');
    }
  }, []);

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

  const features = [
    { icon: BookOpen, label: '15 Módulos', desc: 'Desde JS hasta arquitectura' },
    { icon: Trophy, label: 'Evaluaciones', desc: 'Valida tu aprendizaje' },
    { icon: Zap, label: 'Interactivo', desc: 'Código y ejercicios' },
    { icon: Sparkles, label: 'IA', desc: 'Genera cursos personalizados' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pattern-dots pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Hero */}
        <div ref={heroRef} className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/25 animate-float">
            <Atom size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            React Native <span className="text-gradient">Academy</span>
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-3 text-base leading-relaxed">
            Aprende desarrollo móvil desde cero hasta nivel avanzado.<br />
            Tu camino hacia apps profesionales comienza aquí.
          </p>
        </div>

        {/* Features strip */}
        <div ref={featuresRef} className="grid grid-cols-4 gap-2 mb-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="text-center p-2.5 rounded-xl bg-white/60 dark:bg-stone-800/60 backdrop-blur-sm border border-stone-200/50 dark:border-stone-700/50">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-1.5">
                  <Icon size={14} className="text-indigo-500" />
                </div>
                <p className="text-[10px] font-semibold text-stone-700 dark:text-stone-300 leading-tight">{f.label}</p>
                <p className="text-[9px] text-stone-400 dark:text-stone-500 mt-0.5 leading-tight">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Login card */}
        <div ref={cardRef} className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 space-y-4 shadow-xl shadow-stone-900/5 dark:shadow-stone-900/30">
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{user.name}</p>
                    <p className="text-[11px] text-stone-400 dark:text-stone-500">
                      Registrado {new Date(user.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <LogIn size={16} className="text-stone-300 dark:text-stone-600 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))}
            </div>
          )}

          {!showNewUser ? (
            <button
              onClick={() => setShowNewUser(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl text-sm font-medium text-stone-600 dark:text-stone-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all cursor-pointer"
            >
              <Plus size={16} />
              {existingUsers.length > 0 ? 'Nuevo usuario' : 'Crear usuario para comenzar'}
            </button>
          ) : (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                Nuevo usuario
              </p>
              <input
                type="text"
                placeholder="¿Cómo te llamas?"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateUser()}
                className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowNewUser(false); setNewName(''); }}
                  className="flex-1 py-2.5 text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={!newName.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-stone-300 disabled:to-stone-400 dark:disabled:from-stone-700 dark:disabled:to-stone-600 text-white rounded-xl text-sm font-medium transition-all cursor-pointer disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 disabled:shadow-none"
                >
                  <ArrowRight size={16} />
                  Comenzar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-stone-400 dark:text-stone-500 mt-6">
          Plataforma educativa de React Native · 15 módulos · +80 lecciones
        </p>
      </div>
    </div>
  );
}
