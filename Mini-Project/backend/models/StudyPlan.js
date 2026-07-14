const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    examDate: {
      type: Date,
      required: true,
    },
    dailyHours: {
      type: Number,
      required: true,
      min: 1,
      max: 16,
    },
    subjects: [
      {
        name: { type: String, required: true },
        units: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudyPlan', studyPlanSchema);