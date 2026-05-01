const PomodoroSession = require('../models/PomodoroSession');
const User = require('../models/User');

// @desc    Log pomodoro session
// @route   POST /api/pomodoro/session
const logSession = async (req, res) => {
  try {
    const { type, duration, subject, taskRef, wasCompleted } = req.body;
    const session = await PomodoroSession.create({
      user: req.user._id,
      type,
      duration,
      subject: subject || 'General',
      taskRef: taskRef || null,
      wasCompleted: wasCompleted !== undefined ? wasCompleted : true
    });

    // Update user stats if it's a completed focus session
    if (type === 'focus' && wasCompleted !== false) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: {
          totalStudyHours: duration / 60,
          totalPomodoroSessions: 1
        }
      });
    }

    res.status(201).json({ success: true, session });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get session history
// @route   GET /api/pomodoro/sessions
const getSessions = async (req, res) => {
  try {
    const { limit = 20, type } = req.query;
    const filter = { user: req.user._id };
    if (type) filter.type = type;

    const sessions = await PomodoroSession.find(filter)
      .sort({ completedAt: -1 })
      .limit(Number(limit));
    res.json({ success: true, count: sessions.length, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get today's focus summary
// @route   GET /api/pomodoro/today
const getTodaySummary = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const sessions = await PomodoroSession.find({
      user: req.user._id,
      type: 'focus',
      completedAt: { $gte: startOfDay }
    });

    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    const completedSessions = sessions.filter(s => s.wasCompleted).length;

    res.json({
      success: true,
      todaySessions: completedSessions,
      todayMinutes: totalMinutes,
      todayHours: (totalMinutes / 60).toFixed(1)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { logSession, getSessions, getTodaySummary };
