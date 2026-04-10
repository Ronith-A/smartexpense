import { HiOutlineSparkles, HiOutlineExclamationTriangle, HiOutlineLightBulb, HiOutlineChartBar } from 'react-icons/hi2';

const TYPE_CONFIG = {
  insight: { icon: HiOutlineLightBulb, bg: 'bg-primary-50 dark:bg-primary-500/10', iconColor: 'text-primary-500' },
  warning: { icon: HiOutlineExclamationTriangle, bg: 'bg-amber-50 dark:bg-amber-500/10', iconColor: 'text-amber-500' },
  anomaly: { icon: HiOutlineExclamationTriangle, bg: 'bg-rose-50 dark:bg-rose-500/10', iconColor: 'text-rose-500' },
  summary: { icon: HiOutlineChartBar, bg: 'bg-emerald-50 dark:bg-emerald-500/10', iconColor: 'text-emerald-500' },
  tip: { icon: HiOutlineSparkles, bg: 'bg-violet-50 dark:bg-violet-500/10', iconColor: 'text-violet-500' },
};

export default function InsightCard({ title, description, type = 'insight' }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.insight;
  const Icon = config.icon;

  return (
    <div className={`rounded-xl p-4 ${config.bg} border border-transparent transition-all duration-200 hover:scale-[1.01]`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bg} ${config.iconColor} flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-white">{title}</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
