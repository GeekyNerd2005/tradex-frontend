import React from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";

const staticData = [
  { symbol: "RELIANCE", price: 2820.45, change: 0.86 },
  { symbol: "TCS", price: 3752.65, change: -0.21 },
  { symbol: "INFY", price: 1499.9, change: 1.13 },
  { symbol: "HDFCBANK", price: 1678.25, change: -0.42 },
  { symbol: "ICICIBANK", price: 1125.75, change: 0.63 },
  { symbol: "LT", price: 3520.1, change: -0.08 },
  { symbol: "SBIN", price: 820.95, change: 1.32 },
  { symbol: "BHARTIARTL", price: 1122.45, change: -0.15 },
  { symbol: "ITC", price: 446.2, change: 0.22 },
  { symbol: "KOTAKBANK", price: 1680, change: -1.06 },
  { symbol: "HINDUNILVR", price: 2642.1, change: 0.78 },
  { symbol: "BAJFINANCE", price: 7190.25, change: -0.55 },
  { symbol: "ONGC", price: 177.45, change: 2.12 },
  { symbol: "WIPRO", price: 481.2, change: 0.34 },
  { symbol: "MARUTI", price: 10220.3, change: -0.27 },
  { symbol: "NTPC", price: 358.95, change: 0.44 },
  { symbol: "ULTRACEMCO", price: 9020.1, change: -0.16 },
  { symbol: "AXISBANK", price: 1095.8, change: 1.11 },
  { symbol: "JSWSTEEL", price: 822.75, change: -0.33 },
  { symbol: "SUNPHARMA", price: 1220.45, change: 0.88 },
  { symbol: "TITAN", price: 3720.25, change: -0.64 },
  { symbol: "DRREDDY", price: 5902.9, change: 1.05 },
  { symbol: "HCLTECH", price: 1425.3, change: -0.27 },
  { symbol: "TECHM", price: 1342.7, change: 0.39 },
  { symbol: "COALINDIA", price: 482.95, change: -0.17 },
  { symbol: "ASIANPAINT", price: 3025.6, change: 0.55 },
  { symbol: "ADANIENT", price: 2822.3, change: -0.23 },
  { symbol: "BPCL", price: 551.1, change: 0.48 },
  { symbol: "DIVISLAB", price: 4082.2, change: -0.31 },
  { symbol: "GRASIM", price: 2105.6, change: 0.62 },
];

export default function TickerBanner() {
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const renderTickers = () =>
    staticData.map(({ symbol, price, change }) => (
      <span key={symbol} className="mx-6 text-sm md:text-base">
        {symbol} ₹{price.toFixed(2)}{" "}
        <span className={change >= 0 ? "text-green-400" : "text-red-400"}>
          {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
        </span>
      </span>
    ));

  return (
    <div
      className={`w-full overflow-hidden whitespace-nowrap border-y py-2 z-40 ${
        darkMode
          ? "bg-[#0a122a] text-cyan-200 border-[#1a2c45]"
          : "bg-[#dff2ff] text-[#003355] border-[#aad8ff]"
      }`}
    >
      <div className="flex animate-marquee gap-16">
        <div className="flex">{renderTickers()}</div>
        <div className="flex">{renderTickers()}</div> 
      </div>
    </div>
  );
}
