import { useState,useEffect } from "react";
import { fetchWeeklyStats } from "../api/analytics";

export default function WeeklyStats() {
    const [data, setData] = useState([]);
useEffect(()=>{
    fetchWeeklyStats().then(setData);
},[]);

return(
    <div>
        <h2>
            Weekly Status
        </h2>
        <ul>
            {data.map((week,idx)=>(
                <li key={idx}>
                    Week {week._id.week}: {Math.round(week.totalDistance / 1000)} km, 
                    Activities: {week.activityCount}
                </li>
            ))}
        </ul>
    </div>
);
}
