import { useState, useCallback } from 'react';
import { useStore } from '@/hooks/useStore';
import { Upload, FileText, X, Loader2, BookOpen, CheckCircle2, Sparkles, FileCode, HelpCircle, File } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import QuizEditor from '@/components/QuizEditor';
import LessonEditor from '@/components/LessonEditor';
import type { Difficulty, Module, Lesson, Question } from '@/types';

async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const textParts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(' ');
    if (pageText.trim()) textParts.push(pageText);
  }
  return textParts.join('\n\n');
}

async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

function generateQuestionsFromContent(text: string, count: number): any[] {
  const sentences = text
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 300);

  const questions: any[] = [];
  const usedSentences = new Set<number>();

  for (let i = 0; i < count && sentences.length > 0; i++) {
    let sentenceIdx = Math.floor(Math.random() * sentences.length);
    let attempts = 0;
    while (usedSentences.has(sentenceIdx) && attempts < sentences.length) {
      sentenceIdx = (sentenceIdx + 1) % sentences.length;
      attempts++;
    }
    usedSentences.add(sentenceIdx);

    const sentence = sentences[sentenceIdx];
    const words = sentence.split(/\s+/).filter((w) => w.length > 3);
    const keyWord = words[Math.floor(Math.random() * words.length)] || 'concepto';

    const questionText = `Según el contenido, ¿cuál de las siguientes opciones se relaciona con: "${keyWord.slice(0, 30)}"?`;

    const correctAnswer = sentence.slice(0, 100).trim();
    const wrongAnswers = [
      'Esta información no se menciona en el documento.',
      'No tiene relación con el tema estudiado.',
      'Es incorrecta según el contenido proporcionado.',
    ];

    const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    const correctIdx = options.indexOf(correctAnswer);

    questions.push({
      id: `gen-q-${Date.now()}-${i}`,
      question: questionText,
      options: options.map((o) => o.slice(0, 120)),
      correctAnswer: correctIdx,
      explanation: `Basado en el contenido del documento: "${sentence.slice(0, 150)}..."`,
    });
  }

  if (questions.length === 0) {
    for (let i = 0; i < count; i++) {
      questions.push({
        id: `gen-q-${Date.now()}-${i}`,
        question: `Pregunta ${i + 1}: ¿Cuál es un concepto clave del contenido importado?`,
        options: [
          'Concepto principal del documento',
          'Elemento no mencionado en el texto',
          'Dato irrelevante al tema',
          'Información no encontrada',
        ],
        correctAnswer: 0,
        explanation: 'Respuesta basada en el análisis del contenido del documento.',
      });
    }
  }

  return questions;
}

function splitTextIntoLessons(text: string, count: number): { title: string; content: string }[] {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 30);
  const lessons: { title: string; content: string }[] = [];
  const perLesson = Math.max(1, Math.ceil(paragraphs.length / count));

  const topicKeywords = [
    'Introducción', 'Conceptos Básicos', 'Configuración', 'Desarrollo',
    'Componentes', 'Ejemplos', 'Práctica', 'Avanzado', 'Optimización',
    'Conclusión', 'Referencias', 'Anexos',
  ];

  for (let i = 0; i < count; i++) {
    const start = i * perLesson;
    const end = Math.min(start + perLesson, paragraphs.length);
    const lessonParagraphs = paragraphs.slice(start, end);

    if (lessonParagraphs.length === 0) break;

    const title = `Lección ${i + 1}: ${topicKeywords[i % topicKeywords.length]}`;
    const content = lessonParagraphs.join('\n\n');

    lessons.push({ title, content });
  }

  return lessons;
}

