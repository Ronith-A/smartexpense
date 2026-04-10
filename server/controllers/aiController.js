const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Budget = require('../models/Budget');
const { generateInsights, detectAnomalies, generateMonthlySummary, autoCategorize } = require('../services/aiService');

/**
 * POST /api/ai/analyze
 * Body: { type: 'insights' | 'anomalies' | 'summary' | 'categorize' }
 */
async function analyze(req, res) {
  try {
    const { type, title } = req.body;

    // For categorize, no need to fetch all data
    if (type === 'categorize') {
      if (!title) return res.status(400).json({ message: 'Title is required for categorization' });
      return res.json({ category: autoCategorize(title) });
    }

    // Fetch up to 6 months of data for analysis
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [expenses, incomes] = await Promise.all([
      Expense.find({ userId: req.user.id, date: { $gte: sixMonthsAgo } }).sort({ date: -1 }),
      Income.find({ userId: req.user.id, date: { $gte: sixMonthsAgo } }).sort({ date: -1 }),
    ]);

    const now = new Date();
    const budget = await Budget.findOne({
      userId: req.user.id,
      month: now.getMonth(),
      year: now.getFullYear(),
    });

    // Generate raw data
    const rawInsights = generateInsights(expenses);
    const rawAnomalies = detectAnomalies(expenses);
    const rawSummary = generateMonthlySummary(expenses, incomes, budget);

    // Reshape insights to have title/description for the frontend
    const insights = rawInsights.map((i, idx) => ({
      title: i.type === 'warning' ? 'Spending Alert' : i.type === 'success' ? 'Great Progress' : `Insight #${idx + 1}`,
      description: i.message,
      type: i.type === 'success' ? 'tip' : i.type,
    }));

    // Reshape anomalies to have title/description
    const anomalies = rawAnomalies.map((a) => ({
      title: `Unusual ${a.expense?.category || ''} Expense`,
      description: a.message,
      type: 'anomaly',
    }));

    // Build summary matching frontend expectation
    const sortedCats = Object.entries(rawSummary.categoryBreakdown || {}).sort((a, b) => b[1] - a[1]);
    const summary = {
      totalSpent: rawSummary.totalExpenses || 0,
      avgPerDay: rawSummary.dailyAverage || 0,
      transactionCount: rawSummary.transactionCount || 0,
      topCategory: sortedCats.length > 0 ? sortedCats[0][0] : 'N/A',
    };

    // Category distribution
    const categoryDistribution = rawSummary.categoryBreakdown || {};

    // Period comparison (this month vs last month)
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const currentMonthTotal = expenses
      .filter((e) => { const d = new Date(e.date); return d.getMonth() === thisMonth && d.getFullYear() === thisYear; })
      .reduce((s, e) => s + e.amount, 0);

    const lastMonthTotal = expenses
      .filter((e) => { const d = new Date(e.date); return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear; })
      .reduce((s, e) => s + e.amount, 0);

    const changePercent = lastMonthTotal > 0 ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

    const comparison = {
      currentMonth: currentMonthTotal,
      lastMonth: lastMonthTotal,
      changePercent,
    };

    switch (type) {
      case 'insights':
        return res.json({ analysis: { insights } });
      case 'anomalies':
        return res.json({ analysis: { anomalies } });
      case 'summary':
        return res.json({ analysis: { summary, categoryDistribution, comparison } });
      default:
        return res.json({
          analysis: { insights, anomalies, summary, categoryDistribution, comparison },
        });
    }
  } catch (err) {
    console.error('AI analyze error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { analyze };

