import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function getStatusText(status) {
  switch (status) {
    case 0: return "Pending";
    case 1: return "Completed";
    case 2: return "Cancelled";
    default: return "Unknown";
  }
}

function getSideText(side) {
  return side === 0 ? "Buy" : side === 1 ? "Sell" : "Unknown";
}

function getOrderTypeText(type) {
  switch (type) {
    case 0: return "Market";
    case 1: return "Limit";
    case 2: return "Stop Market";
    case 3: return "Stop Limit";
    default: return "Unknown";
  }
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelStatus, setCancelStatus] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5001/api/Orders/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      setError("Failed to fetch orders.");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    setCancelStatus("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5001/api/Orders/cancel/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCancelStatus(`✅ Order #${orderId} cancelled successfully.`);
      fetchOrders();
    } catch (err) {
      setCancelStatus(`❌ Failed to cancel order #${orderId}.`);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-[#66ffe6] font-orbitron text-xl animate-pulse">
          Fetching your order history...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-red-400 font-orbitron text-lg">
          {error}
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#050505] text-[#ff99cc] font-orbitron px-6 py-10 flex flex-col items-center">
        <div className="w-full max-w-6xl bg-[#1a001fdd] backdrop-blur-md rounded-xl border border-[#ff2f6d44] p-8 shadow-[0_0_25px_#ff2f6d55]">
          <h2 className="text-4xl text-center text-[#ff33aa] font-extrabold mb-8 tracking-wide drop-shadow-[0_0_12px_#ff66cc] animate-fade-in">
            My Orders
          </h2>

          {cancelStatus && (
            <p className="text-center mb-6 text-base text-[#99ffee] drop-shadow-[0_0_6px_#99ffee] animate-fade-in">
              {cancelStatus}
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-[#ff99cc] bg-[#29002166]">
                <tr>
                  {["Symbol", "Side", "Type", "Quantity", "Price", "Status", "Action"].map((h, i) => (
                    <th key={i} className="px-5 py-4 border-b border-[#ff2f6d33] font-semibold text-base tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-[#ff7799] text-lg">
                      You have no orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-[#3a002a33] transition-all duration-200 ease-in-out"
                    >
                      <td className="px-5 py-4">{order.symbol}</td>
                      <td className="px-5 py-4">{getSideText(order.side)}</td>
                      <td className="px-5 py-4">{getOrderTypeText(order.type)}</td>
                      <td className="px-5 py-4">{order.quantity}</td>
                      <td className="px-5 py-4">
                        {order.price !== null ? `$${order.price.toFixed(2)}` : "-"}
                      </td>
                      <td className="px-5 py-4">{getStatusText(order.status)}</td>
                      <td className="px-5 py-4">
                        {order.status === 0 ? (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="px-4 py-1.5 rounded-md bg-gradient-to-r from-[#ff0055] to-[#ff3399] hover:from-[#ff3399] hover:to-[#ff0055] text-black font-bold text-xs shadow-lg hover:shadow-pink-500/40 transition transform hover:scale-105"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-[#999]">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
