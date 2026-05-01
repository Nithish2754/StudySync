const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc  Get profile
// @route GET /api/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update profile
// @route PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio, studyGoal, avatar, pomodoroSettings, theme } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (studyGoal) updates.studyGoal = studyGoal;
    if (avatar) updates.avatar = avatar;
    if (pomodoroSettings) updates.pomodoroSettings = pomodoroSettings;
    if (theme) updates.theme = theme;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Change password
// @route PUT /api/profile/password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile, changePassword };
