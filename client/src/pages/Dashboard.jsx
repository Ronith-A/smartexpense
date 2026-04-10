import { useState, useEffect, useMemo } from 'react';
import {
  HiOutlineBanknotes,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineChartPie,
} from 'react-icons/hi2';
import { getExpenses } from '../services/expenseService';
import { getIncome } from '../services/incomeService';
import { getBudget } from '../services/budgetService';
import BudgetCard from '../components/BudgetCard';
import PieChart from '../components/Charts/PieChart';
import BarChart from '../components/Charts/BarChart';
import LineChart from '../components/Charts/LineChart';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [expRes, incRes, budRes] = await Promise.all([
          getExpenses({ limit: 500 }),
          getIncome(),
          getBudget(),
        ]);
        setExpenses(expRes.expenses || []);
        setIncome(incRes.income || incRes || []);
        setBudget(budRes.budget || budRes || null);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculations
  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + (e.amount || 0), 0), [expenses]);
  const totalIncome = useMemo(() => {
    if (Array.isArray(income)) return income.reduce((s, i) => s + (i.amount || 0), 0);
    return 0;
  }, [income]);
  const balance = totalIncome - totalExpenses;

  // Category breakdown for pie chart
  const categoryData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      const cat = e.category || 'Other';
      map[cat] = (map[cat] || 0) + e.amount;
    });
    return map;
  }, [expenses]);

  // Monthly spending for bar chart (last 6 months)
  const monthlyData = useMemo(() => {
    const now = new Date();
    const labels = [];
    const values = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      labels.push(label);
      const monthExpenses = expenses.filter((e) => {
        const ed = new Date(e.date);
        return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
      });
      values.push(monthExpenses.reduce((s, e) => s + e.amount, 0));
    }
    return { labels, values };
  }, [expenses]);

  // Income vs Expenses trend for line chart
  const trendData = useMemo(() => {
    const now = new Date();
    const labels = [];
    const incomeArr = [];
    const expenseArr = [];
    const incomeList = Array.isArray(income) ? income : [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
      const mInc = incomeList.filter((inc) => {
        const id = new Date(inc.date);
        return id.getMonth() === d.getMonth() && id.getFullYear() === d.getFullYear();
      });
      incomeArr.push(mInc.reduce((s, i) => s + i.amount, 0));
      const mExp = expenses.filter((e) => {
        const ed = new Date(e.date);
        return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
      });
      expenseArr.push(mExp.reduce((s, e) => s + e.amount, 0));
    }
    return { labels, incomeData: incomeArr, expenseData: expenseArr };
  }, [expenses, income]);

  // Recent expenses
  const recentExpenses = expenses.slice(0, 5);

  // Current month spent for budget
  const currentMonthSpent = useMemo(() => {
    const now = new Date();
    return expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, e) => s + e.amount, 0);
  }, [expenses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Balance',
      value: balance,
      icon: HiOutlineBanknotes,
      color: balance >= 0 ? 'text-emerald-500' : 'text-rose-500',
      bg: balance >= 0 ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-rose-50 dark:bg-rose-500/10',
    },
    {
      label: 'Total Income',
      value: totalIncome,
      icon: HiOutlineArrowTrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      label: 'Total Expenses',
      value: totalExpenses,
      icon: HiOutlineArrowTrendingDown,
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-500/10',
    },
    {
      label: 'Categories',
      value: Object.keys(categoryData).length,
      icon: HiOutlineChartPie,
      color: 'text-primary-500',
      bg: 'bg-primary-50 dark:bg-primary-500/10',
      isCurrency: false,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Your financial overview at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="glass-card p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</span>
              <div className={`p-2 rounded-xl ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>
              {card.isCurrency === false
                ? card.value
                : `$${Math.abs(card.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget ring */}
        <BudgetCard spent={currentMonthSpent} limit={budget?.monthlyLimit || 0} />

        {/* Pie chart */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Spending by Category
          </h3>
          <PieChart data={categoryData} />
        </div>

        {/* Bar chart */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Monthly Spending
          </h3>
          <BarChart labels={monthlyData.labels} values={monthlyData.values} />
        </div>
      </div>

      {/* Trend + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line chart */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Income vs Expenses Trend
          </h3>
          <LineChart labels={trendData.labels} incomeData={trendData.incomeData} expenseData={trendData.expenseData} />
        </div>

        {/* Recent expenses */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Recent Expenses
          </h3>
          {recentExpenses.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500 py-8 text-center">No expenses recorded yet</p>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((exp) => (
                <div
                  key={exp._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{exp.title}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {exp.category} • {new Date(exp.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-rose-500 ml-3 flex-shrink-0">
                    -${exp.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
