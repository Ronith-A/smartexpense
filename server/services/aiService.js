/**
 * SmartExpense AI Service
 * Rule-based intelligence engine for expense analysis.
 * Can be swapped with OpenAI API calls by updating this single file.
 */

// ─── Keyword → Category mapping ───
const CATEGORY_KEYWORDS = {
  Food: ['restaurant', 'pizza', 'burger', 'coffee', 'cafe', 'lunch', 'dinner', 'breakfast', 'food', 'eat', 'meal', 'snack', 'dine', 'sushi', 'taco', 'starbucks', 'mcdonalds', 'kfc', 'dominos', 'uber eats', 'doordash', 'grubhub', 'zomato', 'swiggy'],
  Groceries: ['grocery', 'supermarket', 'walmart', 'costco', 'target', 'whole foods', 'aldi', 'kroger', 'vegetables', 'fruits', 'milk', 'eggs', 'bread'],
  Travel: ['flight', 'hotel', 'airbnb', 'booking', 'travel', 'trip', 'vacation', 'airline', 'airport', 'train', 'bus ticket', 'cruise'],
  Transport: ['uber', 'lyft', 'taxi', 'gas', 'fuel', 'petrol', 'diesel', 'parking', 'toll', 'metro', 'subway', 'bus pass'],
  Bills: ['rent', 'electricity', 'water', 'internet', 'phone bill', 'utility', 'insurance', 'mortgage', 'wifi', 'cable'],
  Shopping: ['amazon', 'ebay', 'clothes', 'shoes', 'fashion', 'nike', 'zara', 'h&m', 'mall', 'store', 'buy', 'purchase', 'electronics'],
  Entertainment: ['movie', 'netflix', 'spotify', 'concert', 'game', 'gaming', 'theater', 'show', 'music', 'party', 'bar', 'club', 'hulu', 'disney'],
  Subscriptions: ['subscription', 'membership', 'premium', 'annual', 'monthly plan', 'saas', 'youtube premium', 'gym'],
  Healthcare: ['doctor', 'hospital', 'medicine', 'pharmacy', 'health', 'dental', 'medical', 'clinic', 'prescription', 'therapy', 'gym'],
  Education: ['book', 'course', 'udemy', 'coursera', 'tuition', 'school', 'college', 'university', 'training', 'tutorial', 'class'],
};

/**
 * Auto-categorize an expense based on its title
 */
function autoCategorize(title) {
  const lower = title.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category;
    }
  }
  return 'Other';
}

/**
 * Generate spending insights from expense data
 */
function generateInsights(expenses) {
  if (!expenses.length) {
    return [{ type: 'info', message: 'No expenses recorded yet. Start tracking to get insights!' }];
  }

  const insights = [];
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  // ── Split into this month vs last month ──
  const thisMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
  const lastMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });

  const thisTotal = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const lastTotal = lastMonthExpenses.reduce((s, e) => s + e.amount, 0);

  // ── Month-over-month comparison ──
  if (lastTotal > 0) {
    const pctChange = ((thisTotal - lastTotal) / lastTotal) * 100;
    if (pctChange > 10) {
      insights.push({
        type: 'warning',
        message: `Your spending is up ${Math.round(pctChange)}% compared to last month ($${thisTotal.toFixed(2)} vs $${lastTotal.toFixed(2)}).`,
      });
    } else if (pctChange < -10) {
      insights.push({
        type: 'success',
        message: `Great job! You spent ${Math.abs(Math.round(pctChange))}% less than last month ($${thisTotal.toFixed(2)} vs $${lastTotal.toFixed(2)}).`,
      });
    } else {
      insights.push({
        type: 'info',
        message: `Your spending is roughly the same as last month ($${thisTotal.toFixed(2)} vs $${lastTotal.toFixed(2)}).`,
      });
    }
  }

  // ── Category breakdown insight ──
  const categoryTotals = {};
  thisMonthExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  if (sortedCategories.length > 0) {
    const [topCat, topAmt] = sortedCategories[0];
    const pct = thisTotal > 0 ? Math.round((topAmt / thisTotal) * 100) : 0;
    insights.push({
      type: 'info',
      message: `Your top spending category this month is ${topCat} at $${topAmt.toFixed(2)} (${pct}% of total).`,
    });
  }

  // ── Per-category month-over-month ──
  const lastCategoryTotals = {};
  lastMonthExpenses.forEach((e) => {
    lastCategoryTotals[e.category] = (lastCategoryTotals[e.category] || 0) + e.amount;
  });

  for (const [cat, amt] of sortedCategories) {
    const lastAmt = lastCategoryTotals[cat] || 0;
    if (lastAmt > 0) {
      const catPctChange = ((amt - lastAmt) / lastAmt) * 100;
      if (catPctChange > 30) {
        insights.push({
          type: 'warning',
          message: `You spent ${Math.round(catPctChange)}% more on ${cat} this month compared to last month.`,
        });
      }
    }
  }

  // ── Weekly trend (this month) ──
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - 7);
  const thisWeek = thisMonthExpenses.filter((e) => new Date(e.date) >= thisWeekStart);
  const prevWeekStart = new Date(thisWeekStart);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  const prevWeek = thisMonthExpenses.filter(
    (e) => new Date(e.date) >= prevWeekStart && new Date(e.date) < thisWeekStart
  );

  const thisWeekTotal = thisWeek.reduce((s, e) => s + e.amount, 0);
  const prevWeekTotal = prevWeek.reduce((s, e) => s + e.amount, 0);

  if (prevWeekTotal > 0) {
    const weekPct = ((thisWeekTotal - prevWeekTotal) / prevWeekTotal) * 100;
    if (weekPct > 20) {
      insights.push({
        type: 'warning',
        message: `This week's spending ($${thisWeekTotal.toFixed(2)}) is ${Math.round(weekPct)}% higher than last week.`,
      });
    }
  }

  return insights.length ? insights : [{ type: 'success', message: 'Your spending looks healthy this month! Keep it up.' }];
}

