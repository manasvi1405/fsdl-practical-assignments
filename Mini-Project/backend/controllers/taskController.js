const Task = require('../models/Task');

// @desc   Update task status
// @route  PUT /api/task/:taskId
const updateTask = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure task belongs to this user
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    task.status = status;
    await task.save();

    res.json({ message: 'Task updated', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Reschedule all pending past tasks
// @route  POST /api/task/reschedule
const rescheduleTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find pending tasks from the past
    const overdueTasks = await Task.find({
      userId: req.user._id,
      status: 'pending',
      date: { $lt: today },
    }).sort({ date: 1 });

    if (overdueTasks.length === 0) {
      return res.json({ message: 'No overdue tasks to reschedule' });
    }

    // Get plan for daily hours
    const StudyPlan = require('../models/StudyPlan');
    const plan = await StudyPlan.findOne({ userId: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    const dailyHours = plan.dailyHours;

    // Get future tasks to know what's already scheduled
    const futureTasks = await Task.find({
      userId: req.user._id,
      date: { $gte: today },
    }).sort({ date: 1 });

    // Build a map of hours used per future date
    const hoursMap = {};
    futureTasks.forEach((t) => {
      const d = t.date.toISOString().split('T')[0];
      hoursMap[d] = (hoursMap[d] || 0) + t.duration;
    });

    // Reschedule overdue tasks
    let rescheduledCount = 0;
    for (const task of overdueTasks) {
      let scheduled = false;
      let checkDate = new Date(today);

      // Try each day starting from today
      for (let attempt = 0; attempt < 60; attempt++) {
        const dateKey = checkDate.toISOString().split('T')[0];
        const usedHours = hoursMap[dateKey] || 0;

        if (usedHours + task.duration <= dailyHours) {
          task.date = new Date(checkDate);
          await task.save();
          hoursMap[dateKey] = usedHours + task.duration;
          scheduled = true;
          rescheduledCount++;
          break;
        }

        checkDate.setDate(checkDate.getDate() + 1);
      }
    }

    res.json({
      message: `${rescheduledCount} tasks rescheduled successfully!`,
      rescheduledCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get today's tasks
// @route  GET /api/task/today
const getTodayTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.find({
      userId: req.user._id,
      date: { $gte: today, $lt: tomorrow },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateTask, rescheduleTasks, getTodayTasks };