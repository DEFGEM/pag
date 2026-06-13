import { useLocation } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';



const routeNames: Record<string, string> = {
  '/': 'Dashboard',
  '/modules': 'Módulos de Aprendizaje',
  '/evaluations': 'Evaluaciones',
  '/achievements': 'Logros',
  '/import': 'Importar Contenido',
  '/admin/modules': 'Gestión de Módulos',
  '/admin/exams': 'Gestión de Exámenes',
  '/admin/stats': 'Estadísticas',
};

export default function Header() {
  const location = useLocation();



  const path = location.pathname;
  const pageTitle = routeNames[path] || 'React Native desde Cero';

  // Breadcrumb
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = segments.length === 0
    ? [{ label: 'Dashboard', path: '/' }]
    : segments.map((segment, index) => {
        const fullPath = '/' + segments.slice(0, index + 1).join('/');
        return {
          label: routeNames[fullPath] || segment.charAt(0).toUpperCase() + segment.slice(1),
          path: fullPath,
        };
      });

  return (
    <header
      className={`
        sticky top-0 z-30 flex items-center justify-between
        px-6 py-4 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-md
        border-b border-stone-200 dark:border-stone-800
        transition-all duration-300
        md:ml-0
      `}
    >
      {/* Left: Breadcrumb */}
      <div className="flex-1 min-w-0 ml-10 md:ml-0">
        <nav className="flex items-center gap-1 text-sm text-stone-400 dark:text-stone-500">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.path} className="flex items-center gap-1">
              {index > 0 && <ChevronRight size={14} />}
              <span
                className={`truncate max-w-[150px] ${
                  index === breadcrumbs.length - 1
                    ? 'text-stone-700 dark:text-stone-300 font-medium'
                    : ''
                }`}
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>
        <h1 className="text-xl font-medium text-stone-900 dark:text-stone-100 mt-0.5">
          {pageTitle}
        </h1>
      </div>

      {/* Right: Search */}
      <div className="hidden sm:flex items-center gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar lecciones..."
            aria-label="Buscar lecciones"
            className="
              w-[240px] lg:w-[320px] pl-9 pr-4 py-2.5
              bg-white dark:bg-stone-800
              border border-stone-200 dark:border-stone-700
              rounded-xl text-sm text-stone-700 dark:text-stone-200
              placeholder:text-stone-400 dark:placeholder:text-stone-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400
              transition-all duration-200
            "
          />
        </div>
      </div>
    </header>
  );
}
