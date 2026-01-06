export default function ScoreCard({ title, value }) {
  return (
    <div className="bg-white/10 rounded-xl p-6 shadow-lg">
      <p className="text-gray-400">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}
