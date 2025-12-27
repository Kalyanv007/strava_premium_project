const express=require("express");
const axios=require("axios");
const Activity=require("../models/Activity");
const router=express.Router();

router.get("/summary",async(req,res)=>{
    try{
        const activities=await Activity.find();
        if(!activities.length){
            return res.json({summary: "No Actitvity Data available yet"});
        }
        const totalDistanceKm =
                  activities.reduce((sum, a) => sum + a.distance, 0) / 1000;
        
        const weekSet = new Set(
        activities.map(a => {
            const d = new Date(a.startDate);
            return `${d.getFullYear()}-${getWeekNumber(d)}`;
        })
        );
        const weeks = weekSet.size;

        const avgWorkoutsPerWeek = (activities.length / weeks).toFixed(1);
        const avgSessionDuration = (totalDurationMin / activities.length).toFixed(0);


        let maxGapDays = 0;
        for (let i = 1; i < activities.length; i++) {
        const prev = new Date(activities[i - 1].startDate);
        const curr = new Date(activities[i].startDate);
        const gap = (curr - prev) / (1000 * 60 * 60 * 24);
        if (gap > maxGapDays) maxGapDays = Math.round(gap);
        }

        activities.forEach(a => {
            const d = new Date(a.startDate);
          
            const day = d.toLocaleDateString("en-US", { weekday: "long" });
            dayCount[day] = (dayCount[day] || 0) + 1;
          
            const hour = d.getHours();
            if (hour < 12) timeCount.Morning++;
            else if (hour < 17) timeCount.Afternoon++;
            else timeCount.Evening++;
          });
          
        const mostCommonDay = Object.keys(dayCount)
          .reduce((a, b) => dayCount[a] > dayCount[b] ? a : b);
        
        const mostCommonTime = Object.keys(timeCount)
          .reduce((a, b) => timeCount[a] > timeCount[b] ? a : b);
        
        // --- CONSISTENCY CLASSIFICATION ---
        let consistency = "Low";
        if (avgWorkoutsPerWeek >= 4 && maxGapDays <= 3) consistency = "High";
        else if (avgWorkoutsPerWeek >= 2) consistency = "Moderate";
        const avgWeeklyDistance = (totalDistanceKm / weeks).toFixed(1);
        const prompt = `
            You are a fitness coach AI.

            Training summary:
            - Average weekly distance: ${(totalDistanceKm / weeks).toFixed(1)} km
            - Average workouts per week: ${avgWorkoutsPerWeek}
            - Average session duration: ${avgSessionDuration} minutes
            - Longest break between workouts: ${maxGapDays} days
            - Most common training day: ${mostCommonDay}
            - Most common training time: ${mostCommonTime}
            - Training consistency: ${consistency}

            Give a concise training pattern analysis and 1-2 practical, non-medical suggestions.
            Avoid mentioning numbers excessively.
            `;

            const response = await axios.post("http://localhost:11434/api/generate", {
              model: "mistral:latest",
              prompt,
              stream: false
            });
        
            res.json({
              summary: response.data.response.trim()
            });
        
          } 
          catch (error) {
            console.error("AI summary error:", error.message);
            res.status(500).json({ error: "Failed to generate AI summary" });

    }
});


function getWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  }
module.exports=router;