import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { createChart, CrosshairMode } from "lightweight-charts";

export default function OrderBookPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const [price, setPrice] = useState(null);
  const [currency, setCurrency] = useState("");
  const currencyMap = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
    JPY: "¥"
  };
  const symbolWithCurrency = (amount) =>
  `<h2 className="live-price">{symbolWithCurrency(price)}</h2>
${currencyMap[currency] || currency || ""} ${amount?.toFixed(2)}`;

  const [hoverPrice, setHoverPrice] = useState(null);
  const [error, setError] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [side, setSide] = useState("buy");
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [range, setRange] = useState("3mo");
  const [allData, setAllData] = useState([]);

  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();

  const intervals = {
    "3mo": "4h",
    "6mo": "1d",
    "1y": "5d",
    max: "1mo",
  };

  const visibleDurations = {
    "3mo": 86400 * 90,
    "6mo": 86400 * 180,
    "1y": 86400 * 365,
    max: null,
  };

  useEffect(() => {
  const chart = createChart(chartContainerRef.current, {
    width: chartContainerRef.current.clientWidth,
    height: 400,
    layout: {
      backgroundColor: "#0a0a0a", 
      textColor: "#0099aa",    
      fontFamily: "'Orbitron', 'Fira Code', monospace", 
    },
    grid: {
      vertLines: {
        color: "#1f0022",        
        style: 0,
      },
      horzLines: {
        color: "#1f0022",         
        style: 0,
      },
    },
    crosshair: {
      mode: CrosshairMode.Magnet,
      vertLine: {
        color: "#ff339955",
        width: 1,
        style: 1,
        labelBackgroundColor: "#ff3399",
      },
      horzLine: {
        color: "#00ffff99",
        width: 1,
        style: 1,
        labelBackgroundColor: "#00ffff",
      },
    },
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
      borderColor: "#ff2f6d22",
      barSpacing: 12,
    },
    rightPriceScale: {
      borderColor: "#ff2f6d22",
    },
  });

  const series = chart.addLineSeries({
    color: "#00ffff", 
    lineWidth: 3,
    priceLineVisible: true,
    priceLineColor: "#00ffff",
    priceLineStyle: 2,
    crossHairMarkerVisible: true,
    lastValueVisible: true,
    lineType: 0,
  });

  seriesRef.current = series;
  chartRef.current = chart;

  chart.subscribeCrosshairMove((param) => {
    if (!param.time || !param.seriesData) {
      setHoverPrice(null);
      return;
    }
    const price = param.seriesData.get(seriesRef.current)?.value;
    setHoverPrice(price ?? null);
  });

  const resizeObserver = new ResizeObserver((entries) => {
    if (entries.length === 0) return;
    chart.applyOptions({ width: entries[0].contentRect.width });
  });

  resizeObserver.observe(chartContainerRef.current);

  return () => {
    resizeObserver.disconnect();
    chart.remove();
  };
}, []);

 
  const fetchChart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return setError("No auth token found.");

      const interval = intervals[range] || "1d";
      const res = await axios.get(
        `http://localhost:5001/api/Market/price-history/${symbol}?interval=${interval}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const raw = res.data.chart?.result?.[0];
      const timestamps = raw?.timestamp;
      const ohlc = raw?.indicators?.quote?.[0];

      if (!timestamps || !ohlc) {
        setError("Invalid chart data.");
        return;
      }

      const formatted = timestamps
        .map((t, i) => ({
          time: Math.floor(t),
          value: ohlc.close[i],
        }))
        .filter((d) => d.value != null);

      setAllData(formatted);
      seriesRef.current.setData(formatted);

      const duration = visibleDurations[range];
      if (duration) {
        const to = formatted[formatted.length - 1].time;
        const from = Math.max(formatted[0].time, to - duration);
        chartRef.current.timeScale().setVisibleRange({ from, to });
      } else {
        chartRef.current.timeScale().resetTimeScale();
      }


      setError("");
    } catch (err) {
      console.error("Chart fetch error:", err);
      setError("Failed to fetch chart data.");
    }
  };

  useEffect(() => {
    if (symbol) fetchChart();
  }, [symbol, range]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5001/hubs/orderbook", {
        accessTokenFactory: () => token,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    let isMounted = true;

    connection.on("OrderBookUpdated", (data) => {
      if (!isMounted || data.symbol !== symbol.toUpperCase()) return;
      setBids(data.bids || []);
      setAsks(data.asks || []);
    });

    connection
      .start()
      .then(() => {
        if (connection.state === "Connected") {
          return connection.invoke("JoinGroup", symbol.toUpperCase());
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false;
      connection
        .invoke("LeaveGroup", symbol.toUpperCase())
        .catch(console.error);
      connection.stop();
    };
  }, [symbol]);

useEffect(() => {
  async function fetchPrice() {
    try {
      const res = await axios.get(`http://localhost:5001/api/market/price?ticker=${symbol}`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });

      setPrice(res.data.price);
      setCurrency(res.data.currency); 
    } catch (err) {
      console.error("Error fetching price", err);
    }
  }

  fetchPrice();
}, [symbol]);

  const submitOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setOrderStatus("❌ No token found.");

    const enumOrderSide = { buy: 0, sell: 1 };
    const enumOrderType = {
      market: 0,
      limit: 1,
      stop_market: 2,
      stop_limit: 3,
    };

    try {
      await axios.post(
        "http://localhost:5001/api/Orders/place",
        {
          symbol: symbol.toUpperCase(),
          side: enumOrderSide[side],
          type: enumOrderType[orderType],
          quantity: parseFloat(quantity),
          price: ["limit", "stop_limit"].includes(orderType)
            ? parseFloat(limitPrice)
            : null,
          stopPrice: ["stop_market", "stop_limit"].includes(orderType)
            ? parseFloat(stopPrice)
            : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrderStatus("Order placed!");
    } catch (err) {
      setOrderStatus("Order failed.");
    }
  };

  return (
    <div className="p-6 text-white bg-[#0b0f1a] min-h-screen font-orbitron">
      <h2 className="text-3xl font-bold mb-2 text-cyan-300">
        Live Trading 
      </h2>
      <h2 className="text-3xl font-bold mb-2 text-blue-200">
       {symbol}
      </h2>

      <div className="mb-4 text-lg">
        {price && <p>Current Price: ₹{price.toFixed(2)}</p>}
        {hoverPrice && <p>Hovered: ₹{hoverPrice.toFixed(2)}</p>}
        {error && <p className="text-red-400">{error}</p>}
      </div>

      <button
        onClick={() => navigate(`/tradingchart/${symbol}`)}
        className="px-4 py-2 mb-4 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        Full Trading Chart
      </button>
      
      <div className="md:flex md:gap-8">
  <div className="flex-1 mb-6 md:mb-0">
<div
  ref={chartContainerRef}
  className="rounded-lg overflow-hidden h-[400px] border border-neutral-700"
  style={{ backgroundColor: "#0d0d0d", padding: 0, margin: 0 }}
/>
  </div>

  <div className="w-full md:w-[400px] flex flex-col gap-6">
    <div className="bg-[#161c29] p-5 rounded-lg shadow-inner border border-neutral-700">
      <h3 className="text-lg font-orbitron text-slate-300 mb-3 tracking-wide">
        Place Order
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
        <div>
          <label className="block mb-1">Side</label>
          <select value={side} onChange={(e) => setSide(e.target.value)} className="bg-[#1f2937] text-white p-2 rounded w-full border border-neutral-600">
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Type</label>
          <select value={orderType} onChange={(e) => setOrderType(e.target.value)} className="bg-[#1f2937] text-white p-2 rounded w-full border border-neutral-600">
            <option value="market">Market</option>
            <option value="limit">Limit</option>
            <option value="stop_market">Stop Market</option>
            <option value="stop_limit">Stop Limit</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Quantity</label>
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="bg-[#1f2937] text-white p-2 rounded w-full border border-neutral-600" />
        </div>

        {(orderType === "limit" || orderType === "stop_limit") && (
          <div>
            <label className="block mb-1">Limit Price</label>
            <input type="number" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} className="bg-[#1f2937] text-white p-2 rounded w-full border border-neutral-600" />
          </div>
        )}

        {(orderType === "stop_market" || orderType === "stop_limit") && (
          <div>
            <label className="block mb-1">Stop Price</label>
            <input type="number" value={stopPrice} onChange={(e) => setStopPrice(e.target.value)} className="bg-[#1f2937] text-white p-2 rounded w-full border border-neutral-600" />
          </div>
        )}
      </div>

      <button
        onClick={submitOrder}
        className="mt-5 w-full py-2 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:opacity-90 text-white font-medium rounded transition-all"
      >
        Submit Order
      </button>

      {orderStatus && (
        <p className="text-sm mt-2 text-slate-400">{orderStatus}</p>
      )}
    </div>

    <div className="bg-[#161c29] p-5 rounded-lg shadow-inner border border-neutral-700">
      <h3 className="text-lg font-semibold text-slate-300 mb-3 tracking-wide">
        Order Book
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {[
          ["Bids", bids, "text-emerald-300"],
          ["Asks", asks, "text-rose-300"],
        ].map(([label, data, color]) => (
          <div key={label}>
            <h4 className={`text-sm font-semibold mb-1 ${color}`}>{label}</h4>
            <table className="w-full text-xs text-slate-300">
              <thead>
                <tr className="text-slate-400">
                  <th className="text-left">Price</th>
                  <th className="text-left">Qty</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, idx) => (
                    <tr key={idx}>
                      <td>₹{row.price}</td>
                      <td>{row.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center text-slate-500 py-2">
                      No {label.toLowerCase()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

    </div>
  );
}