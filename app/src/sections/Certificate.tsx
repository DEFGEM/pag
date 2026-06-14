import { useStore } from '@/hooks/useStore';
import { Award, Download, Printer } from 'lucide-react';
import { useRef } from 'react';

export default function Certificate() {
  const { state } = useStore();
  const { currentUserId, usersData, modules, userProgress } = state;
  const currentUser = currentUserId ? usersData[currentUserId]?.user : null;
  const certificateRef = useRef<HTMLDivElement>(null);

  const allModulesCompleted = modules.length > 0 && userProgress.completedModules.length === modules.length;
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedQuizzes = Object.keys(userProgress.completedQuizzes).length;

  if (!currentUser || !allModulesCompleted) return null;

  const completionDate = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simple text certificate for download
    const certText = `
CERTIFICADO DE COMPLETACIÓN
==========================

React Native Academy - Desde Cero

Este certificado se otorga a:

${currentUser.name}

Por haber completado exitosamente todos los módulos del curso de React Native:

- Total de módulos completados: ${modules.length}
- Total de lecciones completadas: ${totalLessons}
- Evaluaciones aprobadas: ${completedQuizzes}
- Fecha de finalización: ${completionDate}

¡Felicitaciones por tu dedicación y esfuerzo!

React Native Academy
    `;

    const blob = new Blob([certText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificado-rn-academy-${currentUser.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Award className="text-amber-500" size={28} />
            Mi Certificado
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mt-1">
            Has completado todos los módulos del curso
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-300 rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            <Printer size={14} />
            Imprimir
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            <Download size={14} />
            Descargar
          </button>
        </div>
      </div>

      {/* Certificate */}
      <div
        ref={certificateRef}
        className="bg-white rounded-2xl border-4 border-double border-amber-300 p-12 text-center shadow-2xl relative overflow-hidden print:shadow-none print:border-black"
      >
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-amber-400 print:border-black" />
        <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-amber-400 print:border-black" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-amber-400 print:border-black" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-amber-400 print:border-black" />

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl print:shadow-none">
            <Award size={40} className="text-white" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-stone-900 mb-2 print:text-black">
            Certificado de Completación
          </h1>
          <p className="text-lg text-stone-600 print:text-gray-600">
            React Native Academy - Desde Cero
          </p>

          {/* Divider */}
          <div className="my-8 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent print:via-gray-400" />
            <Award size={24} className="text-amber-500 print:text-gray-600" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent print:via-gray-400" />
          </div>

          {/* Recipient */}
          <p className="text-stone-600 print:text-gray-600 mb-2">Este certificado se otorga a:</p>
          <h2 className="text-3xl font-bold text-indigo-600 print:text-black mb-6">
            {currentUser.name}
          </h2>

          {/* Description */}
          <p className="text-stone-600 print:text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
            Por haber completado exitosamente todos los {modules.length} módulos del curso,
            demostrando dedicación, esfuerzo y compromiso con el aprendizaje del desarrollo móvil con React Native.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-12 mb-8">
            <div>
              <p className="text-2xl font-bold text-stone-900 print:text-black">{modules.length}</p>
              <p className="text-sm text-stone-500 print:text-gray-600">Módulos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900 print:text-black">{totalLessons}</p>
              <p className="text-sm text-stone-500 print:text-gray-600">Lecciones</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900 print:text-black">{completedQuizzes}</p>
              <p className="text-sm text-stone-500 print:text-gray-600">Evaluaciones</p>
            </div>
          </div>

          {/* Date and Signature */}
          <div className="flex items-end justify-between max-w-md mx-auto pt-8 border-t border-stone-200 print:border-gray-300">
            <div className="text-center">
              <p className="text-sm font-medium text-stone-900 print:text-black">{completionDate}</p>
              <p className="text-xs text-stone-500 print:text-gray-600">Fecha de Finalización</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-px bg-stone-900 print:bg-black mb-2" />
              <p className="text-sm font-medium text-stone-900 print:text-black">React Native Academy</p>
              <p className="text-xs text-stone-500 print:text-gray-600">Institución</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}