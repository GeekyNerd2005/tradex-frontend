import React, { useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import HoldingsPieChart from "../components/HoldingsBreakdownChart";
import PortfolioValueChart from "../components/PortfolioValueChart";
import "../styles/portfolio.css";
const Portfolio = () => {
  const [holdings, setHoldings] = useState([]);
  const [range, setRange] = useState("3mo");

  useEffect(() => {
    const fetchHoldings = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5001/api/portfolio", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setHoldings(data.holdings || []);
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      }
    };
    fetchHoldings();
  }, []);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5001/hubs/portfolio", {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .withAutomaticReconnect()
      .build();

    let isMounted = true;
    connection
      .start()
      .then(() => {
        if (!isMounted) return;
        connection.invoke("JoinGroup").catch(console.error);
        connection.on("PortfolioUpdated", (updatedHoldings) => {
          if (isMounted) setHoldings(updatedHoldings);
        });
      })
      .catch(console.error);

    return () => {
      isMounted = false;
      connection.invoke("LeaveGroup").catch(console.error);
      connection.stop();
    };
  }, []);

  const ranges = ["1w", "1mo", "3mo", "6mo", "1y", "all"];

  return (
    <div className="portfolio-container">
      <h2 className="glow-header">My Portfolio</h2>

      {/* Range Toggle */}
      <div className="range-toggle">
        {ranges.map((r) => (
          <button
            key={r}
            className={`range-button ${r === range ? "active" : ""}`}
            onClick={() => setRange(r)}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Holdings Table */}
      <div className="glass-card">
        <table className="holdings-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Avg Buy Price</th>
              <th>Current Price</th>
              <th>Unrealized P&L</th>
            </tr>
          </thead>
          <tbody>
            {holdings.length === 0 ? (
              <tr>
                <td colSpan="5">No holdings</td>
              </tr>
            ) : (
              holdings.map((h, idx) => (
                <tr key={idx}>
                  <td>{h.symbol}</td>
                  <td>{h.quantity}</td>
                  <td>{h.averageBuyPrice.toFixed(2)}</td>
                  <td>{h.currentPrice.toFixed(2)}</td>
                  <td className={h.unrealizedPnL >= 0 ? "gain" : "loss"}>
                    {h.unrealizedPnL.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Charts Side by Side */}
      <div className="charts-wrapper">
        <div className="glass-card chart-card">
          <h3 className="section-header">Holdings Breakdown</h3>
          <HoldingsPieChart holdings={holdings} />
        </div>
        <div className="glass-card chart-card">
          <h3 className="section-header">Portfolio Value</h3>
          <PortfolioValueChart range={range} />
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
