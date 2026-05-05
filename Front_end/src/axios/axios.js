import axios from "axios";
const isDev = import.meta.env.VITE_NODE_ENV === "development";
const url = import.meta.env.DEV
  ? "http://localhost:8000/api/v1"
  : import.meta.env.VITE_API_URL;
const API =axios.create({
          baseURL: url,
          withCredentials:true
})

export default API;