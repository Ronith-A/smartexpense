const router = require('express').Router();
const auth = require('../middleware/auth');
const { analyze } = require('../controllers/aiController');

router.use(auth);

router.post('/analyze', analyze);

module.exports = router;
