import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Copy, Check, BookOpen, Lightbulb, ClipboardCheck, ArrowLeft } from 'lucide-react';
import NotesBookmarks from '@/components/NotesBookmarks';
import gsap from 'gsap';

function renderSafeContent(text: string, codeClass = 'px-1.5 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-sm font-mono text-indigo-600 dark:text-indigo-400', strongClass = 'text-stone-900 dark:text-stone-100') {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(<code key={key++} className={codeClass}>{codeMatch[1]}</code>);
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }
    const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
    if (boldMatch) {
      parts.push(<strong key={key++} className={strongClass}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }
    const newlineMatch = remaining.match(/^\n/);
    if (newlineMatch) {
      parts.push(<br key={key++} />);
      remaining = remaining.slice(1);
      continue;
    }
    const char = remaining[0];
    parts.push(char);
    remaining = remaining.slice(1);
  }

  return parts;
}

export default function Lesson() {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const [searchParams] = useSearchParams();
  const isAdminPreview = searchParams.get('adminPreview') === 'true';
  const { state, completeLesson, addNotification } = useStore();
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { modules, userProgress } = state;
  const mod = modules.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);
  const isCompleted = isAdminPreview ? false : (lessonId ? userProgress.completedLessons.includes(lessonId) : false);
  const allLessonsCompleted = isAdminPreview ? true : (mod ? mod.lessons.every((l) => userProgress.completedLessons.includes(l.id)) : false);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' }
      );
    }
  }, [lessonId]);

  const currentIndex = mod?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  const prevLesson = currentIndex > 0 ? mod?.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < (mod?.lessons.length ?? 0) - 1 ? mod?.lessons[currentIndex + 1] : null;

  const handleComplete = useCallback(() => {
    if (isAdminPreview) {
      addNotification('info', 'Vista previa: no se guarda progreso');
      return;
    }
    if (lessonId && !isCompleted) {
      completeLesson(lessonId);
      addNotification('success', 'Lección completada ✅');
    }
  }, [lessonId, isCompleted, completeLesson, addNotification, isAdminPreview]);

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // Fallback
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  if (!mod || !lesson) {
    return (
      <div className="p-6 text-center">
        <p className="text-stone-500 dark:text-stone-400">Lección no encontrada.</p>
      </div>
    );
  }

  const typeStyles: Record<string, { icon: typeof BookOpen; bg: string; border: string; label: string }> = {
    text: { icon: BookOpen, bg: '', border: '', label: '' },
    code: { icon: Copy, bg: '', border: '', label: '' },
    summary: { icon: CheckCircle2, bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-200 dark:border-teal-800/40', label: 'Resumen' },
    tip: { icon: Lightbulb, bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800/40', label: 'Tip' },
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 mb-2">
          <button
            onClick={() => navigate(`/modules/${mod.id}${isAdminPreview ? '?adminPreview=true' : ''}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            {mod.title}
          </button>
          <span className="text-stone-300 dark:text-stone-600">/</span>
          <span>Lección {currentIndex + 1} de {mod.lessons.length}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-medium text-stone-900 dark:text-stone-100">{lesson.title}</h2>
            <p className="text-stone-600 dark:text-stone-400 mt-1">{lesson.description}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 flex-shrink-0">
            <Clock size={14} />
            {lesson.duration} min
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="space-y-6">
        {lesson.content.map((content, index) => {
          const id = `${lesson.id}-content-${index}`;

          if (content.type === 'text') {
            return (
              <div
                key={id}
                className="text-stone-700 dark:text-stone-300 leading-relaxed text-base"
              >
                {renderSafeContent(content.content)}
              </div>
            );
          }

          if (content.type === 'code') {
            return (
              <div key={id} className="relative group">
                <div className="flex items-center justify-between px-4 py-2 bg-stone-800 dark:bg-stone-950 rounded-t-xl border border-stone-700 dark:border-stone-800 border-b-0">
                  <span className="text-xs text-stone-400 font-mono">
                    {content.language || 'javascript'}
                  </span>
                  <button
                    onClick={() => copyToClipboard(content.content, id)}
                    className="flex items-center gap-1 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedCode === id ? (
                      <>
                        <Check size={12} />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-[#1c1917] dark:bg-[#0c0a09] text-[#e7e5e4] p-4 rounded-b-xl overflow-x-auto border border-stone-700 dark:border-stone-800">
                  <code className="font-mono text-sm leading-relaxed">{content.content}</code>
                </pre>
              </div>
            );
          }

          const style = typeStyles[content.type];
          const Icon = style?.icon || BookOpen;

          return (
            <div
              key={id}
              className={`rounded-xl border p-5 ${style?.bg || 'bg-stone-50 dark:bg-stone-800/50'} ${style?.border || 'border-stone-200 dark:border-stone-700'}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon size={16} className={content.type === 'summary' ? 'text-teal-600 dark:text-teal-400' : 'text-amber-600 dark:text-amber-400'} />
                <span className={`text-sm font-medium ${content.type === 'summary' ? 'text-teal-800 dark:text-teal-300' : 'text-amber-800 dark:text-amber-300'}`}>
                  {style?.label}
                </span>
              </div>
              <div className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-line leading-relaxed">
                {renderSafeContent(content.content, 'px-1 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-xs font-mono text-indigo-600 dark:text-indigo-400', '')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes & Bookmarks */}
      {!isAdminPreview && lessonId && (
        <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-700">
          <NotesBookmarks lessonId={lessonId} />
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-700">
        <div className="flex items-center justify-between">
          {/* Prev/Next Navigation */}
          <div className="flex items-center gap-3">
            {prevLesson ? (
              <button
                onClick={() => navigate(`/modules/${mod.id}/lessons/${prevLesson.id}${isAdminPreview ? '?adminPreview=true' : ''}`)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
                Anterior
              </button>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <button
                onClick={() => navigate(`/modules/${mod.id}/lessons/${nextLesson.id}${isAdminPreview ? '?adminPreview=true' : ''}`)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-all cursor-pointer"
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            ) : allLessonsCompleted ? (
              <button
                onClick={() => navigate(`/modules/${mod.id}/quiz${isAdminPreview ? '?adminPreview=true' : ''}`)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <ClipboardCheck size={16} />
                Tomar Evaluación
              </button>
            ) : (
              <div />
            )}
          </div>

          {/* Complete Button */}
          <button
            onClick={handleComplete}
            disabled={isCompleted}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
              ${
                isCompleted
                  ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 cursor-default'
                  : isAdminPreview
                    ? 'bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400 cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'
              }
            `}
          >
            <CheckCircle2 size={16} />
            {isCompleted ? 'Completada' : isAdminPreview ? 'Vista Previa' : 'Marcar como Completada'}
          </button>
        </div>
      </div>
    </div>
  );
}
