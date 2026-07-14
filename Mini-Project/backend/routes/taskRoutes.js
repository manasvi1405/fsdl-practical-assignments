const express = require('express');
const router = express.Router();
const { updateTask, rescheduleTasks, getTodayTasks } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.put('/:taskId', protect, updateTask);
router.post('/reschedule', protect, rescheduleTasks);
router.get('/today', protect, getTodayTasks);

module.exports = router;