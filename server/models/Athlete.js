const mongoose = require("mongoose");

const athleteSchema = new mongoose.Schema({
  athleteId: {
    type: Number,
    required: true,
    unique: true
  },
  username: String,
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  tokenExpiresAt: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Athlete", athleteSchema);
