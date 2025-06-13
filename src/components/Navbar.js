import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Search,
  Home,
  PieChart,
  FileText,
  Activity,
} from "lucide-react";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [symbol, setSymbol] = useState("");
  const [error, setError] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = symbol.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter a valid ticker");
      return;
    }
    setError("");
    navigate(`/orderbook/${trimmed}`);
  };

  return (
    <nav className="navbar-container neon-glass sticky-top animate-navbar">
      <div className="navbar-left">
        <button onClick={() => navigate("/")} title="Home" className="nav-btn">
          <Home size={18} /> <span>Home</span>
        </button>
        <button
          onClick={() => navigate("/portfolio")}
          title="Portfolio"
          className="nav-btn"
        >
          <PieChart size={18} /> <span>Portfolio</span>
        </button>
        <button
          onClick={() => navigate("/orders")}
          title="Orders"
          className="nav-btn"
        >
          <FileText size={18} /> <span>Orders</span>
        </button>
        <button
          onClick={() => navigate("/trades")}
          title="My Trades"
          className="nav-btn"
        >
          <Activity size={18} /> <span>Trades</span>
        </button>
        <button onClick={logout} title="Logout" className="nav-btn logout-btn">
          <LogOut size={18} /> <span>Logout</span>
        </button>
      </div>

      <form onSubmit={handleSearch} className="navbar-search">
        <input
          type="text"
          placeholder="Search (e.g. INFY.NS)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="search-input"
          spellCheck="false"
        />
        <button type="submit" title="Search" className="search-btn">
          <Search size={16} />
        </button>
      </form>

      {error && (
        <div className="search-error neon-text">
          {error}
        </div>
      )}
    </nav>
  );
}
