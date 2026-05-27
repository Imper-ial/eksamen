const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', indexController.showHome);
router.get('/dashboard', requireAuth, indexController.showDashboard);
router.get('/faq', requireAuth, indexController.showFaq);

module.exports = router;
