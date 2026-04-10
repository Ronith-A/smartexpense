import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineArrowTrendingUp } from 'react-icons/hi2';
import { getIncome, createIncome } from '../services/incomeService';
import IncomeForm from '../components/IncomeForm';
import Notification from '../components/Notification';

const SOURCE_COLORS = {
  Salary: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  Freelance: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
  Investments: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  Rental: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  Business: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400',
  Other: 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-400',
};

export default function Income() {
  const [incomeList, setIncomeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchIncome = async () => {
    try {
      const data = await getIncome();
      setIncomeList(data.income || data || []);
    } catch (err) {
      console.error('Fetch income error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIncome(); }, []);

  const handleCreate = async (data) => {
    try {
      await createIncome(data);
      setShowForm(false);
      setNotification({ message: 'Income added!', type: 'success' });
      fetchIncome();
    } catch (err) {
      setNotification({ message: 'Failed to add income', type: 'error' });
    }
  };

  const totalIncome = Array.isArray(incomeList) ? incomeList.reduce((s, i) => s + (i.amount || 0), 0) : 0;

  // Group by source
  const bySource = {};
  if (Array.isArray(incomeList)) {
    incomeList.forEach((inc) => {
      const src = inc.source || 'Other';
      bySource[src] = (bySource[src] || 0) + inc.amount;
    });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Income</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Total: <span className="font-semibold text-emerald-500">${totalIncome.toFixed(2)}</span>
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <HiOutlinePlus className="w-4 h-4" />
          Add Income
        </button>
      </div>

      {/* Sources summary */}
      {Object.keys(bySource).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(bySource).map(([src, amt]) => (
            <div key={src} className="glass-card p-4 text-center">
              <span className={`badge ${SOURCE_COLORS[src] || SOURCE_COLORS['Other']} mb-2`}>{src}</span>
              <p className="text-lg font-bold text-slate-800 dark:text-white">${amt.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Income list */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : !Array.isArray(incomeList) || incomeList.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <HiOutlineArrowTrendingUp className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No income entries yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Click "Add Income" to record your earnings</p>
        </div>
      ) : (
        <div className="space-y-2">
          {incomeList.map((inc, idx) => (
            <div
              key={inc._id}
              className="glass-card p-4 flex items-center gap-4 animate-slide-up"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className={`badge ${SOURCE_COLORS[inc.source] || SOURCE_COLORS['Other']} hidden sm:inline-flex`}>
                {inc.source}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-700 dark:text-slate-200">{inc.source}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {new Date(inc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <span className="text-lg font-bold text-emerald-500 flex-shrink-0">
                +${inc.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {showForm && <IncomeForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
    </div>
  );
}
