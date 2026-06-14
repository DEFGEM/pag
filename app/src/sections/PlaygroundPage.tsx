import Playground from '@/components/Playground';
import { Code, BookOpen, Lightbulb } from 'lucide-react';

export default function PlaygroundPage() {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Code className="text-indigo-500" size={24} />
          Playground de Código
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mt-1">
          Practica React Native directamente en tu navegador. Escribe, edita y analiza código.
        </p>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-start gap-3 p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
          <BookOpen size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-indigo-800 dark:text-indigo-300">Aprende</p>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5">
              Explora los ejemplos y modifícalos para entender cómo funciona React Native.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-100 dark:border-green-900/30">
          <Code size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-green-800 dark:text-green-300">Practica</p>
            <p className="text-[11px] text-green-600 dark:text-green-400 mt-0.5">
              Escribe tu propio código y analiza la estructura de componentes.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
          <Lightbulb size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Experimenta</p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">
              Cambia valores, agrega componentes y observa los resultados del análisis.
            </p>
          </div>
        </div>
      </div>

      {/* Playground */}
      <Playground
        language="jsx"
        title="Editor de React Native"
      />
    </div>
  );
}