/**
 * Detect unusual spending patterns using simple statistical analysis
 */
function detectAnomalies(expenses) {
  const anomalies = [];
  if (expenses.length < 5) return anomalies;

  // Group by category and find outliers
  const byCategory = {};
  expenses.forEach((e) => {
    if (!byCategory[e.category]) byCategory[e.category] = [];
    byCategory[e.category].push(e.amount);
  });

  for (const [cat, amounts] of Object.entries(byCategory)) {
    if (amounts.length < 3) continue;

    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const stdDev = Math.sqrt(amounts.reduce((s, a) => s + Math.pow(a - mean, 2), 0) / amounts.length);

    if (stdDev === 0) continue;

    // Find expenses more than 2 standard deviations from mean
    const recentExpenses = expenses
      .filter((e) => e.category === cat)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    for (const exp of recentExpenses) {
      const zScore = (exp.amount - mean) / stdDev;
      if (zScore > 2) {
        anomalies.push({
          type: 'alert',
          message: `Unusual: "${exp.title}" ($${exp.amount.toFixed(2)}) in ${cat} is significantly higher than your average of $${mean.toFixed(2)}.`,
          expense: exp,
        });
      }
    }
  }

  return anomalies;
}

/**
 * Generate a monthly summary report
 */
function generateMonthlySummary(expenses, incomes, budget) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const monthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const monthIncomes = incomes.filter((i) => {
    const d = new Date(i.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const totalExpenses = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = monthIncomes.reduce((s, i) => s + i.amount, 0);

  // Category breakdown
  const categoryBreakdown = {};
  monthExpenses.forEach((e) => {
    categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.amount;
  });

  // Daily average
  const daysInMonth = new Date(thisYear, thisMonth + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const dailyAverage = dayOfMonth > 0 ? totalExpenses / dayOfMonth : 0;
  const projectedTotal = dailyAverage * daysInMonth;

  // Budget status
  const budgetLimit = budget?.monthlyLimit || 0;
  const budgetRemaining = budgetLimit > 0 ? budgetLimit - totalExpenses : null;
  const budgetUsedPct = budgetLimit > 0 ? Math.round((totalExpenses / budgetLimit) * 100) : null;

  return {
    month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
    totalExpenses,
    totalIncome,
    netSavings: totalIncome - totalExpenses,
    transactionCount: monthExpenses.length,
    dailyAverage,
    projectedTotal,
    categoryBreakdown,
    budgetLimit,
    budgetRemaining,
    budgetUsedPct,
    topExpense: monthExpenses.sort((a, b) => b.amount - a.amount)[0] || null,
  };
}

module.exports = {
  autoCategorize,
  generateInsights,
  detectAnomalies,
  generateMonthlySummary,
};
