import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../axios/axios";
import useAuth from "../context/AuthContext";
import demoImg from "../assets/demo.png";
import NavBar from "../components/Nav_bar.jsx";
import { toast } from "react-toastify";

const CheckOut = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [address, setAddress] = useState(null);
  const [ordering, setOrdering] = useState(false);

  const { type, items } = state || {};

  useEffect(() => {
    if (!state) { navigate("/home"); return; }
    setAddress(user?.address);

    async function fetchData() {
      try {
        if (type === "single") {
          const res = await API.get(`/product/${items.productId}`);
          setProducts([{ ...res.data, quantity: items.quantity }]);
        }
        if (type === "cart") {
          setProducts(items);
        }
      } catch (e) {
        toast.error("Failed to load product details");
      }
    }
    fetchData();
  }, [items, type, user]);

  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const delivery = 40;
  const platform = 5;
  const total = subtotal + delivery + platform;

  const handleOrder = async () => {
    if (!address?.name) {
      toast.warn("Please add a delivery address in your Profile first");
      navigate("/profile");
      return;
    }
    setOrdering(true);
    try {
      if (type === "single") {
        await API.post("/order/single", { pId: items.productId, quantity: items.quantity, otherPrice: 45 });
      }
      if (type === "cart") {
        await API.post("/order/cart", { otherPrice: 45 });
      }
      toast.success("Order placed successfully! 🎉");
      setTimeout(() => navigate("/orders"), 1500);
    } catch (error) {
      const msg = error?.response?.data;
      toast.error(typeof msg === "string" ? msg : "Failed to place order");
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h1>

        <div className="grid md:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="md:col-span-2 space-y-4">

            {/* PRODUCTS */}
            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
              <h2 className="font-semibold text-gray-700 mb-2">Items ({products.length})</h2>
              {products.map((product, index) => (
                <div key={index} className="flex gap-3 items-center border-b last:border-0 pb-3 last:pb-0">
                  <img
                    src={product?.imageUrl || product?.imageURL || demoImg}
                    alt="product"
                    className="w-16 h-16 object-contain rounded-xl bg-gray-50 p-1"
                    onError={(e) => { e.target.src = demoImg; }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-gray-800">{product?.name}</h3>
                    <p className="text-gray-400 text-xs">Qty: {product.quantity}</p>
                  </div>
                  <span className="text-orange-600 font-semibold text-sm">
                    ₹{(product?.price * product.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* ADDRESS */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-gray-700">📍 Delivery Address</h2>
                <button
                  onClick={() => navigate("/profile")}
                  className="text-xs text-orange-500 hover:underline"
                >
                  {address ? "Change" : "Add Address"}
                </button>
              </div>

              {address?.name ? (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-sm text-gray-700 space-y-0.5">
                  <p className="font-semibold">{address.name}</p>
                  <p>{address.addressLine}</p>
                  <p>📞 {address.phone}</p>
                  <p>📮 {address.pincode}</p>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                  <p className="text-red-500 text-sm font-medium">No address added yet</p>
                  <button
                    onClick={() => navigate("/profile")}
                    className="text-xs text-red-500 underline mt-1"
                  >
                    Add address in Profile →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - PRICE SUMMARY */}
          <div className="bg-white rounded-2xl shadow-sm p-5 h-fit">
            <h2 className="font-semibold text-gray-700 mb-4">Price Details</h2>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Items Total</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>₹{delivery}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{platform}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-base text-gray-800">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-2 text-center">
              <p className="text-xs text-green-700 font-medium">💳 Payment: Cash on Delivery</p>
            </div>

            <button
              onClick={handleOrder}
              disabled={ordering}
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 text-sm"
            >
              {ordering ? "Placing Order..." : "Confirm Order 🎉"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
