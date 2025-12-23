const mongoose=require("mongoose");
const activitySchema= new mongoose.Schema({
    activityId: {
      type: Number,
      required: true,
      unique: true
    },
    athleteId: {
      type: Number,
      required: true,
      index: true
    },
    type: String,                 // Run, Ride, etc.
    distance: Number,             // meters
    movingTime: Number,           // seconds
    averageSpeed: Number,         // m/s
    averageHeartRate: Number,     // bpm (may be null)
    elevationGain: Number,        // meters
    startDate: {
      type: Date,
      index: true
    }
  }, {
    timestamps: true
  });


// Compound index for analytics queries
activitySchema.index({ athleteId: 1, startDate: -1 });

module.exports = mongoose.model("Activity", activitySchema);
