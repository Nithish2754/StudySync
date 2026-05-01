const express = require('express');
const router = express.Router();
const { getDashboardStats, getWeeklyAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/dashboard', getDashboardStats);
router.get('/weekly', getWeeklyAnalytics);

module.exports = router;
