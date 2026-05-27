const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// alle admin-ruter krever innlogging og admin-rolle
router.use(requireAuth, requireRole('admin'));

router.get('/users', adminController.listUsers);
router.get('/users/new', adminController.showCreateUser);
router.post('/users', adminController.createUser);

module.exports = router;
