const Task = require('../models/Task');
const PomodoroSession = require('../models/PomodoroSession');
const User = require('../models/User');

// @desc  Get dashboard analytics
// @route GET /api/analytics/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalTasks, completedTasks, todaySessions, weekSessions, user] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: 'completed' }),
      PomodoroSession.find({ user: userId, type: 'focus', completedAt: { $gte: startOfDay } }),
      PomodoroSession.find({ user: userId, type: 'focus', completedAt: { $gte: startOfWeek } }),
      User.findById(userId)
    ]);

    const todayMinutes = todaySessions.reduce((s, sess) => s + sess.duration, 0);
    const weekMinutes = weekSessions.reduce((s, sess) => s + sess.duration, 0);

    // Last 7 days chart data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const start = new Date(d); start.setHours(0, 0, 0, 0);
      const end = new Date(d); end.setHours(23, 59, 59, 999);
      const daySessions = await PomodoroSession.find({
        user: userId, type: 'focus',
        completedAt: { $gte: start, $lte: end }
      });
      const mins = daySessions.reduce((s, sess) => s + sess.duration, 0);
      last7Days.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: parseFloat((mins / 60).toFixed(1)),
        sessions: daySessions.length
      });
    }

    res.json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        todayHours: parseFloat((todayMinutes / 60).toFixed(1)),
        weekHours: parseFloat((weekMinutes / 60).toFixed(1)),
        totalStudyHours: user.totalStudyHours.toFixed(1),
        totalPomodoroSessions: user.totalPomodoroSessions,
        streak: user.streak,
        last7Days
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get weekly analytics
// @route GET /api/analytics/weekly
const getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekly = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const start = new Date(d); start.setHours(0, 0, 0, 0);
      const end = new Date(d); end.setHours(23, 59, 59, 999);

      const [sessions, completed, total] = await Promise.all([
        PomodoroSession.find({ user: userId, type: 'focus', completedAt: { $gte: start, $lte: end } }),
        Task.countDocuments({ user: userId, status: 'completed', completedAt: { $gte: start, $lte: end } }),
        Task.countDocuments({ user: userId, createdAt: { $gte: start, $lte: end } })
      ]);

      const mins = sessions.reduce((s, sess) => s + sess.duration, 0);
      weekly.push({
        day: days[d.getDay()],
        date: d.toLocaleDateString('en-IN'),
        studyHours: parseFloat((mins / 60).toFixed(1)),
        sessionsCount: sessions.length,
        tasksCompleted: completed,
        tasksCreated: total
      });
    }

    res.json({ success: true, weekly });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats, getWeeklyAnalytics };
