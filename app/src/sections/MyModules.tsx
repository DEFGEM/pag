import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { Upload, FileText, X, Loader2, BookOpen, CheckCircle2, Sparkles, FileCode, HelpCircle, File, Search, Trash2, Clock, Eye, Edit3 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import QuizEditor from '@/components/QuizEditor';
import LessonEditor from '@/components/LessonEditor';
import { difficultyBadge } from '@/lib/utils';
import type { Difficulty, Module, Lesson, Question } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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

function generateQuestionsFromContent(text: string, count: number): Question[] {
  const sentences = text
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 300);

  const questions: Question[] = [];
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
      id: `user-q-${Date.now()}-${i}`,
      question: questionText,
      options: options.map((o) => o.slice(0, 120)),
      correctAnswer: correctIdx,
      explanation: `Basado en el contenido del documento: "${sentence.slice(0, 150)}..."`,
    });
  }

  if (questions.length === 0) {
    for (let i = 0; i < count; i++) {
      questions.push({
        id: `user-q-${Date.now()}-${i}`,
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

export default function MyModules() {
  const { state, dispatch, addNotification } = useStore();
  const navigate = useNavigate();
  const { currentUserId, usersData } = state;
  const currentUser = currentUserId ? usersData[currentUserId] : null;
  const customModules = currentUser?.customModules || [];

  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Import state
  const [activeTab, setActiveTab] = useState<'import' | 'list' | 'edit'>('list');
  const [editModuleData, setEditModuleData] = useState<Module | null>(null);
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

  const filtered = customModules.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
  );

  const isValidFile = (f: File) => {
    return f.name.endsWith('.pdf') || f.name.endsWith('.docx') || f.name.endsWith('.txt') || f.name.endsWith('.md');
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return '📄';
    if (fileName.endsWith('.docx')) return '📝';
    return '📃';
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
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

    if (activeTab === 'import') {
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
      } catch {
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

    const moduleId = `user-mod-${Date.now()}`;
    const lessons: Lesson[] = lessonsData.map((l, i) => ({
      id: `user-lesson-${Date.now()}-${i}`,
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
      dispatch({ type: 'ADD_USER_MODULE', module: generatedModule });
      addNotification('success', 'Módulo guardado en "Mis Módulos"');
      setGeneratedModule(null);
      setFile(null);
      setPastedText('');
      setModuleName('');
      setActiveTab('list');
    }
  };

  const handleDelete = (moduleId: string) => {
    dispatch({ type: 'DELETE_USER_MODULE', moduleId });
    addNotification('success', 'Módulo eliminado');
    setDeleteConfirm(null);
  };

  const handleSaveEdit = () => {
    if (editModuleData && generatedModule) {
      dispatch({
        type: 'UPDATE_USER_MODULE',
        moduleId: editModuleData.id,
        updates: {
          title: generatedModule.title,
          description: generatedModule.description,
          lessons: generatedModule.lessons,
          estimatedHours: generatedModule.estimatedHours,
          quiz: generatedModule.quiz,
          difficulty: generatedModule.difficulty,
        },
      });
      addNotification('success', 'Módulo actualizado correctamente');
      setActiveTab('list');
      setEditModuleData(null);
      setGeneratedModule(null);
    }
  };

  const handleDiscard = () => {
    setGeneratedModule(null);
    setFile(null);
    setPastedText('');
    setModuleName('');
  };

  const processingSteps = [
    { label: 'Extrayendo texto del documento...', icon: FileText },
    { label: 'Generando lecciones...', icon: Sparkles },
    { label: 'Creando preguntas de evaluación...', icon: HelpCircle },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium text-stone-900 dark:text-stone-100">
            Mis Módulos
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            {customModules.length} módulo{customModules.length !== 1 ? 's' : ''} personalizado{customModules.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'list' && (
            <button
              onClick={() => {
                handleDiscard();
                setActiveTab('import');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              <Sparkles size={16} />
              Importar Contenido
            </button>
          )}
          {activeTab === 'edit' && (
            <button
              onClick={() => { handleDiscard(); setEditModuleData(null); setActiveTab('list'); }}
              className="flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-300 text-sm rounded-xl transition-colors cursor-pointer"
            >
              Ver Mis Módulos
            </button>
          )}
        </div>
      </div>

      {activeTab === 'import' && !generatedModule ? (
        <div className="space-y-6">
          {/* Tabs: Upload / Paste */}
          <div className="flex border-b border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setActiveTab('import')}
              className={`pb-3 text-sm font-medium border-b-2 px-4 transition-all cursor-pointer ${
                'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold'
              }`}
            >
              Importar Contenido
            </button>
          </div>

          <div className="space-y-3">
            {/* Upload Area */}
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
                  <span className="flex items-center gap-1 text-xs text-stone-500"><File size={14} /> PDF</span>
                  <span className="flex items-center gap-1 text-xs text-stone-500"><FileText size={14} /> DOCX</span>
                  <span className="flex items-center gap-1 text-xs text-stone-500"><FileCode size={14} /> TXT</span>
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

            {/* Paste Text */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                O pega el contenido directamente
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Pega aquí el contenido de tus notas, documentación o resúmenes..."
                rows={6}
                className="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          {/* Configuration */}
          {((file) || pastedText.trim()) && !isProcessing && (
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
                    placeholder="Ej: Introducción a React"
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
      ) : (activeTab === 'import' || activeTab === 'edit') && generatedModule ? (
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
              onClick={() => {
                handleDiscard();
                setEditModuleData(null);
                setActiveTab('list');
              }}
              className="flex-1 py-3 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 rounded-xl font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer text-sm"
            >
              Descartar
            </button>
            <button
              onClick={activeTab === 'edit' ? handleSaveEdit : handleSave}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-colors cursor-pointer text-sm shadow-lg shadow-indigo-500/20"
            >
              {activeTab === 'edit' ? 'Guardar Cambios' : 'Guardar Módulo'}
            </button>
          </div>
        </div>
      ) : (
        /* Module List */
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar mis módulos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mx-auto mb-4">
                <BookOpen size={32} className="text-indigo-400" />
              </div>
              <h3 className="font-medium text-stone-900 dark:text-stone-100 mb-2">
                {search ? 'No se encontraron módulos' : 'No tienes módulos personalizados'}
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
                {search
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Importa un archivo o pega contenido para crear tu primer módulo.'}
              </p>
              {!search && (
                <button
                  onClick={() => {
                    handleDiscard();
                    setActiveTab('import');
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
                >
                  <Sparkles size={16} className="inline mr-2" />
                  Importar Contenido
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((mod) => (
                <div
                  key={mod.id}
                  className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${difficultyBadge(mod.difficulty)}`}>
                        {mod.difficulty}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        Personalizado
                      </span>
                    </div>
                    <h3 className="font-medium text-stone-900 dark:text-stone-100 mb-1 line-clamp-1">
                      {mod.title}
                    </h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 mb-4">
                      {mod.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
                      <span className="flex items-center gap-1">
                        <FileText size={12} />
                        {mod.lessons.length} lecciones
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {mod.estimatedHours}h
                      </span>
                    </div>
                  </div>
                  <div className="px-5 py-3 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/modules/${mod.id}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye size={12} />
                        Ver
                      </button>
                      <button
                        onClick={() => {
                          setEditModuleData(mod);
                          setGeneratedModule(mod);
                          setActiveTab('edit');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit3 size={12} />
                        Editar
                      </button>
                    </div>
                    <button
                      onClick={() => setDeleteConfirm(mod.id)}
                      className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-600">¿Eliminar módulo?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Esta acción eliminará el módulo y todo su contenido permanentemente.
          </p>
          <DialogFooter>
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="px-4 py-2 text-sm bg-rose-600 text-white hover:bg-rose-700 rounded-lg transition-colors cursor-pointer font-medium"
            >
              Eliminar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}