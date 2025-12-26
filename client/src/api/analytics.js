const BASE_URL = "http://localhost:4000/api/analytics";

export async function fetchWeeklyStats(){
    const res = await fetch(`${BASE_URL}/weekly`);
    return res.json();
}

export async function fetchTrainingLoad(){
    const res = await fetch(`${BASE_URL}/training-load`);
    return res.json();
}

export async function syncActivities() {
    const res = await fetch("http://localhost:4000/api/activities/sync", {
      method: "POST"
    });
  
    if (!res.ok) {
      throw new Error("Failed to sync activities");
    }
  
    return res.json();
  }