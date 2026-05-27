const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const actionLogController = require('../controllers/actionLogController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// alle hendelses-ruter krever innlogging
router.use(requireAuth);

router.get('/', incidentController.list);
// bare admin kan opprette nye hendelser
router.get('/new', requireRole('admin'), incidentController.showCreate);
router.post('/', requireRole('admin'), incidentController.create);
router.get('/:id', incidentController.show);
router.post('/:id/update', incidentController.update);
router.post('/:id/logs', actionLogController.create);

module.exports = router;
