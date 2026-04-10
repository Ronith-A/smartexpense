export default function BudgetCard({ spent = 0, limit = 0 }) {
  const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const remaining = Math.max(limit - spent, 0);

  // Color changes based on usage
  let color = '#10b981'; // emerald
  let label = 'On Track';
  if (percentage >= 90) {
    color = '#f43f5e'; // rose
    label = 'Over Budget!';
  } else if (percentage >= 70) {
    color = '#f59e0b'; // amber
    label = 'Getting Close';
  }

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-card p-6 flex flex-col items-center">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Monthly Budget</h3>

      {/* SVG ring */}
      <div className="relative w-36 h-36 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" strokeWidth="8" className="stroke-slate-200 dark:stroke-slate-700" />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            strokeWidth="8"
            stroke={color}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-800 dark:text-white">{Math.round(percentage)}%</span>
          <span className="text-xs font-medium" style={{ color }}>{label}</span>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Spent</p>
          <p className="text-lg font-bold text-slate-800 dark:text-white">${spent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Remaining</p>
          <p className="text-lg font-bold" style={{ color }}>${remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {limit === 0 && (
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 italic">No budget set for this month</p>
      )}
    </div>
  );
}
