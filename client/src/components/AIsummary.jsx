import { useEffect, useState } from "react";
import { fetchAiSummary } from "../api/analytics";

export default function AISummary() {
  const [summary, setSummary] = useState("");

  useEffect(() => {
    fetchAiSummary().then(data => setSummary(data.summary));
  }, []);

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>AI Training Summary</h2>
      <p>{summary || "Generating summary..."}</p>
    </div>
  );
}
