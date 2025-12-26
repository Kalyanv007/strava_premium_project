import { useState ,useRef} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import WeeklyStats from './components/WeeklyStats'
import TrainingLoad from './components/TrainingLoad'
import './App.css'
import { syncActivities } from './api/analytics'

function App() {
  const [syncStatus, setSyncStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);



  const handleSync = async () => {
    try {
      setLoading(true);
      setSyncStatus("");
  
      const result = await syncActivities();
      setSyncStatus(
        `Synced successfully — ${result.inserted} new activities added`
      );
  
      // clear old timer if exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
  
      // auto-hide after 3 seconds
      timeoutRef.current = setTimeout(() => {
        setSyncStatus("");
      }, 3000);
  
    } catch (err) {
      setSyncStatus(" Failed to sync activities");
  
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
  
      timeoutRef.current = setTimeout(() => {
        setSyncStatus("");
      }, 3000);
  
    } finally {
      setLoading(false);
    }
  };
  
  return(
    <div style={{padding:"20px",maxWidth: "700px", margin: "0 auto"}}>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleSync} disabled={loading}>
          {loading ? "Syncing..." : "Sync Latest Activities"}
        </button>

        {syncStatus && (
          <p style={{ marginTop: "10px" }}>{syncStatus}</p>
        )}
      </div>
      <h1>Strava AI Fitness Dashboard</h1>
      <WeeklyStats />
      <TrainingLoad />
      </div>
  );
}

export default App
