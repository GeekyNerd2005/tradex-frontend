// components/HoldingsPieChart.js
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function HoldingsPieChart({ holdings }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("holdings prop:", holdings);
    if (!holdings || holdings.length === 0) {
      setError("No valid holdings to display.");
      return;
    }

    const filtered = holdings
  .map(h => ({
    ...h,
    quantity: Number(h.quantity),
    currentPrice: Number(h.currentPrice),
  }))
  .filter(
    (h) => h.quantity > 0 && h.currentPrice > 0 && !isNaN(h.quantity * h.currentPrice)
  );


    if (filtered.length === 0) {
      setError("No valid holdings data to display chart.");
      return;
    }
console.log("Filtered holdings:", filtered);

    const labels = filtered.map((h) => h.symbol);
    const values = filtered.map((h) => h.quantity * h.currentPrice);
console.log("Chart labels:", labels);
console.log("Chart values:", values);
    setData({
      labels,
      datasets: [
        {
          label: "Holdings Value",
          data: values,
          backgroundColor: [
            "#26a69a",
            "#ef5350",
            "#42a5f5",
            "#ab47bc",
            "#ffa726",
            "#66bb6a",
            "#ec407a",
          ],
          borderColor: "#222",
          borderWidth: 1,
        },
      ],
    });
  }, [holdings]);

  if (error) {
    return (
      <div style={{ color: "var(--text-color)", textAlign: "center", marginTop: "1rem" }}>
        {error}
      </div>
    );
  }

  if (!data)
    return (
      <div className="spinner" style={{ textAlign: "center", marginTop: "2rem" }}>
        <p style={{ color: "var(--text-color)" }}>Loading chart...</p>
      </div>
    );

  return (
    <div
      style={{
        background: "var(--button-bg)",
        borderRadius: "10px",
        padding: "1rem",
        boxShadow: "0 0 12px rgba(0,0,0,0.25)",
        maxWidth: "500px",
        margin: "1rem auto",
      }}
    >
      <h3 style={{ color: "var(--text-color)", marginBottom: "1rem", textAlign: "center" }}>
        Holdings Breakdown
      </h3>
      <div style={{ width: "100%", height: "300px" }}>
  <Pie data={data} options={{ responsive: true, maintainAspectRatio: false }} />
</div>

    </div>
  );
}
