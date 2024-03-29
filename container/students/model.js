const mongoose = require("mongoose");
const { Schema } = mongoose;


// Define the student schema
const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
    required: true,
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{10}$/g.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
  activeStatus: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

const StudentModel = mongoose.model("Student", studentSchema);

module.exports = { StudentModel };
