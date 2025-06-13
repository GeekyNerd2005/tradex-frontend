import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TickerPage from "./pages/HomePage";
import PortfolioPage from "./pages/Portfolio";
import OrderBookPage from "./pages/OrderBookPage";
import TradingChartPage from "./pages/TradingChartPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<TickerPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/portfolio" element={<PortfolioPage />} />
    <Route path="/orderbook/:symbol" element={<OrderBookPage />} />
    <Route path="/tradingchart/:symbol" element={<TradingChartPage />} />
  </Routes>
);

export default AppRoutes;
