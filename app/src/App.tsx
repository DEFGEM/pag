import { Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from '@/hooks/useStore';
import { useStore } from '@/hooks/useStore';
import Sidebar from '@/sections/Sidebar';
import Header from '@/sections/Header';
import Dashboard from '@/sections/Dashboard';
import Modules from '@/sections/Modules';
import ModuleDetail from '@/sections/ModuleDetail';
import Lesson from '@/sections/Lesson';
import Quiz from '@/sections/Quiz';
import Evaluations from '@/sections/Evaluations';
import Achievements from '@/sections/Achievements';
import ImportContent from '@/sections/ImportContent';
import PlaygroundPage from '@/sections/PlaygroundPage';
import AdminModules from '@/sections/AdminModules';
import AdminExams from '@/sections/AdminExams';
import AdminStats from '@/sections/AdminStats';
import ToastNotifications from '@/components/ToastNotifications';
import UserLogin from '@/sections/UserLogin';

function AppLayout() {
  const { state } = useStore();
  const { darkMode, sidebarOpen, currentUserId } = state;

  if (!currentUserId) {
    return <UserLogin />;
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors duration-200">
        <Sidebar />
        <div
          className={`
            transition-all duration-300 min-h-screen
            ${sidebarOpen ? 'md:ml-[280px]' : 'md:ml-[72px]'}
          `}
        >
          <Header />
          <main className="min-h-[calc(100vh-64px)]">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/modules/:moduleId" element={<ModuleDetail />} />
              <Route path="/modules/:moduleId/lessons/:lessonId" element={<Lesson />} />
              <Route path="/modules/:moduleId/quiz" element={<Quiz />} />
              <Route path="/evaluations" element={<Evaluations />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/import" element={<ImportContent />} />
              <Route path="/playground" element={<PlaygroundPage />} />
              <Route path="/admin/modules" element={<AdminModules />} />
              <Route path="/admin/exams" element={<AdminExams />} />
              <Route path="/admin/stats" element={<AdminStats />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <ToastNotifications />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppLayout />
    </StoreProvider>
  );
}
