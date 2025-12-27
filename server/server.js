console.log("Server file loaded");

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();
const activityRoutes = require("./routes/activities");
const analyticsRoutes=require("./routes/analytics");
const aiRoutes=require('./routes/ai');


app.use(cors());
app.use(express.json());



// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai",aiRoutes);


// Health check
app.get("/", (req, res) => {
  res.send("Strava AI backend running");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
