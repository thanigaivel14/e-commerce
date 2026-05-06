import { useEffect, useState } from "react";
import { FcSearch } from "react-icons/fc";
import { FaRegUserCircle } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";
import logo from "../assets/logo_bg.png"
import { useNavigate } from "react-router-dom";
import useAuth from "../context/AuthContext";
import useProduct from "../context/ProductContext"
import API from "../axios/axios";
import { toast } from "react-toastify";

const NavBar = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { productList, setProductlist } = useProduct();

  useEffect(() => {
    const controller = new AbortController();
    const apiCall = async () => {
      try {
        const res = await API.get(`/product/search/${searchValue}`, { signal: controller.signal });
        setProductlist(res.data);
      } catch (err) {
        if (err.name !== 'CanceledError') console.error(err);
      }
    };
    async function defaultProduct() {
      try {
        const res = await API.get("/product/all");
        setProductlist(res.data);
      } catch (error) {
        console.log(error.message);
      }
    }
    if (searchValue) {
      apiCall();
    } else {
      defaultProduct();
    }
    return () => controller.abort();
  }, [searchValue]);

  const handleLogout = async () => {
    logout();
    toast.info("Logged out successfully");
    navigate("/home");
    setProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-8xl mx-auto h-20 px-5 flex items-center justify-between gap-5">

        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => navigate("/home")}>
          <div className="w-11 h-11 rounded-full overflow-hidden">
            <img src={logo} alt="logo" className="w-full h-full object-cover" />
          </div>
          <div className="leading-tight hidden sm:block">
            <h1 className="text-xl font-bold text-gray-800">Shoppe</h1>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Curated for you</p>
          </div>
        </div>

        {/* Center Search */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-2xl flex items-center bg-gray-100 rounded-full px-4 py-2.5">
            <FcSearch className="w-5 h-5 mr-2 shrink-0" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search products, brands and more"
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="shrink-0 flex gap-3 items-center relative">
          {user ? (
            <>
              {/* Cart */}
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 hover:bg-orange-50 rounded-full transition"
                title="Cart"
              >
                <BsCartCheckFill className="w-6 h-6 text-orange-500" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-orange-50 transition"
                >
                  <FaRegUserCircle className="w-6 h-6 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[80px] truncate">
                    {user.name || "User"}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                    <button
                      onClick={() => { navigate("/profile"); setProfileOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-orange-50 transition"
                    >
                      👤 My Profile
                    </button>
                    <button
                      onClick={() => { navigate("/orders"); setProfileOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-orange-50 transition"
                    >
                      📦 My Orders
                    </button>
                    <hr />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              className="px-5 py-2 rounded-full text-white bg-orange-500 hover:bg-orange-600 transition font-medium text-sm"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
