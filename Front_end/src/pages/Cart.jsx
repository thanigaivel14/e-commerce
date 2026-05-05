import { useState, useEffect } from "react";
import API from "../axios/axios.js";
import demoImage from "../assets/demo.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/Nav_bar.jsx";

const Cart = () => {
  const navigate = useNavigate();
  const [cartList, setCartlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function apiCall() {
      try {
        const res = await API.get("/user/cart");
        setCartlist(res.data);
      } catch (e) {
        if (e?.response?.status !== 404) toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    }
    apiCall();
  }, []);

  const totalPrice = cartList?.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );

  const handleIncrease = (id) => {
    setCartlist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1, changed: true } : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCartlist((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1, changed: true }
          : item
      )
    );
  };

  const handleOrders = () => {
    navigate("/checkout", {
      state: { type: "cart", items: cartList }
    });
  };

  // DELETE single item from backend
  const handleRemove = async (product) => {
    try {
      await API.delete(`/user/cart/item/${product.cartId}`);
      setCartlist((prev) => prev.filter((item) => item.id !== product.id));
      toast.success(`${product.name} removed from cart`);
    } catch (e) {
      toast.error("Failed to remove item");
    }
  };

  // CLEAR entire cart from backend
  const handleClearCart = async () => {
    try {
      await API.delete("/user/cart/clear");
      setCartlist([]);
      toast.info("Cart cleared");
    } catch (e) {
      toast.error("Failed to clear cart");
    }
  };

  const handleUpdateItem = async (product) => {
    try {
      await API.put("/user/cart/quantity", {
        cartId: product.cartId,
        quantity: product.quantity,
      });
      setCartlist((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, changed: false } : item
        )
      );
      toast.success("Quantity updated");
    } catch (e) {
      toast.error("Failed to update quantity");
    }
  };

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

      <div className="max-w-4xl mx-auto px-4 py-6 pb-36">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            My Cart <span className="text-gray-400 text-lg font-normal">({cartList.length} items)</span>
          </h1>
          {cartList.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-sm text-red-500 border border-red-300 px-4 py-1.5 rounded-full hover:bg-red-50 transition"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <p className="text-6xl mb-4">🛒</p>
            <p className="text-xl font-semibold text-gray-500 mb-2">Your cart is empty</p>
            <button
              onClick={() => navigate("/home")}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition font-medium"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cartList.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
              >
                {/* IMAGE */}
                <div className="w-28 h-28 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={product.imageUrl?.length > 0 ? product.imageUrl : demoImage}
                    className="w-full h-full object-contain p-2"
                    alt={product.name}
                    onError={(e) => { e.target.src = demoImage; }}
                  />
                </div>

                {/* CONTENT */}
                <div className="flex flex-col flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-1">{product.description}</p>

                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-orange-500 font-bold text-lg">₹{product.price}</span>

                    {/* QTY CONTROLS */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-1">
                      <button
                        className="w-6 h-6 flex items-center justify-center bg-white rounded-lg shadow text-gray-600 hover:bg-orange-50 transition"
                        onClick={() => handleDecrease(product.id)}
                      >
                        −
                      </button>
                      <span className="font-semibold text-sm w-5 text-center">{product.quantity}</span>
                      <button
                        className="w-6 h-6 flex items-center justify-center bg-white rounded-lg shadow text-gray-600 hover:bg-orange-50 transition"
                        onClick={() => handleIncrease(product.id)}
                      >
                        +
                      </button>
                    </div>

                    {product.changed && (
                      <button
                        className="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 transition"
                        onClick={() => handleUpdateItem(product)}
                      >
                        Update
                      </button>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3 mt-3">
                    <button
                      className="text-xs text-red-500 hover:text-red-700 font-medium transition"
                      onClick={() => handleRemove(product)}
                    >
                      🗑 Remove
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() =>
                        navigate("/checkout", {
                          state: {
                            type: "single",
                            items: { productId: product.id, quantity: product.quantity }
                          }
                        })
                      }
                      className="text-xs text-orange-500 hover:text-orange-700 font-medium transition"
                    >
                      Buy this item
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM SUMMARY */}
      {cartList.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-2xl z-50">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-xl font-bold text-green-600">₹{totalPrice}</p>
            </div>
            <button
              onClick={handleOrders}
              className="px-8 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition shadow-md"
            >
              Proceed to Order →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
