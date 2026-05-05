import express from "express"
import { getAll, getSingle, searchByname } from "../controller/ProductController.js";

const router = express.Router();

router.get("/all",getAll);
router.get("/:id",getSingle);
router.get("/search/:name",searchByname);

export default router;