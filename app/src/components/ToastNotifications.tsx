import { useStore } from '@/hooks/useStore';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-teal-50 border-teal-200 text-teal-800 dark:bg-teal-900/30 dark:border-teal-700/50 dark:text-teal-300',
  error: 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-900/30 dark:border-rose-700/50 dark:text-rose-300',
  info: 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-900/30 dark:border-indigo-700/50 dark:text-indigo-300',
};

const iconColors = {
  success: 'text-teal-500 dark:text-teal-400',
  error: 'text-rose-500 dark:text-rose-400',
  info: 'text-indigo-500 dark:text-indigo-400',
};

export default function ToastNotifications() {
  const { state, dispatch } = useStore();
  const { notifications } = state;

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {notifications.map((notification) => {
        const Icon = icons[notification.type];
        return (
          <div
            key={notification.id}
            className={`
              flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg
              animate-in slide-in-from-right-4 fade-in duration-300
              ${styles[notification.type]}
            `}
          >
            <Icon size={18} className={`mt-0.5 flex-shrink-0 ${iconColors[notification.type]}`} />
            <p className="text-sm flex-1">{notification.message}</p>
            <button
              onClick={() => dispatch({ type: 'REMOVE_NOTIFICATION', id: notification.id })}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
