// components/Card.js
export default function Card({ title, value }) {
  return (
    <div className="bg-card p-5 rounded-2xl shadow-md hover:shadow-neon transition">
      <div className="text-sm text-slate-400">{title}</div>
      <div className="text-2xl font-semibold text-accent">{value}</div>
    </div>
  );
}
