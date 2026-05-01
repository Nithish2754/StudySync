const express = require('express');
const router = express.Router();
const { logSession, getSessions, getTodaySummary } = require('../controllers/pomodoroController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/session', logSession);
router.get('/sessions', getSessions);
router.get('/today', getTodaySummary);

module.exports = router;
