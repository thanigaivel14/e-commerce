import { StrictMode } from 'react'
import{BrowserRouter} from "react-router-dom"
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ProductProvider>
  <AuthProvider>
    <App />
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover theme="colored" />
  </AuthProvider>
  </ProductProvider>
  </BrowserRouter>,
)
