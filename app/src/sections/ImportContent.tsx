import { useState, useCallback } from 'react';
import { useStore } from '@/hooks/useStore';
import { Upload, FileText, X, Loader2, BookOpen, CheckCircle2, Sparkles, FileCode, HelpCircle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import type { Difficulty, Module, Lesson } from '@/types';

export default function ImportContent() {
  const { state, dispatch, addNotification } = useStore();
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('basico');
  const [lessonCount, setLessonCount] = useState([6]);
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
      } else {
        addNotification('error', 'Formato de archivo no soportado. Usa TXT, PDF o DOCX.');
      }
    }
  }, [addNotification]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      if (isValidFile(selectedFile)) {
        setFile(selectedFile);
        setModuleName(selectedFile.name.replace(/\.[^/.]+$/, ''));
      } else {
        addNotification('error', 'Formato de archivo no soportado. Usa TXT, PDF o DOCX.');
      }
    }
  };

  const parseTextContent = (text: string, titleName: string): Module => {
    const lines = text.split('\n');
    let title = titleName;
    let parsedDifficulty = difficulty;
    let currentLessonTitle = '';
    let currentLessonDuration = 15;
    let currentLessonContent = '';
    let currentLessonSummary = '';
    const lessons: Lesson[] = [];
    const questions: any[] = [];
    
    let inContent = false;
    let inSummary = false;
    
    // Heuristic parser
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      if (line.toLowerCase().startsWith('módulo:') || line.toLowerCase().startsWith('modulo:')) {
        title = line.substring(7).trim();
      } else if (line.toLowerCase().startsWith('dificultad:')) {
        const diffVal = line.substring(11).trim().toLowerCase();
        if (['basico', 'intermedio', 'avanzado'].includes(diffVal)) {
          parsedDifficulty = diffVal as Difficulty;
        }
      } else if (line.toLowerCase().startsWith('lección') || line.toLowerCase().startsWith('leccion')) {
        // Save previous lesson if any
        if (currentLessonTitle) {
          lessons.push({
            id: `imported-lesson-${Date.now()}-${lessons.length}`,
            moduleId: `imported-mod-${Date.now()}`,
            title: currentLessonTitle,
            description: currentLessonSummary.substring(0, 150).replace(/•/g, '').trim() || `Conceptos sobre ${currentLessonTitle}.`,
            duration: currentLessonDuration,
            order: lessons.length + 1,
            content: [
              { type: 'text', content: currentLessonContent || `Contenido de la lección ${currentLessonTitle}.` },
              { type: 'summary', content: currentLessonSummary || `• Resumen de ${currentLessonTitle}` }
            ]
          });
        }
        currentLessonTitle = line.replace(/^lecci[oó]n\s*\d*:\s*/i, '').trim();
        currentLessonDuration = 15 + Math.floor(Math.random() * 15);
        currentLessonContent = '';
        currentLessonSummary = '';
        inContent = false;
        inSummary = false;
      } else if (line.toLowerCase().startsWith('duración:') || line.toLowerCase().startsWith('duracion:')) {
        const dur = parseInt(line.replace(/[^0-9]/g, ''));
        if (!isNaN(dur)) currentLessonDuration = dur;
      } else if (line.toLowerCase().startsWith('contenido:')) {
        inContent = true;
        inSummary = false;
      } else if (line.toLowerCase().startsWith('resumen:')) {
        inContent = false;
        inSummary = true;
      } else if (line === '---') {
        inContent = false;
        inSummary = false;
      } else if (inContent) {
        currentLessonContent += (currentLessonContent ? '\n' : '') + line;
      } else if (inSummary) {
        currentLessonSummary += (currentLessonSummary ? '\n' : '') + line;
      }
    }
    
    // Push last lesson
    if (currentLessonTitle) {
      lessons.push({
        id: `imported-lesson-${Date.now()}-${lessons.length}`,
        moduleId: `imported-mod-${Date.now()}`,
        title: currentLessonTitle,
        description: currentLessonSummary.substring(0, 150).replace(/•/g, '').trim() || `Conceptos sobre ${currentLessonTitle}.`,
        duration: currentLessonDuration,
        order: lessons.length + 1,
        content: [
          { type: 'text', content: currentLessonContent || `Contenido de la lección ${currentLessonTitle}.` },
          { type: 'summary', content: currentLessonSummary || `• Resumen de ${currentLessonTitle}` }
        ]
      });
    }

    // Parse questions from bottom if structured
    let currentQuestionText = '';
    let currentOptions: string[] = [];
    let currentCorrectAnswer = 0;
    let currentExplanation = '';
    let inQuestion = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (/^[0-9]+\.\s*(.*)/.test(line)) {
        if (currentQuestionText && currentOptions.length > 0) {
          questions.push({
            id: `imported-q-${Date.now()}-${questions.length}`,
            question: currentQuestionText,
            options: currentOptions,
            correctAnswer: currentCorrectAnswer,
            explanation: currentExplanation || 'Respuesta correcta basada en el contenido.'
          });
        }
        const match = line.match(/^[0-9]+\.\s*(.*)/);
        currentQuestionText = match ? match[1] : line;
        currentOptions = [];
        currentCorrectAnswer = 0;
        currentExplanation = '';
        inQuestion = true;
      } else if (inQuestion && /^[a-d]\)\s*(.*)/i.test(line)) {
        const match = line.match(/^[a-d]\)\s*(.*)/i);
        if (match) currentOptions.push(match[1]);
      } else if (inQuestion && (line.toLowerCase().startsWith('respuesta:') || line.toLowerCase().startsWith('correcto:'))) {
        const ans = line.replace(/^(respuesta|correcto):\s*/i, '').trim().toLowerCase();
        if (ans === 'a' || ans.startsWith('a)')) currentCorrectAnswer = 0;
        else if (ans === 'b' || ans.startsWith('b)')) currentCorrectAnswer = 1;
        else if (ans === 'c' || ans.startsWith('c)')) currentCorrectAnswer = 2;
        else if (ans === 'd' || ans.startsWith('d)')) currentCorrectAnswer = 3;
        else {
          const num = parseInt(ans);
          if (!isNaN(num)) currentCorrectAnswer = num - 1;
        }
      } else if (inQuestion && line.toLowerCase().startsWith('explicación:')) {
        currentExplanation = line.substring(12).trim();
      }
    }

    // Push last question
    if (currentQuestionText && currentOptions.length > 0) {
      questions.push({
        id: `imported-q-${Date.now()}-${questions.length}`,
        question: currentQuestionText,
        options: currentOptions,
        correctAnswer: currentCorrectAnswer,
        explanation: currentExplanation || 'Respuesta correcta basada en el contenido.'
      });
    }

    // Fallback/Standard generator if no structured lessons were parsed
    if (lessons.length === 0) {
      const words = text.split(/\s+/).filter(w => w.length > 0);
      const targetCount = lessonCount[0];
      const wordsPerLesson = Math.max(50, Math.ceil(words.length / targetCount));
      
      const topics = [
        'Introducción y Conceptos Básicos',
        'Configuración de Entorno',
        'Componentes Core de React Native',
        'Props, State y Ciclo de vida',
        'Estilos y Flexbox Layout',
        'Manejo de Eventos y Formularios',
        'Consumo de API Fetch/Axios',
        'Persistencia de Datos con AsyncStorage',
        'Buenas Prácticas y Rendimiento'
      ];

      for (let i = 0; i < targetCount; i++) {
        const sliceStart = i * wordsPerLesson;
        const sliceEnd = Math.min(sliceStart + wordsPerLesson, words.length);
        const lessonWords = words.slice(sliceStart, sliceEnd);
        if (lessonWords.length === 0) break;
        
        const lessonText = lessonWords.join(' ');
        const topic = topics[i % topics.length];
        lessons.push({
          id: `imported-lesson-${Date.now()}-${i}`,
          moduleId: `imported-mod-${Date.now()}`,
          title: `Lección ${i + 1}: ${topic}`,
          description: `Conceptos fundamentales y ejemplos sobre ${topic.toLowerCase()}.`,
          duration: 12 + Math.floor(Math.random() * 10),
          order: i + 1,
          content: [
            { type: 'text', content: lessonText },
            { type: 'summary', content: `• Conceptos clave de ${topic}\n• Aplicación práctica directa en tu proyecto` }
          ]
        });
      }
    }

    // Fallback questions if none parsed
    if (questions.length === 0) {
      questions.push(
        {
          id: `imported-q-${Date.now()}-1`,
          question: `¿Cuál es el tema central abordado en este módulo?`,
          options: ['Los fundamentos de desarrollo en React Native', 'La programación de servidores web', 'El diseño de bases de datos relacionales', 'La administración de sistemas operativos'],
          correctAnswer: 0,
          explanation: 'El módulo aborda de forma práctica los conceptos de desarrollo móvil en React Native.',
        },
        {
          id: `imported-q-${Date.now()}-2`,
          question: '¿Qué ventaja principal ofrece React Native?',
          options: ['Desarrollo multiplataforma con una única base de código', 'Compilación directa a código ensamblador puro', 'Mayor consumo de memoria que las apps web', 'Es exclusivo de plataformas Android'],
          correctAnswer: 0,
          explanation: 'Permite compilar a componentes nativos en iOS y Android compartiendo la lógica de JavaScript.',
        }
      );
    }

    const moduleId = `imported-mod-${Date.now()}`;
    return {
      id: moduleId,
      title,
      description: `Módulo generado automáticamente.`,
      difficulty: parsedDifficulty,
      thumbnail: '/images/module-advanced.jpg',
      estimatedHours: Math.ceil(lessons.reduce((acc, l) => acc + l.duration, 0) / 60),
      order: state.modules.length + 1,
      category: 'Personalizado',
      lessons: lessons.map(l => ({ ...l, moduleId })),
      quiz: {
        id: `quiz-${moduleId}`,
        moduleId,
        title: `Evaluación: ${title}`,
        passingScore: 70,
        questions
      }
    };
  };

  const handleGenerate = useCallback(async () => {
    let rawText = '';

    if (activeTab === 'upload') {
      if (!file || !moduleName) return;
      setIsProcessing(true);
      setProcessingStep(0);

      // Read text file
      try {
        rawText = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || '');
          reader.onerror = () => reject(new Error('Error al leer archivo'));
          reader.readAsText(file);
        });
      } catch (err) {
        addNotification('error', 'Error al leer el archivo. Inténtalo de nuevo.');
        setIsProcessing(false);
        return;
      }
    } else {
      if (!pastedText.trim() || !moduleName) return;
      setIsProcessing(true);
      setProcessingStep(0);
      rawText = pastedText;
    }

    // Simulate AI extraction phases
    await new Promise((r) => setTimeout(r, 1000));
    setProcessingStep(1);
    await new Promise((r) => setTimeout(r, 1200));
    setProcessingStep(2);
    await new Promise((r) => setTimeout(r, 1000));

    const newModule = parseTextContent(rawText, moduleName);

    setGeneratedModule(newModule);
    setIsProcessing(false);
    addNotification('success', 'Módulo generado exitosamente ✅');
  }, [file, moduleName, lessonCount, difficulty, activeTab, pastedText, addNotification]);

  const handleSave = () => {
    if (generatedModule) {
      dispatch({ type: 'ADD_IMPORTED_MODULE', module: generatedModule });
      addNotification('success', 'Módulo guardado en "Mis Módulos" 📚');
      setGeneratedModule(null);
      setFile(null);
      setPastedText('');
      setModuleName('');
    }
  };

  const downloadTemplate = () => {
    const template = `Módulo: React Native Interactivo
Dificultad: Intermedio

Lección 1: Primer Componente
Duración: 15
Contenido:
En React Native, construimos la UI usando componentes declarativos. Los componentes principales son View, Text, Image, TextInput y ScrollView.
Usa estilos a través de StyleSheet para aplicar diseño Flexbox.
---
Resumen:
• View es el equivalente a div en la web.
• Text se requiere para cualquier string de texto.

Lección 2: Navegación Stack
Duración: 20
Contenido:
React Navigation es la biblioteca estándar de facto para navegación. Stack Navigator te permite apilar pantallas.
---
Resumen:
• Stack Navigator maneja historial de pantallas.
• Permite animaciones de transición nativas.

Examen:
1. ¿Qué componente se usa para envolver texto en React Native?
a) View
b) Text
c) Paragraph
d) Label
Respuesta: b
Explicación: React Native requiere que todo texto esté dentro de un componente <Text>.

2. ¿Cuál es la biblioteca estándar para navegación en React Native?
a) React Router Dom
b) React Navigation
c) Navigation Mobile
d) Expo Router Only
Respuesta: b
Explicación: React Navigation es la solución estándar más popular para navegación.`;

    const blob = new Blob([template], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plantilla_curso_rn.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const processingSteps = [
    { label: 'Analizando contenido...', icon: FileText },
    { label: 'Generando lecciones e interactividad...', icon: Sparkles },
    { label: 'Estructurando evaluaciones de aprendizaje...', icon: BookOpen },
  ];

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Sparkles className="text-indigo-500 animate-pulse" size={24} />
          Generador de Cursos con IA
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mt-1">
          Sube tus notas, libros o documentación y crea un módulo interactivo completo con lecciones y exámenes de opción múltiple de forma instantánea.
        </p>
      </div>

      {!generatedModule ? (
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setActiveTab('upload')}
              className={`pb-3 text-sm font-medium border-b-2 px-4 transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-700 dark:text-stone-400'
              }`}
            >
              Cargar Archivo
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`pb-3 text-sm font-medium border-b-2 px-4 transition-all cursor-pointer ${
                activeTab === 'paste'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-700 dark:text-stone-400'
              }`}
            >
              Pegar Texto Manual
            </button>
          </div>

          {activeTab === 'upload' ? (
            /* Dropzone */
            <div className="space-y-3">
              {!file ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer
                    ${
                      dragActive
                        ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-stone-300 dark:border-stone-700 hover:border-indigo-400 dark:hover:border-indigo-600'
                    }
                  `}
                >
                  <Upload size={48} className="mx-auto text-stone-400 dark:text-stone-500 mb-4" />
                  <p className="text-stone-700 dark:text-stone-300 font-medium">
                    Arrastra tu archivo aquí o{' '}
                    <label className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                      selecciona de tu equipo
                      <input
                        type="file"
                        accept=".txt"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-500 mt-2">
                    Formatos soportados: TXT (Recomendado)
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
                  <FileText size={24} className="text-indigo-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-900 dark:text-stone-100 truncate">{file.name}</p>
                    <p className="text-xs text-stone-400 dark:text-stone-500">
                      {(file.size / 1024).toFixed(1)} KB · Archivo listo para importar
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

              {/* Template Download Option */}
              <div className="flex items-center justify-between p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
                <div className="flex items-center gap-2.5">
                  <FileCode size={18} className="text-indigo-500" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-indigo-950 dark:text-indigo-200">¿Quieres crear lecciones estructuradas?</p>
                    <p className="text-[11px] text-indigo-700/80 dark:text-indigo-400/80">Descarga la plantilla estructurada para importar cursos completos.</p>
                  </div>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Descargar plantilla
                </button>
              </div>
            </div>
          ) : (
            /* Text Area Paste */
            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Contenido del curso
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Pega aquí el contenido de tus notas, documentación técnica o resúmenes..."
                rows={8}
                className="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          )}

          {/* Configuration */}
          {((activeTab === 'upload' && file) || (activeTab === 'paste' && pastedText.trim())) && !isProcessing && (
            <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-6 space-y-5 shadow-sm">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">Ajustes del curso</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-600 dark:text-stone-400 mb-1.5 uppercase font-semibold tracking-wider">
                    Nombre del módulo
                  </label>
                  <input
                    type="text"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    placeholder="Ej. Navegación Avanzada"
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-600 dark:text-stone-400 mb-1.5 uppercase font-semibold tracking-wider">
                    Nivel de dificultad
                  </label>
                  <div className="flex gap-2">
                    {(['basico', 'intermedio', 'avanzado'] as Difficulty[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`
                          flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer uppercase tracking-wider
                          ${
                            difficulty === d
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                              : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                          }
                        `}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {!file && activeTab === 'paste' && (
                <div>
                  <label className="block text-xs text-stone-600 dark:text-stone-400 mb-2 uppercase font-semibold tracking-wider">
                    Número de lecciones estimadas: {lessonCount[0]}
                  </label>
                  <Slider
                    value={lessonCount}
                    onValueChange={setLessonCount}
                    min={3}
                    max={12}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!moduleName.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-stone-300 disabled:to-stone-400 dark:disabled:from-stone-700 dark:disabled:to-stone-600 text-white rounded-xl font-semibold transition-all cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
              >
                <Sparkles size={18} />
                Generar Curso con AI
              </button>
            </div>
          )}

          {/* Processing */}
          {isProcessing && (
            <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-8 text-center shadow-lg">
              <Loader2 size={36} className="mx-auto text-indigo-500 animate-spin mb-4" />
              <p className="text-stone-700 dark:text-stone-300 font-semibold">
                {processingSteps[processingStep]?.label}
              </p>
              <div className="mt-5 flex items-center justify-center gap-2">
                {processingSteps.map((step, i) => {
                  const StepIcon = step.icon;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
                        i === processingStep
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-semibold'
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
          <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/10">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">{generatedModule.title}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {generatedModule.lessons.length} lecciones · {generatedModule.estimatedHours}h · {generatedModule.difficulty}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 dark:bg-teal-900/20 dark:text-teal-400 px-3 py-1 rounded-full">
                Vista Previa
              </span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {generatedModule.lessons.map((lesson: Lesson, i: number) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between py-2.5 px-4 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-100 dark:border-stone-850 hover:bg-stone-100 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-stone-400 font-mono w-5">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate">{lesson.title}</span>
                  </div>
                  <span className="text-xs text-stone-400 font-mono ml-3">{lesson.duration}min</span>
                </div>
              ))}
            </div>

            {/* Quiz Preview */}
            <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-550 mb-3 flex items-center gap-1.5">
                <HelpCircle size={14} />
                Evaluación Generada ({generatedModule.quiz.questions.length} preguntas)
              </h4>
              <div className="space-y-3">
                {generatedModule.quiz.questions.map((q: any, i: number) => (
                  <div key={q.id} className="p-3 bg-stone-50/50 dark:bg-stone-900/30 rounded-xl border border-stone-100 dark:border-stone-800/40 text-left">
                    <p className="text-xs font-medium text-stone-800 dark:text-stone-200">
                      {i + 1}. {q.question}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {q.options.map((opt: string, idx: number) => (
                        <div
                          key={idx}
                          className={`text-[11px] px-2 py-1 rounded border ${
                            idx === q.correctAnswer
                              ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/20 dark:border-teal-800/40 dark:text-teal-400 font-medium'
                              : 'bg-white border-stone-100 text-stone-505 dark:bg-stone-900 dark:border-stone-800'
                          }`}
                        >
                          {String.fromCharCode(97 + idx)}) {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setGeneratedModule(null)}
              className="flex-1 py-3 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 rounded-xl font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer text-sm"
            >
              Descartar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-colors cursor-pointer text-sm shadow-lg shadow-indigo-500/20"
            >
              Guardar Módulo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
