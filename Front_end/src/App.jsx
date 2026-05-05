import Home from "./pages/home.jsx"
import Register from "./pages/signin.jsx"
import Login from "./pages/login.jsx"
import useAuth from "./context/AuthContext"
import { Routes, Route, Navigate } from "react-router-dom";
import Product from "./pages/Product.jsx";
import Cart from "./pages/Cart.jsx"
import CheckOut from "./pages/checkout.jsx";
import OrderHis  from "./pages/orderHis.jsx";
import Profile from "./pages/Profile.jsx";

const App=()=> {
const {user} = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/product/:id" element={<Product/>}/>
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/checkout" element={<CheckOut/>}/>
      <Route path="/orders" element={<OrderHis/>}/>
      <Route path="/profile" element={<Profile/>}/>
    </Routes>
  )
}

export default App;
