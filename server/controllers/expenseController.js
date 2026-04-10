const Expense = require('../models/Expense');
const { autoCategorize } = require('../services/aiService');

/**
 * GET /api/expenses
 * Query params: category, startDate, endDate, search, page, limit
 */
async function getExpenses(req, res) {
  try {
    const { category, startDate, endDate, search, page = 1, limit = 50 } = req.query;
    const filter = { userId: req.user.id };

    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [expenses, total] = await Promise.all([
      Expense.find(filter).sort({ date: -1 }).skip(skip).limit(parseInt(limit)),
      Expense.countDocuments(filter),
    ]);

    res.json({ expenses, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    console.error('getExpenses error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * POST /api/expenses
 */
async function createExpense(req, res) {
  try {
    const { title, amount, category, date, notes, isRecurring, recurringFrequency } = req.body;

    // Auto-categorize if no category provided
    const finalCategory = category || autoCategorize(title);

    const expense = await Expense.create({
      userId: req.user.id,
      title,
      amount,
      category: finalCategory,
      date: date || new Date(),
      notes,
      isRecurring: isRecurring || false,
      recurringFrequency: isRecurring ? recurringFrequency : null,
    });

    // Return the auto-detected category so the client can show it
    res.status(201).json({ expense, autoDetectedCategory: !category ? finalCategory : null });
  } catch (err) {
    console.error('createExpense error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * PUT /api/expenses/:id
 */
async function updateExpense(req, res) {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ expense });
  } catch (err) {
    console.error('updateExpense error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * DELETE /api/expenses/:id
 */
async function deleteExpense(req, res) {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error('deleteExpense error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense };
