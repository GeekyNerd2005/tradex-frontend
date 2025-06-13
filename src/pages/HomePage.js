import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [ticker, setTicker] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTicker = ticker.trim().toUpperCase();
    if (!trimmedTicker) {
      setError("Please enter a valid ticker");
      return;
    }
    setError("");
    navigate(`/orderbook/${trimmedTicker}`);
  };

  // 🔒 Disable scroll just for this page
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap"
        rel="stylesheet"
      />
      <div
        className="h-screen w-screen overflow-hidden font-[Orbitron] bg-[#0a0a0a] text-[#ff2f6d] flex flex-col items-center justify-center relative px-4"
        style={{ fontFamily: "'Orbitron', sans-serif" }}
      >
        {/* Background Aurora */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#09030f] via-[#120014] to-[#09030f]" />
        <div
          className="absolute top-1/3 left-1/2 w-[450px] h-[450px] rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,20,60,0.06), transparent 80%)",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full blur-[110px]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(180,0,70,0.04), transparent 80%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Branding */}
        <div className="absolute top-6 left-6 z-10">
          <h1 className="text-4xl font-bold text-[#ff3366] tracking-widest uppercase drop-shadow-sm">
            Tradex<span className="text-[#ff99cc]">.</span>
          </h1>
          <p className="text-sm text-[#ffc2d9] italic mt-1 opacity-70">
            Trade smarter. Trade <span className="text-[#ff5588]">Tradex</span>.
          </p>
        </div>

        {/* Search Ticker Box */}
        <div className="z-10 bg-[#120014cc] border border-[#ff2f6d88] rounded-xl shadow-lg p-8 max-w-md w-full">
          <h2 className="text-3xl font-semibold mb-6 text-[#ff3366] tracking-wide text-center drop-shadow-md">
            Search Ticker
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter ticker (e.g. INFY.NS)"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="px-4 py-3 rounded-lg bg-[#1e001f] text-[#ff99bb] border border-[#ff2f6d66] focus:outline-none focus:ring-2 focus:ring-[#ff3366] placeholder:text-[#ff5588] transition"
              style={{ fontSize: "16px" }}
              autoComplete="off"
            />
            <button
              type="submit"
              className="py-3 rounded-lg bg-gradient-to-r from-[#ff0033] to-[#cc0055] hover:from-[#cc0055] hover:to-[#ff0033] text-black font-bold tracking-wide shadow-md transition"
              style={{ fontSize: "16px" }}
            >
              Go
            </button>
          </form>
          {error && (
            <p className="mt-4 text-sm text-[#ff4444] font-semibold text-center drop-shadow-md">
              {error}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
