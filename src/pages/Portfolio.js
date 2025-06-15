import React, { useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import HoldingsPieChart from "../components/HoldingsBreakdownChart";
import PortfolioValueChart from "../components/PortfolioValueChart";
import axios from "axios";

const styles = {
  container: {
    fontFamily: "'Rajdhani', sans-serif",
    backgroundColor: "#0a122a",
    color: "#33bbff",
    minHeight: "100vh",
    padding: "2rem",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  headerTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#00aaff",
    letterSpacing: "0.1em",
  },
  fundsChip: {
    backgroundColor: "rgba(7, 16, 37, 0.7)",
    padding: "0.5rem 1rem",
    borderRadius: "12px",
    border: "1px solid rgba(0, 170, 255, 0.5)",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  fundsLabel: {
    color: "#00aaff",
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: "0.15em",
  },
  fundsValue: {
    color: "#00aaff",
    fontSize: "1.25rem",
    fontWeight: "700",
  },
  rangeToggle: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "1.5rem",
  },
  rangeButton: (active) => ({
    padding: "0.4rem 1rem",
    borderRadius: "8px",
    fontWeight: "600",
    letterSpacing: "0.05em",
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.3s ease",
    border: "none",
    backgroundColor: active ? "#00aaff" : "rgba(7, 16, 37, 0.85)",
    color: active ? "#0a122a" : "#33bbff",
    boxShadow: active ? "0 2px 8px #00aaffaa" : "none",
  }),
  glassCard: {
    backgroundColor: "rgba(7, 16, 37, 0.85)",
    border: "1px solid rgba(0, 170, 255, 0.4)",
    padding: "1.5rem",
    borderRadius: "20px",
    boxShadow: "0 4px 12px rgba(0,170,255,0.15)",
    marginBottom: "2rem",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    color: "#33bbff",
    fontSize: "1rem",
  },
  theadRow: {
    backgroundColor: "rgba(0, 23, 51, 0.9)",
  },
  th: {
    textAlign: "left",
    padding: "0.75rem 1rem",
    borderBottom: "1px solid rgba(0, 170, 255, 0.3)",
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: "0.05em",
    color: "rgba(0, 170, 255, 0.8)",
    userSelect: "none",
  },
  td: {
    padding: "0.75rem 1rem",
    borderBottom: "1px solid rgba(0, 170, 255, 0.2)",
  },
  trHover: {
    backgroundColor: "rgba(0, 34, 68, 0.35)",
    transition: "background-color 0.2s ease-in-out",
  },
  positivePL: {
    color: "#32cd32", 
    fontWeight: "700",
  },
  negativePL: {
    color: "#ff4c4c", 
    fontWeight: "700",
  },
  chartsWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  chartsWrapperMd: {
    flexDirection: "row",
  },
  chartCard: {
    flex: 1,
    backgroundColor: "rgba(7, 16, 37, 0.85)",
    border: "1px solid rgba(0, 170, 255, 0.4)",
    padding: "1.5rem",
    borderRadius: "20px",
    boxShadow: "0 4px 12px rgba(0,170,255,0.15)",
  },
  sectionHeader: {
    color: "#00aaff",
    fontWeight: "700",
    fontSize: "1.75rem",
    marginBottom: "1rem",
    letterSpacing: "0.1em",
  },
  noHoldingsText: {
    textAlign: "center",
    color: "rgba(0, 102, 136, 0.7)",
    padding: "2rem",
    fontWeight: "700",
    fontSize: "1.1rem",
  },
};

const Portfolio = () => {
  const [holdings, setHoldings] = useState([]);
  const [range, setRange] = useState("3mo");
  const [balance, setBalance] = useState(0);

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
    const fetchBalance = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(`http://localhost:5001/api/users/${userId}`);
        setBalance(res.data.balance);
      } catch (err) {
        console.error("Error fetching balance", err);
      }
    };
    fetchBalance();
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
        connection.on("FundsUpdated", (data) => {
          setBalance(data.Balance);
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

  const isMd = window.innerWidth >= 768;
  const chartsWrapperStyle = {
    ...styles.chartsWrapper,
    ...(isMd ? styles.chartsWrapperMd : {}),
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>My Portfolio</h2>
        <div style={styles.fundsChip}>
          <span style={styles.fundsLabel}>Funds</span>
          <span style={styles.fundsValue}>
            ₹{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div style={styles.rangeToggle}>
        {ranges.map((r) => (
          <button
            key={r}
            style={styles.rangeButton(r === range)}
            onClick={() => setRange(r)}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={styles.glassCard}>
        <table style={styles.table}>
          <thead style={styles.theadRow}>
            <tr>
              {["Symbol", "Quantity", "Avg Buy Price", "Current Price", "Unrealized P&L"].map(
                (header) => (
                  <th key={header} style={styles.th}>
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {holdings.length === 0 ? (
              <tr>
                <td colSpan={5} style={styles.noHoldingsText}>
                  No holdings
                </td>
              </tr>
            ) : (
              holdings.map((h, idx) => (
                <tr
                  key={idx}
                  style={{
                    cursor: "default",
                    transition: "background-color 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 34, 68, 0.35)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ ...styles.td, fontFamily: "monospace" }}>{h.symbol}</td>
                  <td style={{ ...styles.td, textAlign: "right" }}>{h.quantity}</td>
                  <td style={{ ...styles.td, textAlign: "right" }}>₹{h.averageBuyPrice.toFixed(2)}</td>
                  <td style={{ ...styles.td, textAlign: "right" }}>₹{h.currentPrice.toFixed(2)}</td>
                  <td
                    style={{
                      ...styles.td,
                      textAlign: "right",
                      fontWeight: "700",
                      color: h.unrealizedPnL >= 0 ? "#32cd32" : "#ff4c4c",
                    }}
                  >
                    ₹{h.unrealizedPnL.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={chartsWrapperStyle}>
        <div style={styles.chartCard}>
          <h3 style={styles.sectionHeader}>Holdings Breakdown</h3>
          <HoldingsPieChart holdings={holdings} />
        </div>
        <div style={styles.chartCard}>
          <h3 style={styles.sectionHeader}>Portfolio Value</h3>
          <PortfolioValueChart range={range} />
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
