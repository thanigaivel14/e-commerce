import { useState, useEffect } from "react";
import API from "../axios/axios.js";
import useAuth from "../context/AuthContext.jsx";
import demoImg from "../assets/demo.png";
import NavBar from "../components/Nav_bar.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const statusColor = {
  PLACED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-yellow-100 text-yellow-700",
  DELIVERED: "bg-green-100 text-green-700",
};

const OrderHis = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function apicall() {
      try {
        const res = await API.get("/order/history");
        setOrders(res.data);
      } catch (e) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    apicall();
  }, [user]);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <p className="text-6xl mb-4">📦</p>
            <p className="text-xl font-semibold text-gray-500 mb-2">No orders yet</p>
            <button
              onClick={() => navigate("/home")}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition font-medium"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

                {/* ORDER HEADER */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Order ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-700">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                      {order.orderStatus}
                    </span>
                    <span className="text-xs text-gray-400">{order.date}</span>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="space-y-3 border-t pt-3">
                  {order.item.map((item, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <img
                        src={item.imageUrl || demoImg}
                        alt={item.name}
                        className="w-14 h-14 object-contain rounded-xl bg-gray-50 p-1"
                        onError={(e) => { e.target.src = demoImg; }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800">{item.name}</p>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-orange-600 font-semibold text-sm">₹{item.price}</span>
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-end border-t mt-4 pt-4">
                  <div className="text-xs text-gray-500">
                    <p>📍 {order.address?.addressLine}</p>
                    <p className="mt-1">💳 {order.paymentMethod} · {order.paymentStatus}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total Paid</p>
                    <p className="text-lg font-bold text-gray-800">₹{order.totalAmount?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHis;
