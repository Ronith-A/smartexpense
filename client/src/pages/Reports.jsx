import { useState } from 'react';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { analyzeSpending } from '../services/aiService';
import InsightCard from '../components/InsightCard';

export default function Reports() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await analyzeSpending();
      setAnalysis(data.analysis || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Make sure you have expense data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">AI Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Get AI-powered insights about your spending habits
          </p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <HiOutlineSparkles className="w-5 h-5" />
          )}
          {loading ? 'Analyzing...' : 'Run AI Analysis'}
        </button>
      </div>

      {error && (
        <div className="glass-card p-4 border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm">
          {error}
        </div>
      )}

      {!analysis && !loading && !error && (
        <div className="glass-card p-16 text-center">
          <div className="w-20 h-20 rounded-2xl gradient-primary mx-auto mb-4 flex items-center justify-center shadow-xl shadow-primary-500/25">
            <HiOutlineSparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">AI Spending Analysis</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Click "Run AI Analysis" to get personalized insights, spending patterns, category breakdowns,
            anomaly detection, and smart recommendations based on your expense data.
          </p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          {/* Summary section */}
          {analysis.summary && (
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Monthly Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Total Spent</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">
                    ${(analysis.summary.totalSpent || 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Avg/Day</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">
                    ${(analysis.summary.avgPerDay || 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Transactions</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">
                    {analysis.summary.transactionCount || 0}
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Top Category</p>
                  <p className="text-lg font-bold text-primary-500 mt-1 truncate">
                    {analysis.summary.topCategory || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Category distribution */}
          {analysis.categoryDistribution && Object.keys(analysis.categoryDistribution).length > 0 && (
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Category Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(analysis.categoryDistribution)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, amount]) => {
                    const total = Object.values(analysis.categoryDistribution).reduce((a, b) => a + b, 0);
                    const pct = total > 0 ? (amount / total) * 100 : 0;
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-700 dark:text-slate-200">{cat}</span>
                          <span className="text-slate-500 dark:text-slate-400">
                            ${amount.toFixed(2)} ({pct.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full rounded-full gradient-primary transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Insights */}
          {analysis.insights && analysis.insights.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                AI Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.insights.map((insight, idx) => (
                  <InsightCard
                    key={idx}
                    title={insight.title}
                    description={insight.description}
                    type={insight.type || 'insight'}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Anomalies */}
          {analysis.anomalies && analysis.anomalies.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Unusual Spending Detected
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.anomalies.map((a, idx) => (
                  <InsightCard
                    key={idx}
                    title={a.title || 'Anomaly Detected'}
                    description={a.description}
                    type="anomaly"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Comparison */}
          {analysis.comparison && (
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Period Comparison
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">This Month</p>
                  <p className="text-xl font-bold text-slate-800 dark:text-white">
                    ${(analysis.comparison.currentMonth || 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Last Month</p>
                  <p className="text-xl font-bold text-slate-800 dark:text-white">
                    ${(analysis.comparison.lastMonth || 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Change</p>
                  <p className={`text-xl font-bold ${
                    (analysis.comparison.changePercent || 0) > 0 ? 'text-rose-500' : 'text-emerald-500'
                  }`}>
                    {(analysis.comparison.changePercent || 0) > 0 ? '+' : ''}
                    {(analysis.comparison.changePercent || 0).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
