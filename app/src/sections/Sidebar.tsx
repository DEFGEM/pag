import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Trophy,
  FolderCog,
  FileQuestion,
  BarChart3,
  Upload,
  Sun,
  Moon,
  User,
  Atom,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Shield,
  Sparkles,
  Code,
  UserCircle,
} from 'lucide-react';

const mainNavItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Módulos', path: '/modules', icon: BookOpen },
  { label: 'Mis Módulos', path: '/my-modules', icon: FolderCog },
  { label: 'Playground', path: '/playground', icon: Code },
  { label: 'Evaluaciones', path: '/evaluations', icon: ClipboardCheck },
  { label: 'Logros', path: '/achievements', icon: Trophy },
  { label: 'Mi Perfil', path: '/profile', icon: UserCircle },
];

const adminNavItems = [
  { label: 'Gestión de Módulos', path: '/admin/modules', icon: FolderCog },
  { label: 'Gestión de Exámenes', path: '/admin/exams', icon: FileQuestion },
  { label: 'Estadísticas', path: '/admin/stats', icon: BarChart3 },
  { label: 'Importar Contenido', path: '/import', icon: Upload },
];

export default function Sidebar() {
  const { state, dispatch, logout, getOverallProgress } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, sidebarOpen, currentUserId, usersData } = state;
  const currentUser = currentUserId ? usersData[currentUserId]?.user : null;
  const isUserAdmin = currentUser?.isAdmin || false;
  const overallProgress = getOverallProgress();

  const toggleDarkMode = () => dispatch({ type: 'TOGGLE_DARK_MODE' });
  const toggleSidebar = () => dispatch({ type: 'TOGGLE_SIDEBAR' });

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItemClass = (path: string) => {
    const active = isActive(path);
    return `
      flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
      transition-all duration-200 cursor-pointer select-none group/item
      ${
        active
          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 dark:from-indigo-900/40 dark:to-purple-900/30 dark:text-indigo-300 shadow-sm'
          : 'text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800/60'
      }
    `;
  };

  const renderNavItem = (item: typeof mainNavItems[0]) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    return (
      <button
        key={item.path}
        className={navItemClass(item.path)}
        onClick={() => {
          navigate(item.path);
          if (window.innerWidth < 768) {
            dispatch({ type: 'TOGGLE_SIDEBAR' });
          }
        }}
      >
        <Icon
          size={20}
          strokeWidth={1.8}
          className={active ? 'text-indigo-600 dark:text-indigo-400' : 'group-hover/item:text-indigo-500 transition-colors'}
        />
        <span className={`${!sidebarOpen ? 'hidden' : ''}`}>{item.label}</span>
        {active && sidebarOpen && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        />
      )}

      {/* Mobile hamburger */}
      <button
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white dark:bg-stone-800 shadow-lg border border-stone-200 dark:border-stone-700 md:hidden"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 flex flex-col
          bg-stone-50 dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-[280px]' : 'w-[72px]'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-5 py-5 border-b border-stone-200 dark:border-stone-800 ${!sidebarOpen ? 'justify-center px-2' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/25">
            <Atom size={20} className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <span className="font-bold text-stone-900 dark:text-stone-100 text-[15px] leading-tight block">
                RN Academy
              </span>
              <span className="text-stone-400 dark:text-stone-500 text-[11px] flex items-center gap-1">
                <Sparkles size={10} /> Desde Cero
              </span>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <nav className={`flex-1 overflow-y-auto py-4 ${sidebarOpen ? 'px-3' : 'px-2'} space-y-1`}>
          {mainNavItems.map(renderNavItem)}

          {isUserAdmin && (
            <>
              {sidebarOpen && (
                <div className="pt-4 pb-2 px-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
                    <Shield size={10} />
                    Administración
                  </span>
                </div>
              )}
              {!sidebarOpen && <div className="my-3 border-t border-stone-200 dark:border-stone-800 mx-3" />}
              {adminNavItems.map(renderNavItem)}
            </>
          )}
        </nav>

        {/* Bottom Actions */}
        <div className={`border-t border-stone-200 dark:border-stone-800 py-3 ${sidebarOpen ? 'px-3' : 'px-2'} space-y-1`}>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Modo claro' : 'Modo oscuro'}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800/60 transition-all duration-200 cursor-pointer ${!sidebarOpen ? 'justify-center px-2' : ''}`}
          >
            {darkMode ? <Sun size={20} strokeWidth={1.8} /> : <Moon size={20} strokeWidth={1.8} />}
            {sidebarOpen && <span>{darkMode ? 'Modo claro' : 'Modo oscuro'}</span>}
          </button>

          {/* User Profile with progress */}
          <div className={`flex items-center gap-3 px-4 py-3 ${!sidebarOpen ? 'justify-center px-2' : ''}`}>
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center">
                <User size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              {/* Mini progress ring */}
              <svg className="absolute -inset-0.5 w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-200 dark:text-stone-700" />
                <circle
                  cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeDasharray={`${(overallProgress / 100) * 113} 113`}
                  className="text-indigo-500"
                />
              </svg>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">{currentUser?.name || 'Sin usuario'}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                  {overallProgress}% completado · {state.userProgress.dailyStreak} días 🔥
                </p>
              </div>
            )}
          </div>

          {/* Switch User */}
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-rose-50 hover:text-rose-600 dark:text-stone-400 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 transition-all duration-200 cursor-pointer ${!sidebarOpen ? 'justify-center px-2' : ''}`}
            aria-label="Cambiar de usuario"
          >
            <LogOut size={20} strokeWidth={1.8} />
            {sidebarOpen && <span>Cambiar usuario</span>}
          </button>

          {/* Toggle Button (desktop) */}
          <button
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Colapsar menú' : 'Expandir menú'}
            className="hidden md:flex w-full items-center justify-center py-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors cursor-pointer"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}
