const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the student schema
const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: { type: String, required: true, unique: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  contactNumber: {
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

  accessToken: {
    type: String,
    trim: true,
    default: null,
  },

  refreshToken: {
    type: String,
    trim: true,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  lastLoginTime: {
    type: Date,
    default: null,
  },
});

const userModel = mongoose.model("users", usersSchema);

module.exports = { userModel };
