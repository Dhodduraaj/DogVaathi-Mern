import express from "express";
import { getCoupons, createCoupon, deleteCoupon, validateCoupon } from "../controllers/couponController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes
router.get("/", protect, adminOnly, getCoupons);
router.post("/", protect, adminOnly, createCoupon);
router.delete("/:id", protect, adminOnly, deleteCoupon);

// Public/User routes
router.post("/validate", protect, validateCoupon);

export default router;