export default function ImportContent() {
  const { state, dispatch, addNotification } = useStore();
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('basico');
  const [lessonCount, setLessonCount] = useState([6]);
  const [questionCount, setQuestionCount] = useState([8]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [generatedModule, setGeneratedModule] = useState<Module | null>(null);

  const isValidFile = (f: File) => {
    return (
      f.name.endsWith('.pdf') ||
      f.name.endsWith('.docx') ||
      f.name.endsWith('.txt') ||
      f.name.endsWith('.md')
    );
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return '📄';
    if (fileName.endsWith('.docx')) return '📝';
    return '📃';
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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) {
        const droppedFile = e.dataTransfer.files[0];
        if (isValidFile(droppedFile)) {
          setFile(droppedFile);
          setModuleName(droppedFile.name.replace(/\.[^/.]+$/, ''));
        } else {
          addNotification('error', 'Formato no soportado. Usa PDF, DOCX o TXT.');
        }
      }
    },
    [addNotification]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      if (isValidFile(selectedFile)) {
        setFile(selectedFile);
        setModuleName(selectedFile.name.replace(/\.[^/.]+$/, ''));
      } else {
        addNotification('error', 'Formato no soportado. Usa PDF, DOCX o TXT.');
      }
    }
  };

  const handleGenerate = useCallback(async () => {
    let rawText = '';

    if (activeTab === 'upload') {
      if (!file || !moduleName) return;
      setIsProcessing(true);
      setProcessingStep(0);

      try {
        if (file.name.endsWith('.pdf')) {
          rawText = await extractPdfText(file);
        } else if (file.name.endsWith('.docx')) {
          rawText = await extractDocxText(file);
        } else {
          rawText = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve((e.target?.result as string) || '');
            reader.onerror = () => reject(new Error('Error al leer archivo'));
            reader.readAsText(file);
          });
        }
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

    await new Promise((r) => setTimeout(r, 800));
    setProcessingStep(1);
    await new Promise((r) => setTimeout(r, 1000));
    setProcessingStep(2);

    const lessonsData = splitTextIntoLessons(rawText, lessonCount[0]);
    const questions = generateQuestionsFromContent(rawText, questionCount[0]);

    const moduleId = `imported-mod-${Date.now()}`;
    const lessons: Lesson[] = lessonsData.map((l, i) => ({
      id: `imported-lesson-${Date.now()}-${i}`,
      moduleId,
      title: l.title,
      description: l.content.slice(0, 150).trim() + '...',
      duration: 10 + Math.floor(Math.random() * 15),
      order: i + 1,
      content: [
        { type: 'text', content: l.content },
        { type: 'summary', content: `• Resumen de ${l.title}\n• Conceptos clave del documento` },
      ],
    }));

    const newModule: Module = {
      id: moduleId,
      title: moduleName,
      description: `Módulo generado desde ${file?.name || 'texto pegado'}. Contiene ${lessons.length} lecciones y ${questions.length} preguntas.`,
      difficulty,
      thumbnail: '/images/module-advanced.jpg',
      estimatedHours: Math.ceil(lessons.reduce((acc, l) => acc + l.duration, 0) / 60),
      order: state.modules.length + 1,
      category: 'Personalizado',
      lessons,
      quiz: {
        id: `quiz-${moduleId}`,
        moduleId,
        title: `Evaluación: ${moduleName}`,
        passingScore: 70,
        questions,
      },
    };

    setGeneratedModule(newModule);
    setIsProcessing(false);
    addNotification('success', 'Módulo generado exitosamente');
  }, [file, moduleName, lessonCount, questionCount, difficulty, activeTab, pastedText, addNotification, state.modules.length]);

  const handleSave = () => {
    if (generatedModule) {
      dispatch({ type: 'ADD_IMPORTED_MODULE', module: generatedModule });
      addNotification('success', 'Módulo guardado en "Mis Módulos"');
      setGeneratedModule(null);
      setFile(null);
      setPastedText('');
      setModuleName('');
    }
  };

  const processingSteps = [
    { label: 'Extrayendo texto del documento...', icon: FileText },
    { label: 'Generando lecciones...', icon: Sparkles },
    { label: 'Creando preguntas de evaluación...', icon: HelpCircle },
  ];

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Sparkles className="text-indigo-500 animate-pulse" size={24} />
          Importar Contenido
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mt-1">
          Sube un archivo PDF, Word o TXT y genera automáticamente un módulo con lecciones y evaluación.
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
              Pegar Texto
            </button>
          </div>

          {activeTab === 'upload' ? (
            <div className="space-y-3">
              {!file ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer ${
                    dragActive
                      ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-stone-300 dark:border-stone-700 hover:border-indigo-400 dark:hover:border-indigo-600'
                  }`}
                >
                  <Upload size={48} className="mx-auto text-stone-400 dark:text-stone-500 mb-4" />
                  <p className="text-stone-700 dark:text-stone-300 font-medium">
                    Arrastra tu archivo aquí o{' '}
                    <label className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                      selecciona de tu equipo
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt,.md"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </p>
                  <div className="flex justify-center gap-4 mt-4">
                    <span className="flex items-center gap-1 text-xs text-stone-500">
                      <File size={14} /> PDF
                    </span>
                    <span className="flex items-center gap-1 text-xs text-stone-500">
                      <FileText size={14} /> DOCX
                    </span>
                    <span className="flex items-center gap-1 text-xs text-stone-500">
                      <FileCode size={14} /> TXT
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
                  <span className="text-2xl">{getFileIcon(file.name)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-900 dark:text-stone-100 truncate">{file.name}</p>
                    <p className="text-xs text-stone-400 dark:text-stone-500">
                      {(file.size / 1024).toFixed(1)} KB · {file.name.split('.').pop()?.toUpperCase()}
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
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Contenido del curso
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Pega aquí el contenido de tus notas, documentación o resúmenes..."
                rows={8}
                className="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          )}

          {/* Configuration */}
          {((activeTab === 'upload' && file) || (activeTab === 'paste' && pastedText.trim())) && !isProcessing && (
            <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-6 space-y-5 shadow-sm">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">Configuración del módulo</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-600 dark:text-stone-400 mb-1.5 uppercase font-semibold tracking-wider">
                    Nombre del módulo
                  </label>
                  <input
                    type="text"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    placeholder="Ej. Introducción a React"
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-600 dark:text-stone-400 mb-1.5 uppercase font-semibold tracking-wider">
                    Dificultad
                  </label>
                  <div className="flex gap-2">
                    {(['basico', 'intermedio', 'avanzado'] as Difficulty[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer uppercase tracking-wider ${
                          difficulty === d
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                            : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-600 dark:text-stone-400 mb-2 uppercase font-semibold tracking-wider">
                    Lecciones: {lessonCount[0]}
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

                <div>
                  <label className="block text-xs text-stone-600 dark:text-stone-400 mb-2 uppercase font-semibold tracking-wider">
                    Preguntas de evaluación: {questionCount[0]}
                  </label>
                  <Slider
                    value={questionCount}
                    onValueChange={setQuestionCount}
                    min={3}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!moduleName.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-stone-300 disabled:to-stone-400 dark:disabled:from-stone-700 dark:disabled:to-stone-600 text-white rounded-xl font-semibold transition-all cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
              >
                <Sparkles size={18} />
                Generar Módulo
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

            {/* Lesson Editor */}
            <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800">
              <LessonEditor
                lessons={generatedModule.lessons}
                onChange={(updatedLessons: Lesson[]) => {
                  setGeneratedModule({
                    ...generatedModule,
                    lessons: updatedLessons,
                    estimatedHours: Math.ceil(updatedLessons.reduce((acc, l) => acc + l.duration, 0) / 60),
                  });
                }}
              />
            </div>

            {/* Quiz Editor */}
            <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800">
              <QuizEditor
                questions={generatedModule.quiz.questions}
                onChange={(updatedQuestions: Question[]) => {
                  setGeneratedModule({
                    ...generatedModule,
                    quiz: { ...generatedModule.quiz, questions: updatedQuestions },
                  });
                }}
              />
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
