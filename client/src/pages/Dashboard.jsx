import { useEffect, useState } from "react";
import api from "../api/api";
import ScoreCard from "../components/ScoreCard";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/credit/1").then(res => setData(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl mb-6">Patient Credit Overview</h1>

      <div className="grid grid-cols-4 gap-6">
        <ScoreCard title="Credit Score" value={data.score} />
        <ScoreCard title="Risk Level" value={data.riskLevel} />
        <ScoreCard title="Outstanding Dues" value={`₹${data.outstandingDues}`} />
        <ScoreCard title="Eligibility" value={data.eligibility} />
      </div>
    </div>
  );
}
