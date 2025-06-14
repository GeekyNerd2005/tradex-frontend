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
  const [showEMA, setShowEMA] = useState(false);
  const ema20Series = useRef();
  const ema50Series = useRef();
  const bbUpperSeries = useRef();
  const bbMiddleSeries = useRef();
  const bbLowerSeries = useRef();
  const [showBB, setShowBB] = useState(false);

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
        `http://localhost:5001/api/market/candles/${symbol}?range=${range}&interval=${interval}`,
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
   
    if (showBB) {
  const bb = calculateBollingerBands(candles);
  bbUpperSeries.current.setData(bb.map(b => ({ time: b.time, value: b.upper })));
  bbMiddleSeries.current.setData(bb.map(b => ({ time: b.time, value: b.middle })));
  bbLowerSeries.current.setData(bb.map(b => ({ time: b.time, value: b.lower })));
} else {
  bbUpperSeries.current.setData([]);
  bbMiddleSeries.current.setData([]);
  bbLowerSeries.current.setData([]);
}


    if (showEMA) {
            const ema20 = calculateEMA(candles, 20);
            const ema50 = calculateEMA(candles, 50);
            ema20Series.current.setData(ema20);
            ema50Series.current.setData(ema50);
          } else {
            ema20Series.current.setData([]);
            ema50Series.current.setData([]);
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
  function calculateEMA(data, period) {
  let k = 2 / (period + 1);
  let emaArray = [];
  let ema = data[0].close; // start with first close
  for (let i = 0; i < data.length; i++) {
    ema = data[i].close * k + ema * (1 - k);
    emaArray.push({ time: data[i].time, value: ema });
  }
  return emaArray;

}
function calculateBollingerBands(data, period = 20, stdDevMultiplier = 2) {
  const bands = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const mean =
      slice.reduce((sum, d) => sum + d.close, 0) / period;
    const variance =
      slice.reduce((sum, d) => sum + Math.pow(d.close - mean, 2), 0) /
      period;
    const stdDev = Math.sqrt(variance);
    bands.push({
      time: data[i].time,
      upper: mean + stdDevMultiplier * stdDev,
      middle: mean,
      lower: mean - stdDevMultiplier * stdDev,
    });
  }
  return bands;

}


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
    crosshair: { mode: CrosshairMode.Normal },
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

  bbUpperSeries.current = chart.addLineSeries({
    color: "#8884d8",
    lineWidth: 1,
    lineStyle: 0,
  });

  bbMiddleSeries.current = chart.addLineSeries({
    color: "#ffc658",
    lineWidth: 1,
    lineStyle: 2,
  });

  bbLowerSeries.current = chart.addLineSeries({
    color: "#8884d8",
    lineWidth: 1,
    lineStyle: 0,
  });

  const smaLine = chart.addLineSeries({
    color: "#ffd700",
    lineWidth: 2,
    priceLineVisible: false,
  });

  ema20Series.current = chart.addLineSeries({
    color: "orange",
    lineWidth: 2,
    priceLineVisible: false,
  });

  ema50Series.current = chart.addLineSeries({
    color: "purple",
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
}, [symbol, darkMode, showSMA, showVol, showEMA, showBB]);


  useEffect(() => {
    if (symbol) fetchCandles();
  }, [interval, showSMA, showVol, showEMA, showBB]);

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
          <button
            className="indicator-toggle"
            onClick={() => setShowEMA(!showEMA)}
            title="Toggle EMA"
          >
            EMA
          </button>
          <button
            className="indicator-toggle"
            onClick={() => setShowBB(!showBB)}
            title="Toggle Bollinger Bands"
          >
            BB
          </button>
        </div>
      </div>

      <div ref={chartContainerRef} className="chart-container">
        {loading && <div className="spinner"></div>}
      </div>
    </div>
  );
}