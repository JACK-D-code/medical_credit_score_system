import { PieChart, Pie, Cell } from "recharts";

export default function ChartPanel({ data }) {
  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        dataKey="count"
        nameKey="_id"
        cx="50%"
        cy="50%"
        outerRadius={100}
      >
        {data.map((_, i) => (
          <Cell key={i} fill={COLORS[i]} />
        ))}
      </Pie>
    </PieChart>
  );
}
