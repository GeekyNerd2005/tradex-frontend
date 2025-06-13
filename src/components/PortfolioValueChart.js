// components/PortfolioValueChart.js
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(LineElement, TimeScale, LinearScale, PointElement, Tooltip, Legend);

const PortfolioValueChart = ({ range = "3mo" }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId"); // or pass as prop

  useEffect(() => {
  if (!userId) return;

  const fetchHistory = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5001/api/portfolio/value-history/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text();
      console.log("📥 Raw response text:", text);
      console.log("📊 Status:", res.status);

      const data = JSON.parse(text);
      setHistory(data);
    } catch (err) {
      console.error("❌ Error fetching value history:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchHistory();
}, [range]);


  if (loading) return <div>Loading chart...</div>;

  const filtered = (() => {
    const cutoff = {
      "1w": 7,
      "1mo": 30,
      "3mo": 90,
      "6mo": 180,
      "1y": 365,
      all: Infinity,
    }[range];

    const now = new Date();
    return history.filter((entry) => {
      const daysAgo = (now - new Date(entry.timestamp)) / (1000 * 60 * 60 * 24);
      return daysAgo <= cutoff;
    });
  })();

  const chartData = {
    labels: filtered.map((d) => new Date(d.timestamp)),
    datasets: [
      {
        label: "Portfolio Value",
        data: filtered.map((d) => d.totalValue),
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        tension: 0.2,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        type: "time",
        title: { display: true, text: "Date" },
      },
      y: {
        title: { display: true, text: "Portfolio Value" },
        beginAtZero: false,
      },
    },
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PortfolioValueChart;
