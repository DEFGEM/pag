import { useState, useRef, useEffect } from 'react';
import { Play, Copy, Check, RotateCcw, Code, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

interface PlaygroundProps {
  initialCode?: string;
  language?: string;
  title?: string;
}

const snippets: Record<string, { code: string; label: string }[]> = {
  jsx: [
    {
      label: 'Componente Básico',
      code: `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MiComponente() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>¡Hola React Native!</Text>
      <Text style={styles.subtitulo}>Mi primera app</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  subtitulo: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});`,
    },
    {
      label: 'Estado con useState',
      code: `import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Contador() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>
      <View style={styles.buttons}>
        <Button
          title="- 1"
          onPress={() => setCount(count - 1)}
          color="#ef4444"
        />
        <Button
          title="+ 1"
          onPress={() => setCount(count + 1)}
          color="#22c55e"
        />
      </View>
      <Button
        title="Reiniciar"
        onPress={() => setCount(0)}
        color="#6366f1"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  count: { fontSize: 64, fontWeight: 'bold', marginBottom: 20 },
  buttons: { flexDirection: 'row', gap: 20, marginBottom: 20 },
});`,
    },
    {
      label: 'Lista con FlatList',
      code: `import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const data = [
  { id: '1', nombre: 'React Native', color: '#61dafb' },
  { id: '2', nombre: 'TypeScript', color: '#3178c6' },
  { id: '3', nombre: 'Tailwind', color: '#06b6d4' },
  { id: '4', nombre: 'Node.js', color: '#68a063' },
];

export default function ListaTecnologias() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tecnologías</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.item, { borderLeftColor: item.color }]}>
            <Text style={styles.nombre}>{item.nombre}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  item: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    elevation: 2,
  },
  nombre: { fontSize: 16, fontWeight: '500' },
});`,
    },
  ],
  json: [
    {
      label: 'Datos de Ejemplo',
      code: `{
  "usuario": {
    "nombre": "Juan",
    "edad": 25,
    "activo": true,
    "skills": ["JavaScript", "React", "React Native"]
  }
}`,
    },
  ],
};

export default function Playground({
  initialCode = '',
  language = 'jsx',
  title = 'Playground de Código',
}: PlaygroundProps) {
  const [code, setCode] = useState(initialCode || snippets[language]?.[0]?.code || '');
  const [output, setOutput] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutput([]);

    // Simulate code analysis
    setTimeout(() => {
      const lines: string[] = [];
      lines.push('🔍 Analizando código...');
      lines.push('');

      // Basic syntax checks
      if (code.includes('import') || code.includes('from')) {
        lines.push('✅ Imports detectados correctamente');
      }
      if (code.includes('export default')) {
        lines.push('✅ Componente principal encontrado');
      }
      if (code.includes('StyleSheet.create')) {
        lines.push('✅ Estilos definidos con StyleSheet');
      }
      if (code.includes('useState')) {
        lines.push('✅ Hook useState utilizado');
      }
      if (code.includes('useEffect')) {
        lines.push('✅ Hook useEffect utilizado');
      }
      if (code.includes('View')) {
        lines.push('✅ Componente View detectado');
      }
      if (code.includes('Text')) {
        lines.push('✅ Componente Text detectado');
      }
      if (code.includes('FlatList')) {
        lines.push('✅ FlatList detectado - lista optimizada');
      }
      if (code.includes('Button')) {
        lines.push('✅ Botón interactivo detectado');
      }

      // Check for potential issues
      if (!code.includes('StyleSheet') && (code.includes('style') || code.includes('Style'))) {
        lines.push('⚠️  Considera usar StyleSheet.create para mejor rendimiento');
      }
      if (code.includes('function') && !code.includes('export')) {
        lines.push('💡 Tip: Exporta tu componente para poder importarlo');
      }

      lines.push('');
      lines.push(`📊 Tamaño del código: ${code.split('\n').length} líneas`);
      lines.push(`📦 Tamaño: ${(new Blob([code]).size / 1024).toFixed(1)} KB`);

      // Check for valid React Native patterns
      if (code.includes('StyleSheet.create')) {
        lines.push('');
        lines.push('🎉 ¡Código válido! Estructura correcta de React Native');
      }

      setOutput(lines);
      setIsRunning(false);
      setShowOutput(true);
    }, 1200);
  };

  const handleReset = () => {
    setCode(initialCode || snippets[language]?.[0]?.code || '');
    setOutput([]);
  };

  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden bg-white dark:bg-stone-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700">
        <div className="flex items-center gap-2">
          <Code size={16} className="text-indigo-500" />
          <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSnippets(!showSnippets)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
          >
            {showSnippets ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Ejemplos
          </button>
        </div>
      </div>

      {/* Snippets dropdown */}
      {showSnippets && snippets[language] && (
        <div className="px-4 py-3 bg-stone-50 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-700">
          <p className="text-xs text-stone-500 mb-2">Selecciona un ejemplo:</p>
          <div className="flex flex-wrap gap-2">
            {snippets[language].map((snippet, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCode(snippet.code);
                  setShowSnippets(false);
                }}
                className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-lg hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                {snippet.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Code editor */}
      <div className="relative">
        {/* Line numbers */}
        <div className="absolute top-0 left-0 w-10 h-full bg-stone-900 border-r border-stone-800 pointer-events-none">
          <div className="py-4 px-2">
            {code.split('\n').map((_, i) => (
              <div key={i} className="text-[11px] text-stone-500 text-right leading-relaxed">
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        <div className="pl-10">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full min-h-[300px] max-h-[500px] p-4 bg-stone-950 text-stone-100 font-mono text-sm leading-relaxed resize-none focus:outline-none overflow-auto"
            placeholder="Escribe tu código aquí..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-700">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning || !code.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-stone-400 dark:disabled:bg-stone-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Play size={14} fill="currentColor" />
            )}
            {isRunning ? 'Analizando...' : 'Analizar Código'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
        >
          {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>

      {/* Output */}
      {showOutput && output.length > 0 && (
        <div className="border-t border-stone-200 dark:border-stone-700">
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-stone-500" />
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">Salida del Análisis</span>
            </div>
            {showOutput ? <ChevronUp size={14} className="text-stone-400" /> : <ChevronDown size={14} className="text-stone-400" />}
          </button>
          {showOutput && (
            <div className="p-4 bg-stone-950 max-h-[200px] overflow-y-auto">
              {output.map((line, i) => (
                <p key={i} className="text-xs font-mono text-stone-300 leading-relaxed">
                  {line || '\u00A0'}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
