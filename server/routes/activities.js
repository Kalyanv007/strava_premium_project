const express=require("express");
const axios=require("axios");

const Activity= require("../models/Activity");
const Athlete = require("../models/Athlete");
const { getValidAccessToken }=require("../services/stravaAuth");

const router=express.Router();
router.post("/sync", async (req, res) => {
    try {
      const accessToken = await getValidAccessToken();
      const athlete = await Athlete.findOne();
  
      let page = 1;
      const perPage = 30;
      let insertedCount = 0;
  
      while (true) {
        const response = await axios.get(
          "https://www.strava.com/api/v3/athlete/activities",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            },
            params: {
              page,
              per_page: perPage
            }
          }
        );
      const activities = response.data;
      if (activities.length === 0) break;

      for (const act of activities) {
        const exists = await Activity.findOne({ activityId: act.id });
        if (exists) continue;

        await Activity.create({
          activityId: act.id,
          athleteId: athlete.athleteId,
          type: act.type,
          distance: act.distance,
          movingTime: act.moving_time,
          averageSpeed: act.average_speed,
          averageHeartRate: act.average_heartrate || null,
          elevationGain: act.total_elevation_gain,
          startDate: new Date(act.start_date)
        });

        insertedCount++;
      }

      page++;
    }

    res.json({
      message: "Activities synced successfully",
      inserted: insertedCount
    });

  } catch (error) {
    console.error(
      "Activity sync error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to sync activities" });
  }
});

module.exports = router;

