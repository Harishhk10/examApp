const mongoose = require("mongoose");
const { Schema } = mongoose;
const emptyCheck = require("../components/emptyCheck");

const classRoomSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,

    validate: {
      validator: function (v) {
        return v.trim().length > 0;
      },
      message: (props) => `Classroom name cannot be an empty string.`,
    },
  },

  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 999,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

const classroomModel = mongoose.model("classroom", classRoomSchema);

module.exports = { classroomModel };
