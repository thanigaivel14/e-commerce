import express from "express";
import { singleOrder,orderHis,cartOrder } from "../controller/orderController.js";
import authMiddle from "../middleware/protect.js"

const router = express.Router();

router.post("/single",authMiddle,singleOrder);
router.get("/history",authMiddle,orderHis);
router.post("/cart",authMiddle,cartOrder);


export default router;