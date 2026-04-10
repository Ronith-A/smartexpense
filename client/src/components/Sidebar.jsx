import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  HiOutlineHome,
  HiOutlineBanknotes,
  HiOutlineArrowTrendingUp,
  HiOutlineCalculator,
  HiOutlineSparkles,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineArrowRightOnRectangle,
  HiOutlineXMark,
} from 'react-icons/hi2';

const NAV_ITEMS = [
  { to: '/', icon: HiOutlineHome, label: 'Dashboard' },
  { to: '/expenses', icon: HiOutlineBanknotes, label: 'Expenses' },
  { to: '/income', icon: HiOutlineArrowTrendingUp, label: 'Income' },
  { to: '/budget', icon: HiOutlineCalculator, label: 'Budget' },
  { to: '/reports', icon: HiOutlineSparkles, label: 'AI Reports' },
];

export default function Sidebar({ open, onClose }) {
  const { logout, user } = useAuth();
  const { dark, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 flex flex-col
          bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl
          border-r border-slate-200/60 dark:border-slate-700/50
          transition-transform duration-300 ease-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-slate-200/60 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/25">
              <HiOutlineBanknotes className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-primary-text">SmartExpense</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500">Finance Tracker</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <HiOutlineXMark className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60">
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 space-y-1 border-t border-slate-200/60 dark:border-slate-700/50">
          <button
            onClick={toggleTheme}
            className="sidebar-link w-full"
          >
            {dark ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
            <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={logout}
            className="sidebar-link w-full text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-300"
          >
            <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
