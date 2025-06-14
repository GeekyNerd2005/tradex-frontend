import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegistrationPage";
import HomePage from "./pages/HomePage";
import PortfolioPage from "./pages/Portfolio";
import MyOrdersPage from "./pages/MyOrdersPage";
import MyTradesPage from "./pages/MyTradesPage";
import OrderBookPage from "./pages/OrderBookPage";
import TradingChartPage from "./pages/TradingChartPage";
import PrivateRoute from "./components/PrivateRoute";
import AppLayout from "./components/AppLayout";
import { ThemeProvider } from "./context/ThemeContext";
function App() {
  return (
    <ThemeProvider>
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated layout with Navbar */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout>
                <HomePage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <PrivateRoute>
              <AppLayout>
                <PortfolioPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <AppLayout>
                <MyOrdersPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/trades"
          element={
            <PrivateRoute>
              <AppLayout>
                <MyTradesPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/orderbook/:symbol"
          element={
            <PrivateRoute>
              <AppLayout>
                <OrderBookPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tradingchart/:symbol"
          element={
            <PrivateRoute>
              <AppLayout>
                <TradingChartPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;