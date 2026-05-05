import { useEffect, useState } from "react";
import API from "../axios/axios";
import demoImage from "../assets/demo.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/Nav_bar.jsx";

const Product = () => {
  const id = window.location.pathname.split("/")[2];
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    imageURL: "",
    price: 0,
    rating: 0,
    review: [],
  });

  const [showFull, setShowFull] = useState(false);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const apicall = async () => {
      try {
        const res = await API.get(`/product/${id}`);
        setProduct(res.data);
      } catch (err) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    apicall();
  }, [id]);

  const addcartFun = async () => {
    setAddingToCart(true);
    try {
      await API.post("/user/addcart", { productId: id, quantity: qty });
      toast.success(`${product.name} added to cart! 🛒`);
    } catch (e) {
      if (e?.response?.status === 401) {
        toast.warn("Please login to add to cart");
        navigate("/login");
      } else {
        toast.error("Failed to add to cart");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <button onClick={() => navigate("/home")} className="text-sm text-gray-500 hover:text-orange-500 mb-6 flex items-center gap-1 transition">
          ← Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-lg grid md:grid-cols-2 gap-8 p-6 md:p-10">

          {/* LEFT - IMAGE */}
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-8">
            <img
              src={product.imageURL || demoImage}
              alt={product.name}
              className="w-full max-h-[380px] object-contain"
              onError={(e) => { e.target.src = demoImage; }}
            />
          </div>

          {/* RIGHT - DETAILS */}
          <div className="flex flex-col justify-between">
            <div className="space-y-5">

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-500 font-medium">⭐ {product.rating || 4.2}</span>
                  <span className="text-gray-400 text-sm">({product.review?.length || 0} reviews)</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-orange-500">₹ {product.price}</div>

              <div>
                <p className={`text-gray-600 leading-relaxed text-sm transition-all ${showFull ? "" : "line-clamp-4"}`}>
                  {product.description}
                </p>
                {product.description?.length > 200 && (
                  <button
                    onClick={() => setShowFull(!showFull)}
                    className="text-orange-500 mt-1 text-sm font-medium hover:underline"
                  >
                    {showFull ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>

              {/* QTY */}
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2">
                  <button
                    onClick={() => setQty((p) => Math.max(1, p - 1))}
                    className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow text-gray-700 hover:bg-orange-50 transition font-bold"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold w-6 text-center">{qty}</span>
                  <button
                    onClick={() => setQty((p) => p + 1)}
                    className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow text-gray-700 hover:bg-orange-50 transition font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={addcartFun}
                disabled={addingToCart}
                className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-60"
              >
                {addingToCart ? "Adding..." : "Add to Cart 🛒"}
              </button>

              <button
                onClick={() =>
                  navigate("/checkout", {
                    state: { type: "single", items: { productId: product._id, quantity: qty } }
                  })
                }
                className="flex-1 border-2 border-orange-500 text-orange-500 py-3 rounded-xl font-semibold hover:bg-orange-50 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
