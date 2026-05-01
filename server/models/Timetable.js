const mongoose = require('mongoose');

const timetableBlockSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: {
    type: String, // "HH:MM" 24-hour format
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: '#6c63ff'
  },
  location: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, { _id: true });

const timetableSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  blocks: [timetableBlockSchema],
  weekLabel: {
    type: String,
    default: 'My Weekly Schedule'
  }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
