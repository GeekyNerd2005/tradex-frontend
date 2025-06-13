import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  createChart,
  CrosshairMode,
} from "lightweight-charts";
import "../styles/chart.css";
import { Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TradingChartPage() {
  const { symbol } = useParams();
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const candlestickSeries = useRef();
  const volumeSeries = useRef();
  const smaSeries = useRef();
  const markerSeries = useRef([]);

  const [selectedLabel, setSelectedLabel] = useState("All");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [showSMA, setShowSMA] = useState(false);
  const [showVol, setShowVol] = useState(false);

  const timeOptions = {
    "1d": "15m",
    "5d": "1h",
    "1mo": "4h",
    "1y": "5d",
    "5y": "1mo",
    "All": "3mo",
  };
  const rangeOptions = {
    "1d": "1mo",
    "5d": "6mo",
    "1mo": "1y",
    "1y": "5y",
    "5y": "5y",
    "All": "max",
  };

  const interval = timeOptions[selectedLabel];
  const range = rangeOptions[selectedLabel];

  const fetchCandles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://tradex-backend.onrender.com/api/market/candles/${symbol}?range=${range}&interval=${interval}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const candles = res.data.map((c) => ({
        time: c.time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));
      const volumes = res.data.map((c) => ({
        time: c.time,
        value: c.volume,
        color: c.open > c.close ? '#ef5350' : '#26a69a',
      }));

      candlestickSeries.current.setData(candles);
      if (showVol) {
      volumeSeries.current.setData(volumes);
      chartRef.current.timeScale().fitContent();
    }
      if (showSMA) {
        const sma = calculateSMA(candles, 20);
        smaSeries.current.setData(sma);
      }

      addTradeMarkers(candles);
    } catch (err) {
      console.error("Failed to fetch candles:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSMA = (data, period) => {
    const sma = [];
    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1);
      const avg = slice.reduce((sum, d) => sum + d.close, 0) / period;
      sma.push({ time: data[i].time, value: parseFloat(avg.toFixed(2)) });
    }
    return sma;
  };

  const addTradeMarkers = (candles) => {
    const trades = JSON.parse(localStorage.getItem(`trades-${symbol}`)) || [];

    const markers = trades.map((trade) => {
      return {
        time: trade.time,
        position: trade.type === "buy" ? "belowBar" : "aboveBar",
        color: trade.type === "buy" ? "#26a69a" : "#ef5350",
        shape: trade.type === "buy" ? "arrowUp" : "arrowDown",
        text: `${trade.type.toUpperCase()} @ ${trade.price}`,
      };
    });

    candlestickSeries.current.setMarkers(markers);
  };

  useEffect(() => {
    if (chartRef.current) chartRef.current.remove();

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: darkMode ? "#111" : "#FFF" },
        textColor: darkMode ? "#DDD" : "#222",
      },
      grid: {
        vertLines: { color: darkMode ? "#222" : "#EEE" },
        horzLines: { color: darkMode ? "#222" : "#EEE" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderUpColor: "#26a69a",
      borderDownColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    const volume = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceLineVisible: false,
      overlay: true,
      scaleMargins: {
        top: 0.85,
        bottom: 0,
      },
    });

    const smaLine = chart.addLineSeries({
      color: "#ffd700",
      lineWidth: 2,
      priceLineVisible: false,
    });

    chartRef.current = chart;
    candlestickSeries.current = candleSeries;
    volumeSeries.current = volume;
    smaSeries.current = smaLine;

    fetchCandles();

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [symbol, darkMode, showSMA, showVol]);

  useEffect(() => {
    if (symbol) fetchCandles();
  }, [interval, showSMA, showVol]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className={`chart-page ${darkMode ? "dark" : "light"}`}>
      <div className="chart-header">
        <div className="range-buttons">
          {Object.entries(timeOptions).map(([label]) => (
            <button
              key={label}
              className={selectedLabel === label ? "active" : ""}
              onClick={() => setSelectedLabel(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="controls">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
             <button
            className="indicator-toggle"
            onClick={() => setShowVol(!showVol)}
            title="Toggle Volume"
          >
            Vol
          </button>
          <button
            className="indicator-toggle"
            onClick={() => setShowSMA(!showSMA)}
            title="Toggle SMA"
          >
            SMA
          </button>
       
        </div>
      </div>

      <div ref={chartContainerRef} className="chart-container">
        {loading && <div className="spinner"></div>}
      </div>
    </div>
  );
}