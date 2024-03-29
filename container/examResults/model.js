const mongoose = require("mongoose");
const { classroomView } = require("../classroom/views");
const { Schema } = mongoose;

const examResultsSchema = new Schema({
  mark: { type: Number, required: true },
  student: { type: Schema.Types.ObjectId, ref: "StudentModel", required: true },
  exam: { type: Schema.Types.ObjectId, ref: "ExamModel", required: true },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});
examResultsSchema.index({ student: 1, exam: 1 }, { unique: true });

const ExamResultModel = mongoose.model("result", examResultsSchema);

module.exports = { ExamResultModel };
