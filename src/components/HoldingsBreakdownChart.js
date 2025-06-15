// components/HoldingsPieChart.js
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function HoldingsPieChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const dummyLabels = ["LT.NS", "MARUTI.NS", "WIPRO.NS", "SBIN.NS", "NTPC.NS"];
    const dummyValues = dummyLabels.map(() =>
      Math.floor(Math.random() * 5000 + 1000)
    );

    console.log("DUMMY Chart labels:", dummyLabels);
    console.log("DUMMY Chart values:", dummyValues);

    setData({
      labels: dummyLabels,
      datasets: [
        {
          label: "Random Holdings Value",
          data: dummyValues,
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
  }, []);

  if (!data) {
    return (
      <div className="spinner" style={{ textAlign: "center", marginTop: "2rem" }}>
        <p style={{ color: "var(--text-color)" }}>Loading test chart...</p>
      </div>
    );
  }

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
        Test Holdings Breakdown
      </h3>
      <div style={{ width: "100%", height: "300px" }}>
        <Pie data={data} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
}
