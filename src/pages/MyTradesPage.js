import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

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
        const res = await axios.get("http://tradex-backend.onrender.com/api/trades/mine", {
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
      t.side === 1 ? `$${(t.price - avgBuyPrice(t.symbol)).toFixed(2) * t.quantity}` : "-"
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
      <Navbar />
      <div className="min-h-screen bg-[#0a0a0a] text-[#ff99cc] font-orbitron px-4 py-10 flex flex-col items-center">
        <div className="w-full max-w-6xl bg-[#120014dd] backdrop-blur-md rounded-xl border border-[#ff2f6d44] p-6 shadow-[0_0_30px_#ff2f6d33]">
          <h2 className="text-4xl font-bold mb-6 text-center text-[#ff3366] drop-shadow-[0_0_10px_#ff3366]">
  Executed Trades
</h2>


          {/* Filters */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
            <input
              type="text"
              placeholder="🔍 Filter by symbol"
              value={symbolFilter}
              onChange={(e) => setSymbolFilter(e.target.value)}
              className="bg-[#1a001f] text-[#ff99cc] border border-[#ff2f6d33] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff66aa] w-full md:w-auto"
            />
            <button
              onClick={downloadCSV}
              className="px-4 py-2 bg-gradient-to-r from-[#ff0066] to-[#ff3399] hover:from-[#ff3399] hover:to-[#ff0066] text-black font-bold rounded shadow-md hover:shadow-pink-500/50 transition-all transform hover:scale-105"
            >
              📤 Export CSV
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <p className="text-center text-[#ff99cc] animate-pulse">Loading trades...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-[#ff7799]">No trades match filter.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse font-orbitron">
                <thead className="text-[#ff99cc] bg-[#1a001f66]">
                  <tr>
                    {["id", "symbol", "side", "price", "quantity", "executedAt"].map((key) => (
                      <th
                        key={key}
                        onClick={() => requestSort(key)}
                        className="px-4 py-3 border-b border-[#ff2f6d33] cursor-pointer hover:text-[#ff66aa]"
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)} {sortConfig.key === key ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                      </th>
                    ))}
                    <th className="px-4 py-3 border-b border-[#ff2f6d33]">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => {
                    const isSell = t.side === 1;
                    const pnl = isSell ? (t.price - avgBuyPrice(t.symbol)) * t.quantity : null;
                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-[#29002188] hover:shadow-[0_0_12px_#ff2f6d77] transition-all duration-200"
                      >
                        <td className="px-4 py-3">{t.id}</td>
                        <td className="px-4 py-3">{t.symbol}</td>
                        <td className={`px-4 py-3 font-bold ${t.side === 0 ? "text-green-400" : "text-red-400"}`}>
                          {t.side === 0 ? "Buy" : "Sell"}
                        </td>
                        <td className="px-4 py-3">${t.price.toFixed(2)}</td>
                        <td className="px-4 py-3">{t.quantity}</td>
                        <td className="px-4 py-3">
                          {new Date(t.executedAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className={`px-4 py-3 font-semibold ${isSell && pnl !== null ? (pnl >= 0 ? "text-green-300" : "text-red-400") : ""}`}>
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
