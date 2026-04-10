import { useState, useEffect, useMemo } from 'react';
import { getBudget, setBudget } from '../services/budgetService';
import { getExpenses } from '../services/expenseService';
import BudgetCard from '../components/BudgetCard';
import Notification from '../components/Notification';

export default function Budget() {
  const [budget, setBudgetState] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [budRes, expRes] = await Promise.all([
          getBudget(),
          getExpenses({ limit: 500 }),
        ]);
        const bud = budRes.budget || budRes;
        setBudgetState(bud);
        if (bud?.monthlyLimit) setMonthlyLimit(bud.monthlyLimit.toString());
        setExpenses(expRes.expenses || []);
      } catch (err) {
        console.error('Budget fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const currentMonthSpent = useMemo(() => {
    const now = new Date();
    return expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, e) => s + e.amount, 0);
  }, [expenses]);

  // Per-category this month
  const categoryBreakdown = useMemo(() => {
    const now = new Date();
    const map = {};
    expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .forEach((e) => {
        const cat = e.category || 'Other';
        map[cat] = (map[cat] || 0) + e.amount;
      });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const now = new Date();
      const data = await setBudget({
        monthlyLimit: parseFloat(monthlyLimit),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });
      setBudgetState(data.budget || data);
      setNotification({ message: 'Budget updated!', type: 'success' });
    } catch (err) {
      setNotification({ message: 'Failed to update budget', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const limit = budget?.monthlyLimit || 0;
  const percentage = limit > 0 ? (currentMonthSpent / limit) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Budget</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Set and track your monthly spending limit</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget card */}
        <BudgetCard spent={currentMonthSpent} limit={limit} />

        {/* Set budget form */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Set Monthly Budget
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                Monthly Limit ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                placeholder="e.g., 2000"
                className="input-field"
                required
              />
            </div>

            {limit > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Current limit</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">${limit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Spent this month</span>
                  <span className="font-semibold text-rose-500">${currentMonthSpent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Remaining</span>
                  <span className={`font-semibold ${limit - currentMonthSpent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    ${(limit - currentMonthSpent).toFixed(2)}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-2">
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentage >= 90 ? 'bg-rose-500' : percentage >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center">
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Save Budget'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Category breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            This Month's Spending by Category
          </h3>
          <div className="space-y-3">
            {categoryBreakdown.map(([cat, amount]) => {
              const catPct = limit > 0 ? (amount / limit) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{cat}</span>
                    <span className="text-slate-500 dark:text-slate-400">${amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all duration-500"
                      style={{ width: `${Math.min(catPct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
