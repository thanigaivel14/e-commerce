import NavBar from "../components/Nav_bar.jsx"
import ProductMain from "../components/ProductMain.jsx";
import useAuth from "../context/AuthContext.jsx";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-400 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {user ? `Welcome back, ${user.name?.split(" ")[0]}! 👋` : "Welcome to Shoppe 🛍️"}
            </h2>
            <p className="text-orange-100 text-sm md:text-base">
              Discover the best deals on top products. Shop smart, save more.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <div className="bg-white/20 backdrop-blur rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-bold">Free</p>
              <p className="text-xs text-orange-100">on orders above ₹499</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-bold">COD</p>
              <p className="text-xs text-orange-100">Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <ProductMain />
    </div>
  );
};

export default Home;
