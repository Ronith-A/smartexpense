import { useState, useEffect, useCallback } from 'react';
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineArrowDownTray,
  HiOutlineBanknotes,
} from 'react-icons/hi2';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../services/expenseService';
import { exportToCSV } from '../services/exportService';
import ExpenseForm from '../components/ExpenseForm';
import Notification from '../components/Notification';

const CATEGORIES = [
  'All', 'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
  'Bills & Utilities', 'Healthcare', 'Education', 'Travel',
  'Groceries', 'Subscriptions', 'Other',
];

const CATEGORY_COLORS = {
  'Food & Dining': 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
  'Transportation': 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  'Shopping': 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400',
  'Entertainment': 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
  'Bills & Utilities': 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  'Healthcare': 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400',
  'Education': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400',
  'Travel': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400',
  'Groceries': 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
  'Subscriptions': 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
  'Other': 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-400',
};

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchExpenses = useCallback(async () => {
    try {
      const params = { limit: 100 };
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const data = await getExpenses(params);
      setExpenses(data.expenses || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Fetch expenses error:', err);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    setLoading(true);
    fetchExpenses();
  }, [fetchExpenses]);

  const handleCreate = async (data) => {
    try {
      const result = await createExpense(data);
      setShowForm(false);
      if (result.autoDetectedCategory) {
        setNotification({ message: `AI auto-categorized as "${result.autoDetectedCategory}"`, type: 'info' });
      } else {
        setNotification({ message: 'Expense added successfully!', type: 'success' });
      }
      fetchExpenses();
    } catch (err) {
      setNotification({ message: 'Failed to add expense', type: 'error' });
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateExpense(editingExpense._id, data);
      setEditingExpense(null);
      setNotification({ message: 'Expense updated!', type: 'success' });
      fetchExpenses();
    } catch (err) {
      setNotification({ message: 'Failed to update expense', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);
      setNotification({ message: 'Expense deleted', type: 'success' });
      fetchExpenses();
    } catch (err) {
      setNotification({ message: 'Failed to delete expense', type: 'error' });
    }
  };

  const totalAmount = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Expenses</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {total} expense{total !== 1 ? 's' : ''} · Total: <span className="font-semibold text-rose-500">${totalAmount.toFixed(2)}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(expenses)}
            className="btn-secondary flex items-center gap-2"
          >
            <HiOutlineArrowDownTray className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field !pl-10 !py-2.5"
          />
        </div>
        <div className="relative">
          <HiOutlineFunnel className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field !pl-10 !py-2.5 !w-full sm:!w-48"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expense list */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : expenses.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <HiOutlineBanknotes className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No expenses found</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Click "Add Expense" to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.map((exp, idx) => (
            <div
              key={exp._id}
              className="glass-card p-4 flex items-center gap-4 animate-slide-up"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              {/* Category badge */}
              <div className={`badge ${CATEGORY_COLORS[exp.category] || CATEGORY_COLORS['Other']} hidden sm:inline-flex`}>
                {exp.category}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-700 dark:text-slate-200 truncate">{exp.title}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  <span className="sm:hidden">{exp.category} · </span>
                  {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {exp.isRecurring && (
                    <span className="ml-2 text-primary-500 font-medium">↻ {exp.recurringFrequency}</span>
                  )}
                  {exp.notes && <span className="ml-2 italic">— {exp.notes}</span>}
                </p>
              </div>

              {/* Amount */}
              <span className="text-lg font-bold text-rose-500 flex-shrink-0">
                -${exp.amount.toFixed(2)}
              </span>

              {/* Actions */}
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => setEditingExpense(exp)}
                  className="p-2 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
                >
                  <HiOutlinePencilSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modals */}
      {showForm && (
        <ExpenseForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />
      )}
      {editingExpense && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleUpdate}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
}
