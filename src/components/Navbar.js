import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (trimmed) {
      // Navigate to order book page with ticker param
      navigate(`/orderbook/${trimmed.toUpperCase()}`);
      setSearch("");
    }
  };

  return (
    <div className="bg-background border-b border-primary px-6 py-4 flex justify-between items-center shadow-md font-sans">
  {/* Left Side - Logo */}
  <h1 className="text-3xl font-bold text-accent tracking-widest">TRADEX.</h1>

  {/* Right Side - Links + Search */}
  <div className="flex items-center space-x-6">
    <a href="/" className="hover:text-accent transition">Home</a>
    <a href="/portfolio" className="hover:text-accent transition">Portfolio</a>
    <a href="/orders" className="hover:text-accent transition">Orders</a>
    <a href="/trades" className="hover:text-accent transition">Trades</a>
    <form onSubmit={handleSearchSubmit}>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search ticker..."
        className="px-3 py-1 rounded-md border border-gray-600 bg-[#111] text-[#eee] focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </form>
  </div>
</div>

  );
}
