import { useState, useCallback } from 'react';
import { useStore } from '@/hooks/useStore';
import { Upload, FileText, X, Loader2, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import type { Difficulty, Module, Lesson } from '@/types';

export default function ImportContent() {
  const { state, dispatch, addNotification } = useStore();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [moduleName, setModuleName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('basico');
  const [lessonCount, setLessonCount] = useState([8]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [generatedModule, setGeneratedModule] = useState<Module | null>(null);

  const isValidFile = (f: File) => {
    return ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(f.type) ||
      f.name.endsWith('.pdf') || f.name.endsWith('.docx') || f.name.endsWith('.txt');
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidFile(droppedFile)) {
        setFile(droppedFile);
        setModuleName(droppedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      if (isValidFile(selectedFile)) {
        setFile(selectedFile);
        setModuleName(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const getLessonTopic = (index: number) => {
    const topics = [
      'Introducción y Conceptos Básicos',
      'Configuración del Entorno',
      'Estructura del Proyecto',
      'Componentes Fundamentales',
      'Manejo de Estado',
      'Navegación entre Pantallas',
      'Consumo de APIs',
      'Optimización de Rendimiento',
      'Testing y Debugging',
      'Despliegue y Publicación',
      'Arquitectura Avanzada',
      'Integración Nativa',
      'Seguridad y Autenticación',
      'Patrones de Diseño',
      'Mantenimiento y Escalabilidad',
      'Análisis de Métricas',
      'CI/CD y Automatización',
      'Monitoreo en Producción',
      'Actualizaciones OTA',
      'Casos de Estudio',
    ];
    return topics[index % topics.length];
  };

  const handleGenerate = useCallback(async () => {
    if (!file || !moduleName) return;

    setIsProcessing(true);
    setProcessingStep(0);

    // Simulate processing steps
    await new Promise((r) => setTimeout(r, 1500));
    setProcessingStep(1);
    await new Promise((r) => setTimeout(r, 2000));
    setProcessingStep(2);
    await new Promise((r) => setTimeout(r, 1500));

    // Generate fake module (IDs generated once per generation)
    const now = Date.now();
    const lessons: Lesson[] = Array.from({ length: lessonCount[0] }, (_, i) => ({
      id: `imported-${now}-${i}`,
      moduleId: `imported-${now}`,
      title: `Lección ${i + 1}: ${getLessonTopic(i)}`,
      description: `Conceptos clave sobre ${getLessonTopic(i).toLowerCase()} extraídos del documento.`,
      duration: 15 + Math.floor(Math.random() * 20),
      order: i + 1,
      content: [
        { type: 'text', content: `Contenido generado automáticamente basado en el documento "${file.name}". Esta lección cubre los conceptos fundamentales de ${getLessonTopic(i).toLowerCase()}.` },
        { type: 'summary', content: `• Conceptos clave de ${getLessonTopic(i)}\n• Aplicaciones prácticas\n• Ejercicios recomendados` },
      ],
    }));

    const newModule: Module = {
      id: `imported-${now}`,
      title: moduleName,
      description: `Módulo generado automáticamente a partir de "${file.name}". Contiene ${lessonCount[0]} lecciones organizadas por nivel ${difficulty}.`,
      difficulty,
      thumbnail: '/images/module-advanced.jpg',
      estimatedHours: Math.ceil(lessons.reduce((acc, l) => acc + l.duration, 0) / 60),
      order: state.modules.length + 1,
      category: 'Personalizado',
      lessons,
      quiz: {
        id: `quiz-imported-${now}`,
        moduleId: `imported-${now}`,
        title: `Evaluación: ${moduleName}`,
        passingScore: 70,
        questions: [
          {
            id: `q-imp-1`,
            question: '¿Cuál es el objetivo principal de este módulo?',
            options: ['Aprender conceptos básicos', 'Dominar temas avanzados', 'Aplicar conocimientos prácticos', 'Todos los anteriores'],
            correctAnswer: 3,
            explanation: 'El módulo cubre conceptos desde básicos hasta avanzados con aplicaciones prácticas.',
          },
          {
            id: `q-imp-2`,
            question: '¿Qué herramienta se recomienda para práctica?',
            options: ['VS Code', 'Android Studio', 'Xcode', 'Todas las anteriores'],
            correctAnswer: 3,
            explanation: 'Dependiendo de la plataforma objetivo, cualquiera de estas herramientas puede ser útil.',
          },
        ],
      },
    };

    setGeneratedModule(newModule);
    setIsProcessing(false);
    addNotification('success', 'Módulo generado exitosamente ✅');
  }, [file, moduleName, lessonCount, difficulty, state.modules, addNotification]);

  const handleSave = () => {
    if (generatedModule) {
      dispatch({ type: 'ADD_IMPORTED_MODULE', module: generatedModule });
      addNotification('success', 'Módulo guardado en "Mis Módulos" 📚');
      setGeneratedModule(null);
      setFile(null);
      setModuleName('');
    }
  };

  const processingSteps = [
    { label: 'Analizando documento...', icon: FileText },
    { label: 'Extrayendo contenido...', icon: Sparkles },
    { label: 'Generando lecciones...', icon: BookOpen },
  ];

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-stone-900 dark:text-stone-100">
          Importar Contenido
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mt-1">
          Sube un documento para generar un módulo de aprendizaje personalizado.
        </p>
      </div>

      {!generatedModule ? (
        <div className="space-y-6">
          {/* Dropzone */}
          {!file ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200
                ${
                  dragActive
                    ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-stone-300 dark:border-stone-600 hover:border-stone-400 dark:hover:border-stone-500'
                }
              `}
            >
              <Upload size={48} className="mx-auto text-stone-400 dark:text-stone-500 mb-4" />
              <p className="text-stone-700 dark:text-stone-300 font-medium">
                Arrastra archivos aquí o{' '}
                <label className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                  haz click para seleccionar
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </p>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
                Formatos soportados: PDF, DOCX, TXT
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
              <FileText size={24} className="text-indigo-500" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-900 dark:text-stone-100 truncate">{file.name}</p>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => { setFile(null); setModuleName(''); }}
                className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} className="text-stone-500" />
              </button>
            </div>
          )}

          {/* Configuration */}
          {file && !isProcessing && (
            <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-6 space-y-5">
              <h3 className="font-medium text-stone-900 dark:text-stone-100">Configuración</h3>

              <div>
                <label className="block text-sm text-stone-600 dark:text-stone-400 mb-1.5">
                  Nombre del módulo
                </label>
                <input
                  type="text"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-sm text-stone-600 dark:text-stone-400 mb-1.5">
                  Nivel de dificultad
                </label>
                <div className="flex gap-2">
                  {(['basico', 'intermedio', 'avanzado'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`
                        flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer
                        ${
                          difficulty === d
                            ? 'bg-indigo-600 text-white'
                            : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-600'
                        }
                      `}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-stone-600 dark:text-stone-400 mb-3">
                  Número de lecciones: {lessonCount[0]}
                </label>
                <Slider
                  value={lessonCount}
                  onValueChange={setLessonCount}
                  min={3}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-stone-400 mt-1">
                  <span>3</span>
                  <span>20</span>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!moduleName}
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 dark:disabled:bg-stone-700 text-white rounded-xl font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <Sparkles size={18} />
                Generar Módulo con AI
              </button>
            </div>
          )}

          {/* Processing */}
          {isProcessing && (
            <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-8 text-center">
              <Loader2 size={32} className="mx-auto text-indigo-500 animate-spin mb-4" />
              <p className="text-stone-700 dark:text-stone-300 font-medium">
                {processingSteps[processingStep]?.label}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                {processingSteps.map((step, i) => {
                  const StepIcon = step.icon;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
                        i === processingStep
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                          : i < processingStep
                          ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400'
                          : 'bg-stone-100 dark:bg-stone-700 text-stone-400 dark:text-stone-500'
                      }`}
                    >
                      <StepIcon size={12} />
                      {i < processingStep && <CheckCircle2 size={12} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Generated Preview */
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-medium text-stone-900 dark:text-stone-100">{generatedModule.title}</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {generatedModule.lessons.length} lecciones · {generatedModule.estimatedHours}h · {generatedModule.difficulty}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {generatedModule.lessons.map((lesson: Lesson, i: number) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 py-2.5 px-3 bg-stone-50 dark:bg-stone-900/50 rounded-lg"
                >
                  <span className="text-xs text-stone-400 font-mono w-6">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-sm text-stone-700 dark:text-stone-300 flex-1">{lesson.title}</span>
                  <span className="text-xs text-stone-400">{lesson.duration}min</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setGeneratedModule(null)}
              className="flex-1 py-3 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 rounded-xl font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Regenerar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors cursor-pointer"
            >
              Guardar Módulo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
