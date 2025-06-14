import React, { useEffect, useState } from "react";
import axios from "axios";

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
      <div className="min-h-screen bg-[#0a122a] flex items-center justify-center font-rajdhani text-cyan-400 text-xl">
        Fetching your order history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a122a] flex items-center justify-center font-rajdhani text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a122a] px-8 py-12 font-rajdhani text-cyan-400 flex flex-col items-center">
      <section className="w-full max-w-7xl bg-[#071025cc] border border-[#00aaff88] rounded-lg p-8 backdrop-blur-sm">
        <h2 className="text-4xl font-semibold text-[#00aaff] mb-8 tracking-wide">
          My Orders
        </h2>

        {cancelStatus && (
          <p className="mb-6 text-center text-[#55ccff]">
            {cancelStatus}
          </p>
        )}

        <div className="overflow-x-auto rounded-md">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#001733cc] text-[#00aaffcc] uppercase tracking-wide text-sm font-semibold">
              <tr>
                {["Symbol", "Side", "Type", "Quantity", "Price", "Status", "Action"].map((h, i) => (
                  <th key={i} className="px-6 py-3 border-b border-[#00aaff55]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-[#006688] text-lg font-semibold">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#00224455] transition duration-150 ease-in-out cursor-default"
                  >
                    <td className="px-6 py-4 border-b border-[#00446655]">{order.symbol}</td>
                    <td className="px-6 py-4 border-b border-[#00446655]">{getSideText(order.side)}</td>
                    <td className="px-6 py-4 border-b border-[#00446655]">{getOrderTypeText(order.type)}</td>
                    <td className="px-6 py-4 border-b border-[#00446655]">{order.quantity}</td>
                    <td className="px-6 py-4 border-b border-[#00446655]">
                      {order.price !== null ? `$${order.price.toFixed(2)}` : "-"}
                    </td>
                    <td className="px-6 py-4 border-b border-[#00446655]">{getStatusText(order.status)}</td>
                    <td className="px-6 py-4 border-b border-[#00446655]">
                      {order.status === 0 ? (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="px-5 py-2 rounded-md bg-gradient-to-r from-[#0099ff] to-[#0066cc] hover:from-[#33bbff] hover:to-[#3399cc] text-[#001f3f] font-semibold text-sm shadow-sm transition transform hover:scale-105"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-[#3399cc] font-semibold">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
