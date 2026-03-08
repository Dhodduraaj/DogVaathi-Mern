import express from "express";
import { getCart, updateCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCart);
router.put("/", protect, updateCart);

export default router;
