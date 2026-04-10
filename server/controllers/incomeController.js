const Income = require('../models/Income');

/**
 * GET /api/income
 */
async function getIncomes(req, res) {
  try {
    const incomes = await Income.find({ userId: req.user.id }).sort({ date: -1 });
    res.json({ income: incomes });
  } catch (err) {
    console.error('getIncomes error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * POST /api/income
 */
async function createIncome(req, res) {
  try {
    const { amount, source, date } = req.body;
    const income = await Income.create({
      userId: req.user.id,
      amount,
      source,
      date: date || new Date(),
    });
    res.status(201).json({ income });
  } catch (err) {
    console.error('createIncome error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getIncomes, createIncome };
