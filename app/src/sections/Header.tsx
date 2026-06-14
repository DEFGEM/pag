import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { Search, ChevronRight, X, BookOpen, FileText } from 'lucide-react';

const routeNames: Record<string, string> = {
  '/': 'Dashboard',
  '/modules': 'Módulos de Aprendizaje',
  '/evaluations': 'Evaluaciones',
  '/achievements': 'Logros',
  '/import': 'Importar Contenido',
  '/playground': 'Playground',
  '/admin/modules': 'Gestión de Módulos',
  '/admin/exams': 'Gestión de Exámenes',
  '/admin/stats': 'Estadísticas',
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { modules } = state;

  const path = location.pathname;
  const pageTitle = routeNames[path] || 'React Native desde Cero';

  // Search results
  const searchResults = searchQuery.trim().length > 1
    ? modules.flatMap((mod) => {
        const moduleMatch = mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mod.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchingLessons = mod.lessons.filter(
          (l) => l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const results: { type: 'module' | 'lesson'; title: string; subtitle: string; path: string; icon: typeof BookOpen }[] = [];
        if (moduleMatch) {
          results.push({
            type: 'module',
            title: mod.title,
            subtitle: mod.description.slice(0, 80),
            path: `/modules/${mod.id}`,
            icon: BookOpen,
          });
        }
        matchingLessons.forEach((l) => {
          results.push({
            type: 'lesson',
            title: l.title,
            subtitle: `${mod.title} · ${l.duration}min`,
            path: `/modules/${mod.id}/lessons/${l.id}`,
            icon: FileText,
          });
        });
        return results;
      }).slice(0, 8)
    : [];

  // Close search on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <div className="hidden sm:flex items-center gap-3 relative" ref={searchRef}>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar módulos o lecciones..."
            aria-label="Buscar módulos o lecciones"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(e.target.value.trim().length > 1);
            }}
            onFocus={() => searchQuery.trim().length > 1 && setShowResults(true)}
            className="
              w-[240px] lg:w-[320px] pl-9 pr-8 py-2.5
              bg-white dark:bg-stone-800
              border border-stone-200 dark:border-stone-700
              rounded-xl text-sm text-stone-700 dark:text-stone-200
              placeholder:text-stone-400 dark:placeholder:text-stone-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400
              transition-all duration-200
            "
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setShowResults(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full right-0 mt-2 w-[360px] bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow-xl overflow-hidden z-50">
            <div className="p-2 max-h-[320px] overflow-y-auto">
              {searchResults.map((result, i) => {
                const Icon = result.icon;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      navigate(result.path);
                      setSearchQuery('');
                      setShowResults(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors cursor-pointer text-left"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      result.type === 'module'
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500'
                        : 'bg-teal-50 dark:bg-teal-900/30 text-teal-500'
                    }`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                        {result.title}
                      </p>
                      <p className="text-[11px] text-stone-400 dark:text-stone-500 truncate">
                        {result.subtitle}
                      </p>
                    </div>
                    <span className="text-[10px] text-stone-400 uppercase font-medium">
                      {result.type === 'module' ? 'Módulo' : 'Lección'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {showResults && searchQuery.trim().length > 1 && searchResults.length === 0 && (
          <div className="absolute top-full right-0 mt-2 w-[360px] bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow-xl p-6 text-center z-50">
            <p className="text-sm text-stone-500 dark:text-stone-400">No se encontraron resultados</p>
          </div>
        )}
      </div>
    </header>
  );
}
