const router = require('express').Router();
const auth = require('../middleware/auth');
const { getExpenses, createExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');

router.use(auth); // Protect all expense routes

router.get('/', getExpenses);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
