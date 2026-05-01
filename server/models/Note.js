const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Note title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    default: ''
  },
  subject: {
    type: String,
    default: 'General',
    trim: true
  },
  color: {
    type: String,
    default: '#6c63ff'
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
