import { useState } from "react";
import API from "../axios/axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const { fetchUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      toast.warn("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      await API.post("/user/login", user);
      await fetchUser();
      toast.success("Welcome back! 👋");
      navigate("/home");
    } catch (e) {
      const msg = e?.response?.data || "Login failed";
      toast.error(typeof msg === "string" ? msg : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🛍️</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Login to continue shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 text-sm transition"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 text-sm transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-md transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <span className="text-orange-500 cursor-pointer font-medium hover:underline" onClick={() => navigate("/register")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
