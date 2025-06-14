import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";

export default function HomePage() {
  const [ticker, setTicker] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

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

  return (
    <div
      className={`h-screen w-screen font-[Rajdhani] flex flex-col items-center justify-center relative px-4 transition-all ${
        darkMode ? "text-[#E0E6F1] bg-[#0B0F2F]" : "text-[#0c1c2f] bg-[#e7f3ff]"
      }`}
    >
      {/* Background Gradient and Blurs */}
      {darkMode && (
        <>
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0B0F2F] via-[#1E2A78] to-[#0B0F2F]" />
          <div
            className="absolute top-1/3 left-1/2 w-[500px] h-[500px] rounded-full blur-[160px]"
            style={{
              background:
                "radial-gradient(circle at center, rgba(0,255,255,0.06), transparent 70%)",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className="absolute bottom-16 right-16 w-[320px] h-[320px] rounded-full blur-[120px]"
            style={{
              background:
                "radial-gradient(circle at center, rgba(0,140,255,0.05), transparent 80%)",
            }}
          />
        </>
      )}

      {/* Form Container */}
      <div
        className={`z-10 backdrop-blur-xl rounded-2xl shadow-[0_0_30px_#2AF5FF11] p-10 max-w-md w-full border transition-all ${
          darkMode
            ? "bg-[#11193F]/80 border-[#2AF5FF33]"
            : "bg-white border-[#b3dfff]"
        }`}
      >
        <h2
          className={`text-3xl font-semibold mb-6 tracking-wide text-center drop-shadow ${
            darkMode ? "text-[#00FFFF]" : "text-[#007acc]"
          }`}
        >
          Enter Ticker
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="e.g. INFY.NS"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className={`px-4 py-3 rounded-lg border placeholder:font-light shadow-inner transition-all focus:outline-none focus:ring-2 ${
              darkMode
                ? "bg-[#192b45] text-[#cfe8ff] border-[#3399ff33] placeholder:text-[#88bfff] focus:ring-[#2AF5FF]"
                : "bg-[#f4faff] text-[#0c1c2f] border-[#cceeff] placeholder:text-[#7aaacc] focus:ring-[#007acc]"
            }`}
            autoComplete="off"
          />
          <button
            type="submit"
            className={`py-3 rounded-lg font-bold tracking-wide transition-all hover:scale-[1.02] hover:shadow-[0_0_10px_#2AF5FF88] ${
              darkMode
                ? "bg-gradient-to-r from-[#00FFFF] to-[#2AF5FF] text-[#0B0F2F]"
                : "bg-gradient-to-r from-[#007acc] to-[#00bfff] text-white"
            }`}
          >
            Go
          </button>
        </form>
        {error && (
          <p className="mt-4 text-sm text-[#ff6666] font-medium text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
