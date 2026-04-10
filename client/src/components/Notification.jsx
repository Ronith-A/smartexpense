import { useEffect, useState } from 'react';
import { HiCheckCircle, HiExclamationTriangle, HiXCircle, HiXMark } from 'react-icons/hi2';

const ICONS = {
  success: HiCheckCircle,
  warning: HiExclamationTriangle,
  error: HiXCircle,
  info: HiCheckCircle,
};

const COLORS = {
  success: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400',
  warning: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400',
  error: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400',
  info: 'bg-primary-50 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/30 text-primary-700 dark:text-primary-400',
};

export default function Notification({ message, type = 'info', onClose, duration = 4000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const Icon = ICONS[type];

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-xl backdrop-blur-sm transition-all duration-300 ${COLORS[type]} ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium pr-2">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-auto hover:opacity-70 transition-opacity">
        <HiXMark className="w-4 h-4" />
      </button>
    </div>
  );
}
