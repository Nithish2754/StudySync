const mongoose = require('mongoose');

const pomodoroSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['focus', 'short-break', 'long-break'],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  taskRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null
  },
  subject: {
    type: String,
    default: 'General'
  },
  wasCompleted: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('PomodoroSession', pomodoroSessionSchema);
