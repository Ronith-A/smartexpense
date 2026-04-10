import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart({ labels = [], values = [], label = 'Spending' }) {
  const data = {
    labels,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        hoverBackgroundColor: 'rgba(99, 102, 241, 0.9)',
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 48,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { family: 'Inter', weight: '600' },
        bodyFont: { family: 'Inter' },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` $${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 12 } },
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 },
          callback: (v) => `$${v}`,
        },
      },
    },
  };

  if (!labels.length) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 text-sm">
        No data yet
      </div>
    );
  }

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
}
