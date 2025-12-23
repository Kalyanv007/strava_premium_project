const express = require("express");
const Activity = require("../models/Activity");

const router = express.Router();

//Weekly analytics summary

router.get("/weekly", async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: {
            year: { $isoWeekYear: "$startDate" },
            week: { $isoWeek: "$startDate" }
          },
          totalDistance: { $sum: "$distance" },
          totalMovingTime: { $sum: "$movingTime" },
          activityCount: { $sum: 1 },
          avgSpeed: { $avg: "$averageSpeed" }
        }
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.week": -1
        }
      }
    ];

    const weeklyStats = await Activity.aggregate(pipeline);

    res.json(weeklyStats);

  } catch (error) {
    console.error("Weekly analytics error:", error.message);
    res.status(500).json({ error: "Failed to compute weekly analytics" });
  }
});

//load and fatigue calculation
router.get("/training-load", async (req, res) => {
    try {
      const activities = await Activity.find();
  
      let weeklyLoadMap = {};
  
      activities.forEach(act => {
        const date = new Date(act.startDate);
        const weekKey = `${date.getFullYear()}-${getWeekNumber(date)}`;
  
        const distanceKm = act.distance / 1000;
        const intensity = act.averageSpeed ? act.averageSpeed / 3 : 1;
        const load = distanceKm * intensity;
  
        weeklyLoadMap[weekKey] = (weeklyLoadMap[weekKey] || 0) + load;
      });
  
      const result = Object.entries(weeklyLoadMap).map(([week, load]) => {
        let fatigue = "LOW";
        if (load > 45) fatigue = "HIGH";
        else if (load > 25) fatigue = "MEDIUM";
  
        return {
          week,
          trainingLoad: Math.round(load),
          fatigue
        };
      });
  
      res.json(result);
  
    } catch (error) {
      console.error("Training load error:", error.message);
      res.status(500).json({ error: "Failed to compute training load" });
    }
  });
  
  //helper function for weekNumber
  function getWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  }
  

module.exports = router;
