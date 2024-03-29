const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExamSchema = new Schema({
  name: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  fromTime: { type: Date, required: true, trim: true },
  toTime: { type: Date, required: true, trim: true },
  totalMarks: { type: Number, required: true, trim: true },
  totalQuestions: { type: Number, required: true, trim: true },
  examCompletedStatus: { type: Boolean, required: true, default: false },
  deleteStatus: { type: Boolean, required: true, default: false },
  minPassMark: { type: Number, required: true, trim: true },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

ExamSchema.index(
  { name: 1, date: 1, fromTime: 1, toTime: 1 },
  { unique: true }
);

const ExamModel = mongoose.model("exam", ExamSchema);

module.exports = { ExamModel };
