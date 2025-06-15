import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#4caf50", "#f44336", "#ffc107"];

const WinLossStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); 

      const res = await fetch(
        `http://localhost:5001/api/portfolio/winloss/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <p>Loading win/loss stats...</p>;

  const chartData = [
    { name: "Wins", value: stats.winningTrades },
    { name: "Losses", value: stats.losingTrades },
    { name: "Breakeven", value: stats.breakevenTrades },
  ];

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h3>Win/Loss Summary</h3>

      <PieChart width={400} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <div style={{ marginTop: "2rem", fontSize: "1rem" }}>
        <p>Total Trades: <strong>{stats.totalTrades}</strong></p>
        <p>Net Realized PnL: <strong>{stats.netRealizedPnL.toFixed(2)}</strong></p>
      </div>
    </div>
  );
};

export default WinLossStats;
