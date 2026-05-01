const express = require('express');
const router = express.Router();
const { getTimetable, addBlock, updateBlock, deleteBlock } = require('../controllers/timetableController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getTimetable).post(addBlock);
router.route('/:blockId').put(updateBlock).delete(deleteBlock);

module.exports = router;
