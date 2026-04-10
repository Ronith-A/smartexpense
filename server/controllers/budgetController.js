const Budget = require('../models/Budget');

/**
 * GET /api/budget
 * Returns the budget for the current month (or a specific month/year if provided)
 */
async function getBudget(req, res) {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth();
    const year = parseInt(req.query.year) || now.getFullYear();

    const budget = await Budget.findOne({ userId: req.user.id, month, year });
    res.json({ budget: budget || { monthlyLimit: 0, month, year } });
  } catch (err) {
    console.error('getBudget error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * POST /api/budget
 * Create or update budget for a given month
 */
async function setBudget(req, res) {
  try {
    const { monthlyLimit, month, year } = req.body;
    const now = new Date();
    const m = month !== undefined ? month : now.getMonth();
    const y = year !== undefined ? year : now.getFullYear();

    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id, month: m, year: y },
      { monthlyLimit },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ budget });
  } catch (err) {
    console.error('setBudget error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getBudget, setBudget };
