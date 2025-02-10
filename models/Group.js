const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  time: { type: String, required: true },
  subject: { type: String, required: true },
  teacher: { type: String, required: true },
  room: { type: String, required: true },
});

const DayScheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  lessons: [LessonSchema],
});

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  schedule: [DayScheduleSchema],
});

module.exports = mongoose.model("Group", GroupSchema);
