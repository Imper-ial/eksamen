const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { requireAuth } = require('../middleware/authMiddleware');

// alle hendelses-ruter krever innlogging
router.use(requireAuth);

router.get('/', incidentController.list);
router.get('/new', incidentController.showCreate);
router.post('/', incidentController.create);
router.get('/:id', incidentController.show);

module.exports = router;
