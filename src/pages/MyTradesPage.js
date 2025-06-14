import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyTradesPage() {
  const [trades, setTrades] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "executedAt", direction: "desc" });
  const [symbolFilter, setSymbolFilter] = useState("");

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5001/api/trades/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrades(res.data);
        setFiltered(res.data);
      } catch (err) {
        setError("Failed to fetch trades.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, []);

  useEffect(() => {
    let data = [...trades];
    if (symbolFilter.trim()) {
      data = data.filter(t => t.symbol.toLowerCase().includes(symbolFilter.toLowerCase()));
    }
    if (sortConfig) {
      data.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    setFiltered(data);
  }, [symbolFilter, sortConfig, trades]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const avgBuyPrice = (symbol) => {
    const buys = trades.filter(t => t.symbol === symbol && t.side === 0);
    if (buys.length === 0) return 0;
    const total = buys.reduce((acc, t) => acc + t.price * t.quantity, 0);
    const qty = buys.reduce((acc, t) => acc + t.quantity, 0);
    return qty > 0 ? total / qty : 0;
  };

  const downloadCSV = () => {
    const headers = ["Trade ID", "Symbol", "Side", "Price", "Quantity", "Executed At", "P&L"];
    const rows = filtered.map(t => [
      t.id,
      t.symbol,
      t.side === 0 ? "Buy" : "Sell",
      t.price,
      t.quantity,
      new Date(t.executedAt).toLocaleString(),
      t.side === 1 ? `$${((t.price - avgBuyPrice(t.symbol)) * t.quantity).toFixed(2)}` : "-"
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tradex_trades.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style>{`
        /* Container */
        .mytrades-container {
          padding: 2rem;
          background: #121b26; /* dark navy */
          min-height: 100vh;
          font-family: 'Rajdhani', sans-serif;
          color: #cfd8dc;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        /* Card */
        .card {
          background: #1f2a38;
          border-radius: 12px;
          padding: 2rem;
          width: 95%;
          max-width: 1100px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.7);
          border: 1px solid #2e3a4e;
        }

        /* Header */
        .section-header {
          color: #63c7ff;
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 1.6rem;
          user-select: none;
          text-shadow: 0 0 2px #4fa3d9;
        }

        /* Filter and export bar */
        .filter-export-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.6rem;
          flex-wrap: wrap;
        }

        /* Filter input */
        .filter-input {
          background: #16202b;
          border: 1.5px solid #2e3a4e;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          color: #a0b9d4;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.3s ease;
          flex-grow: 1;
          min-width: 200px;
        }
        .filter-input::placeholder {
          color: #597a9a;
          opacity: 0.8;
        }
        .filter-input:focus {
          border-color: #63c7ff;
          color: #cce7ff;
          box-shadow: 0 0 6px #63c7ff44;
        }

        /* Button */
        .btn {
          background-color: #2e3a4e;
          border: none;
          border-radius: 6px;
          color: #63c7ff;
          font-weight: 700;
          padding: 0.5rem 1.5rem;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.3s ease;
        }
        .btn:hover {
          background-color: #4a74ba;
          color: #d0e9ff;
        }

        /* Table wrapper */
        .table-wrapper {
          overflow-x: auto;
        }

        /* Table */
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 1rem;
          color: #cfd8dc;
          user-select: none;
        }
        th, td {
          padding: 0.7rem 1rem;
          border-bottom: 1px solid #2e3a4e;
          text-align: center;
        }

        /* Table header */
        th {
          background: #263645;
          color: #63c7ff;
          font-weight: 700;
          cursor: pointer;
          position: sticky;
          top: 0;
          z-index: 1;
          user-select: none;
        }
        th.active-sort {
          background: #3a5ba0;
          color: #d0e9ff;
          box-shadow: inset 0 0 10px #4a74ba;
        }

        /* Table row hover */
        tbody tr:hover {
          background-color: #2c3a56;
          transition: background-color 0.2s ease;
        }

        /* Buy/Sell text */
        .buy-side {
          color: #4caf50;
          font-weight: 700;
        }
        .sell-side {
          color: #e5534b;
          font-weight: 700;
        }

        /* PnL */
        .pnl-positive {
          color: #4caf50;
          font-weight: 700;
        }
        .pnl-negative {
          color: #e5534b;
          font-weight: 700;
        }
        .pnl-neutral {
          color: #7a8ca6;
        }

        /* Loading and error */
        .loading-text, .error-text, .no-data-text {
          font-size: 1.1rem;
          font-weight: 600;
          user-select: none;
          margin-top: 1rem;
          text-align: center;
          color: #88a2c1;
        }
        .error-text {
          color: #e5534b;
        }
      `}</style>

      <div className="mytrades-container">
        <div className="card">
          <h2 className="section-header">Executed Trades</h2>

          <div className="filter-export-bar">
            <input
              type="text"
              placeholder="Filter by symbol..."
              value={symbolFilter}
              onChange={(e) => setSymbolFilter(e.target.value)}
              className="filter-input"
            />
            <button onClick={downloadCSV} className="btn">
              Export CSV
            </button>
          </div>

          {loading ? (
            <p className="loading-text">Loading trades...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="no-data-text">No trades match filter.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    {["id", "symbol", "side", "price", "quantity", "executedAt"].map((key) => (
                      <th
                        key={key}
                        onClick={() => requestSort(key)}
                        className={sortConfig.key === key ? "active-sort" : ""}
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                        {sortConfig.key === key ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : ""}
                      </th>
                    ))}
                    <th>P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => {
                    const isSell = t.side === 1;
                    const pnl = isSell ? (t.price - avgBuyPrice(t.symbol)) * t.quantity : null;
                    return (
                      <tr key={t.id}>
                        <td>{t.id}</td>
                        <td>{t.symbol}</td>
                        <td className={t.side === 0 ? "buy-side" : "sell-side"}>
                          {t.side === 0 ? "Buy" : "Sell"}
                        </td>
                        <td>${t.price.toFixed(2)}</td>
                        <td>{t.quantity}</td>
                        <td>{new Date(t.executedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</td>
                        <td className={isSell && pnl !== null ? (pnl >= 0 ? "pnl-positive" : "pnl-negative") : "pnl-neutral"}>
                          {isSell && pnl !== null ? `$${pnl.toFixed(2)}` : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
