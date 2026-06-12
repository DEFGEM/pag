import { useStore } from '@/hooks/useStore';
import { Lock, Trophy } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Achievements() {
  const { state } = useStore();
  const { achievements } = state;
  const gridRef = useRef<HTMLDivElement>(null);

  const unlocked = achievements.filter((a) => a.unlockedAt);
  const locked = achievements.filter((a) => !a.unlockedAt);

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-stone-900 dark:text-stone-100">
          Tus Logros
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mt-1">
          {unlocked.length} de {achievements.length} logros desbloqueados
        </p>
        <div className="mt-3 h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden max-w-xs">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full transition-all duration-700"
            style={{ width: `${(unlocked.length / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Unlocked first */}
        {unlocked.map((ach) => (
          <div
            key={ach.id}
            className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-5 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={ach.icon}
                  alt={ach.title}
                  className="w-14 h-14 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const iconDiv = document.createElement('div');
                      iconDiv.className = 'w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center';
                      parent.appendChild(iconDiv);
                    }
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <Trophy size={12} className="text-amber-500" />
                  <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Desbloqueado
                  </span>
                </div>
                <h4 className="font-medium text-stone-900 dark:text-stone-100">{ach.title}</h4>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{ach.description}</p>
                {ach.unlockedAt && (
                  <p className="text-xs text-stone-400 dark:text-stone-500 mt-2">
                    {new Date(ach.unlockedAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Locked */}
        {locked.map((ach) => (
          <div
            key={ach.id}
            className="bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700/50 p-5 opacity-60 grayscale"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
                <Lock size={24} className="text-stone-400 dark:text-stone-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <Lock size={12} className="text-stone-400" />
                  <span className="text-[11px] font-medium text-stone-500 dark:text-stone-500 uppercase tracking-wider">
                    Bloqueado
                  </span>
                </div>
                <h4 className="font-medium text-stone-700 dark:text-stone-400">{ach.title}</h4>
                <p className="text-sm text-stone-500 dark:text-stone-500 mt-0.5">{ach.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
