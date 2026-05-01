const Timetable = require('../models/Timetable');

const getTimetable = async (req, res) => {
  try {
    let timetable = await Timetable.findOne({ user: req.user._id });
    if (!timetable) {
      timetable = await Timetable.create({ user: req.user._id, blocks: [] });
    }
    res.json({ success: true, timetable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addBlock = async (req, res) => {
  try {
    const timetable = await Timetable.findOneAndUpdate(
      { user: req.user._id },
      { $push: { blocks: req.body } },
      { new: true, upsert: true }
    );
    res.status(201).json({ success: true, timetable });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateBlock = async (req, res) => {
  try {
    const timetable = await Timetable.findOne({ user: req.user._id });
    if (!timetable) return res.status(404).json({ success: false, message: 'Timetable not found' });

    const block = timetable.blocks.id(req.params.blockId);
    if (!block) return res.status(404).json({ success: false, message: 'Block not found' });

    Object.assign(block, req.body);
    await timetable.save();
    res.json({ success: true, timetable });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteBlock = async (req, res) => {
  try {
    const timetable = await Timetable.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { blocks: { _id: req.params.blockId } } },
      { new: true }
    );
    if (!timetable) return res.status(404).json({ success: false, message: 'Timetable not found' });
    res.json({ success: true, timetable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTimetable, addBlock, updateBlock, deleteBlock };
