const StudyPlan = require('../models/StudyPlan');
const Task = require('../models/Task');

// Difficulty multiplier — hard topics get more time
const DIFFICULTY_MULTIPLIER = {
  easy: 0.7,
  medium: 1.0,
  hard: 1.5,
};

// @desc   Create study plan and generate tasks
// @route  POST /api/plan/create
const createPlan = async (req, res) => {
  try {
    const { examDate, dailyHours, subjects } = req.body;
    const userId = req.user._id;

    // Delete old plans and tasks for this user
    const oldPlan = await StudyPlan.findOne({ userId });
    if (oldPlan) {
      await Task.deleteMany({ planId: oldPlan._id });
      await StudyPlan.deleteOne({ _id: oldPlan._id });
    }

    // Calculate days left
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);

    const daysLeft = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) {
      return res.status(400).json({ message: 'Exam date must be in the future' });
    }

    // Build list of all units with difficulty
    // subjects = [{ name, units: [{unitName, difficulty}] }]
    let allUnits = [];
    subjects.forEach((subject) => {
      subject.units.forEach((unit) => {
        allUnits.push({
          subject: subject.name,
          unit: unit.unitName,
          difficulty: unit.difficulty || 'medium',
        });
      });
    });

    // Sort: hard first, then medium, then easy (so hard topics get earlier, fresher days)
    const difficultyOrder = { hard: 0, medium: 1, easy: 2 };
    allUnits.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);

    // Calculate total weighted hours needed
    let totalWeightedUnits = allUnits.reduce((sum, u) => {
      return sum + DIFFICULTY_MULTIPLIER[u.difficulty];
    }, 0);

    let totalAvailableHours = daysLeft * dailyHours;

    // Hours per "unit weight"
    let hoursPerWeight = totalAvailableHours / totalWeightedUnits;

    // Save plan
    const plan = await StudyPlan.create({
      userId,
      examDate,
      dailyHours,
      subjects: subjects.map((s) => ({ name: s.name, units: s.units.length })),
    });

    // Schedule tasks
    const tasks = [];
    let currentDate = new Date(today);
    let hoursUsedToday = 0;

    for (let i = 0; i < allUnits.length; i++) {
      const unitItem = allUnits[i];
      let unitHours = parseFloat(
        (hoursPerWeight * DIFFICULTY_MULTIPLIER[unitItem.difficulty]).toFixed(1)
      );
      if (unitHours < 0.5) unitHours = 0.5; // minimum 30 mins

      // If today is full, move to next day
      if (hoursUsedToday + unitHours > dailyHours) {
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
        hoursUsedToday = 0;
      }

      // Don't schedule beyond exam date
      if (currentDate >= exam) {
        currentDate = new Date(today); // wrap around if needed (edge case)
      }

      tasks.push({
        planId: plan._id,
        userId,
        subject: unitItem.subject,
        unit: unitItem.unit,
        date: new Date(currentDate),
        duration: unitHours,
        status: 'pending',
        difficulty: unitItem.difficulty,
      });

      hoursUsedToday += unitHours;
    }

    await Task.insertMany(tasks);

    res.status(201).json({
      message: 'Study plan created successfully!',
      plan,
      totalTasks: tasks.length,
      daysLeft,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get user plan with all tasks
// @route  GET /api/plan
const getPlan = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ userId: req.user._id });
    if (!plan) {
      return res.status(404).json({ message: 'No plan found' });
    }

    const tasks = await Task.find({ planId: plan._id }).sort({ date: 1 });

    res.json({ plan, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPlan, getPlan };