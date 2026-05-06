import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import express from "express";
import connectDB from "./data_store/db.js"
import userRoute from "./routers/userRoute.js"
import ProductRoute from "./routers/productRoute.js"
import cors from "cors"
import OrderRoute from "./routers/orderRoute.js"
const app = express ();



configDotenv();
app.use(express.json());
app.use(cookieParser());
const port = 8000;
connectDB();
const is_dev=process.env.IS_DEV ==="true"
app.use(cors({
  origin: is_dev?'http://localhost:5173':process.env.CLIENT_URL  ,
  credentials: true
}));


//routes
app.use('/api/v1/user',userRoute);
app.use("/api/v1/product",ProductRoute);
app.use("/api/v1/order",OrderRoute)

app.listen(port,()=>{
    console.log(`app is running in http://localhost:${port}`)
});