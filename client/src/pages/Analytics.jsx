import { useEffect, useState } from "react";
import api from "../api/api";
import ScoreCard from "../components/ScoreCard";
import ChartPanel from "../components/ChartPanel";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/admin").then(res => setData(res.data));
  }, []);

  if (!data) return null;

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">
        Admin Control Panel
      </h1>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <ScoreCard title="Total Users" value={data.totalUsers} />
        <ScoreCard title="Total Bills" value={data.totalBills} />
        <ScoreCard title="Avg Credit Score" value={data.averageScore} />
        <ScoreCard title="System Health" value="Stable" />
      </div>

      <ChartPanel data={data.riskDistribution} />
    </div>
  );
}
