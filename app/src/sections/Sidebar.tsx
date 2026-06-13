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
} from 'lucide-react';

const mainNavItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Módulos', path: '/modules', icon: BookOpen },
  { label: 'Evaluaciones', path: '/evaluations', icon: ClipboardCheck },
  { label: 'Logros', path: '/achievements', icon: Trophy },
];

const adminNavItems = [
  { label: 'Gestión de Módulos', path: '/admin/modules', icon: FolderCog },
  { label: 'Gestión de Exámenes', path: '/admin/exams', icon: FileQuestion },
  { label: 'Estadísticas', path: '/admin/stats', icon: BarChart3 },
  { label: 'Importar Contenido', path: '/import', icon: Upload },
];

export default function Sidebar() {
  const { state, dispatch, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, sidebarOpen, isAdmin, currentUserId, usersData } = state;
  const currentUser = currentUserId ? usersData[currentUserId]?.user : null;

  const toggleDarkMode = () => dispatch({ type: 'TOGGLE_DARK_MODE' });
  const toggleSidebar = () => dispatch({ type: 'TOGGLE_SIDEBAR' });

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItemClass = (path: string) => {
    const active = isActive(path);
    return `
      flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
      transition-all duration-200 cursor-pointer select-none
      ${
        active
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
          : 'text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800/60'
      }
    `;
  };

  const renderNavItem = (item: typeof mainNavItems[0]) => {
    const Icon = item.icon;
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
        <Icon size={20} strokeWidth={1.8} />
        <span className={`${!sidebarOpen ? 'hidden' : ''}`}>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        />
      )}

      {/* Mobile hamburger */}
      <button
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-stone-800 shadow-md md:hidden"
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
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
            <Atom size={20} className="text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-medium text-stone-900 dark:text-stone-100 text-[15px] leading-tight truncate">
              React Native<br />
              <span className="text-stone-500 dark:text-stone-400 text-[13px]">desde Cero</span>
            </span>
          )}
        </div>

        {/* Main Navigation */}
        <nav className={`flex-1 overflow-y-auto py-4 ${sidebarOpen ? 'px-3' : 'px-2'} space-y-1`}>
          {mainNavItems.map(renderNavItem)}

          {isAdmin && (
            <>
              {sidebarOpen && (
                <div className="pt-4 pb-2 px-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800/60 transition-all duration-200 cursor-pointer ${!sidebarOpen ? 'justify-center px-2' : ''}`}
          >
            {darkMode ? <Sun size={20} strokeWidth={1.8} /> : <Moon size={20} strokeWidth={1.8} />}
            {sidebarOpen && <span>{darkMode ? 'Modo claro' : 'Modo oscuro'}</span>}
          </button>

          {/* User Profile */}
          <div className={`flex items-center gap-3 px-4 py-3 ${!sidebarOpen ? 'justify-center px-2' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">{currentUser?.name || 'Sin usuario'}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate">Racha: {state.userProgress.dailyStreak} días 🔥</p>
              </div>
            )}
          </div>

          {/* Switch User */}
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800/60 transition-all duration-200 cursor-pointer ${!sidebarOpen ? 'justify-center px-2' : ''}`}
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
