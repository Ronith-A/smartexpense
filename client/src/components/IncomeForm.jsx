import { useState } from 'react';
import { HiXMark } from 'react-icons/hi2';

const SOURCES = ['Salary', 'Freelance', 'Investments', 'Rental', 'Business', 'Other'];

export default function IncomeForm({ onSubmit, onClose }) {
  const [form, setForm] = useState({
    amount: '',
    source: 'Salary',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, amount: parseFloat(form.amount) });
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass-card p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add Income</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <HiXMark className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={set('amount')}
              placeholder="0.00"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Source</label>
            <select value={form.source} onChange={set('source')} className="input-field">
              {SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={set('date')}
              className="input-field"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add Income</button>
          </div>
        </form>
      </div>
    </div>
  );
}
