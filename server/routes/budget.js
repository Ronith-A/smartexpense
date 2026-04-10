const router = require('express').Router();
const auth = require('../middleware/auth');
const { getBudget, setBudget } = require('../controllers/budgetController');

router.use(auth);

router.get('/', getBudget);
router.post('/', setBudget);

module.exports = router;
