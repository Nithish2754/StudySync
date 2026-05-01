const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    default: '',
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  deadline: {
    type: Date,
    default: null
  },
  reminderAt: {
    type: Date,
    default: null
  },
  tags: [{ type: String, trim: true }],
  estimatedHours: {
    type: Number,
    default: 1,
    min: 0.5,
    max: 24
  },
  actualHours: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Virtual for progress percentage
taskSchema.virtual('progressPercent').get(function () {
  if (this.status === 'completed') return 100;
  if (this.status === 'in-progress') return 50;
  return 0;
});

taskSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
