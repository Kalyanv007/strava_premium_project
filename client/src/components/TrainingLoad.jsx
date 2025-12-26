import { useEffect, useState } from "react";
import { fetchTrainingLoad } from "../api/analytics";

export default function TrainingLoad(){
    const[data,setData]=useState([]);
    useEffect(() => {
        fetchTrainingLoad().then(setData);
      }, []);

      return (
        <div>
          <h2>Training Load</h2>
          <ul>
            {data.map((week, idx) => (
              <li key={idx}>
                {week.week}: Load {week.trainingLoad} → {week.fatigue}
              </li>
            ))}
          </ul>
        </div>
      );
}