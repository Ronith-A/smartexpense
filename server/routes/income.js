const router = require('express').Router();
const auth = require('../middleware/auth');
const { getIncomes, createIncome } = require('../controllers/incomeController');

router.use(auth);

router.get('/', getIncomes);
router.post('/', createIncome);

module.exports = router;
