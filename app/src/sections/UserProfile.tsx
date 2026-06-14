import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { User, Mail, Calendar, BookOpen, Clock, Trophy, Flame, Save, Download, Shield, FolderCog, ArrowLeft, FileText, Eye } from 'lucide-react';
import { difficultyBadge } from '@/lib/utils';

interface UserProfileProps {
  viewUserId?: string;
}

export default function UserProfile({ viewUserId }: UserProfileProps) {
  const { userId } = useParams<{ userId: string }>();
  const effectiveUserId = viewUserId || userId;

  const { state, addNotification } = useStore();
  const navigate = useNavigate();
  const { currentUserId, usersData, modules } = state;

  // Determine which user to show
  const isAdminView = effectiveUserId && effectiveUserId !== currentUserId;
  const targetUserId = effectiveUserId || currentUserId;
  const targetUser = targetUserId ? usersData[targetUserId] : null;
  const targetProgress = targetUser
    ? { ...state.userProgress, ...targetUser.progress }
    : state.userProgress;
  const currentUserData = targetUser?.user || (currentUserId ? usersData[currentUserId]?.user : null);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUserData?.name || '');
  const [editEmail, setEditEmail] = useState(currentUserData?.email || '');
  const [showExportConfirm, setShowExportConfirm] = useState(false);

  if (!currentUserData || !targetUser) return null;

  const overallProgress = (() => {
    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completed = targetProgress.completedLessons.length;
    return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  })();

  const completedModules = targetProgress.completedModules.length;
  const totalModules = modules.length;
  const completedLessons = targetProgress.completedLessons.length;
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const studyHours = Math.floor(targetProgress.studyTimeMinutes / 60);
  const studyMinutes = targetProgress.studyTimeMinutes % 60;
  const completedQuizzes = Object.keys(targetProgress.completedQuizzes).length;
  const customModules = targetUser.customModules || [];

  const handleSaveProfile = () => {
    if (!editName.trim() || !editEmail.trim()) {
      addNotification('error', 'Nombre y correo son obligatorios');
      return;
    }
    const usersDataCopy = { ...state.usersData };
    if (usersDataCopy[targetUserId!]) {
      usersDataCopy[targetUserId!] = {
        ...usersDataCopy[targetUserId!],
        user: {
          ...usersDataCopy[targetUserId!].user,
          name: editName.trim(),
          email: editEmail.trim(),
        },
      };
      localStorage.setItem('pag_users', JSON.stringify(usersDataCopy));
      addNotification('success', 'Perfil actualizado correctamente');
      setIsEditing(false);
      window.location.reload();
    }
  };

  const handleExportProgress = () => {
    const exportData = {
      user: {
        name: currentUserData.name,
        email: currentUserData.email,
        createdAt: currentUserData.createdAt,
      },
      progress: {
        completedLessons: targetProgress.completedLessons.length,
        completedModules: targetProgress.completedModules.length,
        completedQuizzes: targetProgress.completedQuizzes,
        studyTimeMinutes: targetProgress.studyTimeMinutes,
        dailyStreak: targetProgress.dailyStreak,
        notes: (targetProgress.notes || []).length,
        bookmarks: (targetProgress.bookmarks || []).length,
      },
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progreso-rn-academy-${currentUserData.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addNotification('success', 'Progreso exportado correctamente');
    setShowExportConfirm(false);
  };

  const statCards = [
    { label: 'Progreso General', value: `${overallProgress}%`, icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'Módulos', value: `${completedModules}/${totalModules}`, icon: BookOpen, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
    { label: 'Lecciones', value: `${completedLessons}/${totalLessons}`, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Tiempo de Estudio', value: `${studyHours}h ${studyMinutes}m`, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Evaluaciones', value: `${completedQuizzes}/${totalModules}`, icon: Trophy, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { label: 'Racha', value: `${targetProgress.dailyStreak} días`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  const pageTitle = isAdminView ? `Perfil de ${currentUserData.name}` : 'Mi Perfil';
  const pageSubtitle = isAdminView ? 'Vista del perfil del usuario' : 'Gestiona tu información y revisa tu progreso';

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        {isAdminView && (
          <button
            onClick={() => navigate('/admin/stats')}
            className="flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer mb-3"
          >
            <ArrowLeft size={14} />
            Volver a Estadísticas
          </button>
        )}
        <h2 className="text-2xl font-medium text-stone-900 dark:text-stone-100">
          {pageTitle}
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mt-1">
          {pageSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 text-center">
            {/* Avatar */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center">
                <User size={40} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <svg className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" className="text-stone-200 dark:text-stone-700" />
                <circle
                  cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={`${(overallProgress / 100) * 289} 289`}
                  className="text-indigo-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-stone-900 dark:text-stone-100">{overallProgress}%</span>
              </div>
            </div>

            <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-lg">{currentUserData.name}</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{currentUserData.email}</p>

            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-stone-400 dark:text-stone-500">
              <Calendar size={12} />
              <span>Miembro desde {new Date(currentUserData.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
            </div>

            {currentUserData.isAdmin && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
                <Shield size={12} />
                Administrador
              </div>
            )}

            {/* Actions - only show for own profile */}
            {!isAdminView && (
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full py-2.5 px-4 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-300 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                >
                  {isEditing ? 'Cancelar' : 'Editar Perfil'}
                </button>
                <button
                  onClick={() => setShowExportConfirm(true)}
                  className="w-full py-2.5 px-4 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download size={14} />
                  Exportar Progreso
                </button>
                <button
                  onClick={() => navigate('/my-modules')}
                  className="w-full py-2.5 px-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <FolderCog size={14} />
                  Mis Módulos
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats & Edit */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Form - only for own profile */}
          {!isAdminView && isEditing && (
            <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">Editar Información</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1.5">Nombre</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1.5">Correo electrónico</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
                >
                  <Save size={14} />
                  Guardar Cambios
                </button>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4"
                >
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                    <Icon size={18} className={stat.color} />
                  </div>
                  <p className="text-xl font-bold text-stone-900 dark:text-stone-100">{stat.value}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6">
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">Actividad Reciente</h3>
            {targetProgress.completedLessons.length === 0 && Object.keys(targetProgress.completedQuizzes).length === 0 ? (
              <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-4">
                {isAdminView ? 'Este usuario aún no ha completado ninguna actividad.' : 'Aún no has completado ninguna actividad. ¡Comienza a aprender!'}
              </p>
            ) : (
              <div className="space-y-3">
                {targetProgress.completedModules.slice(-3).reverse().map((moduleId) => {
                  const mod = modules.find((m) => m.id === moduleId);
                  if (!mod) return null;
                  return (
                    <div key={moduleId} className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-900/50 rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                        <Trophy size={14} className="text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100">Módulo completado</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{mod.title}</p>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${difficultyBadge(mod.difficulty)}`}>
                        {mod.difficulty}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quiz Scores */}
          {Object.keys(targetProgress.completedQuizzes).length > 0 && (
            <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">Scores de Evaluaciones</h3>
              <div className="space-y-2">
                {Object.entries(targetProgress.completedQuizzes).map(([qId, score]) => {
                  const mod = modules.find((m) => m.quiz.id === qId);
                  const quizScore = score as number;
                  const passed = quizScore >= 70;
                  return (
                    <div key={qId} className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-900/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${passed ? 'bg-teal-500' : 'bg-rose-500'}`} />
                      <span className="text-sm text-stone-700 dark:text-stone-300 flex-1 truncate">
                        {mod ? mod.title : qId}
                      </span>
                      <span className={`text-sm font-bold ${passed ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {quizScore}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Modules */}
          {customModules.length > 0 && (
            <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">
                {isAdminView ? 'Módulos Personalizados' : 'Mis Módulos Personalizados'}
              </h3>
              <div className="space-y-2">
                {customModules.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => navigate(`/modules/${m.id}${isAdminView ? '?adminPreview=true' : ''}`)}
                    className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <FolderCog size={14} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">{m.title}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{m.lessons.length} lecciones · {m.estimatedHours}h</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${difficultyBadge(m.difficulty)}`}>
                      {m.difficulty}
                    </span>
                    <Eye size={14} className="text-purple-300 dark:text-purple-600 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Confirmation Dialog */}
      {showExportConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Download size={18} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 dark:text-stone-100">Exportar Progreso</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">Se descargará un archivo JSON</p>
              </div>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
              Se exportará tu información de progreso incluyendo módulos completados, evaluaciones, tiempo de estudio y racha.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExportConfirm(false)}
                className="flex-1 py-2.5 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 rounded-xl text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleExportProgress}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
              >
                Exportar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}