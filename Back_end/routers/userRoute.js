import express from "express";
import { login, register,getMe, AddCart ,getCart,productQuantity,deleteCartItem,clearCart,updateAddress, logout} from "../controller/UserController.js";
import authMiddle from "../middleware/protect.js"
const router = express.Router();

router.post("/register",register);
router.post("/login",login)
router.get("/getme",authMiddle,getMe);
router.post("/addcart",authMiddle,AddCart);
router.get("/cart",authMiddle,getCart);
router.put("/cart/quantity",authMiddle,productQuantity);
router.delete("/cart/item/:cartId",authMiddle,deleteCartItem);
router.delete("/cart/clear",authMiddle,clearCart);
router.put("/address",authMiddle,updateAddress);
router.post("/logout",logout)




export default router;