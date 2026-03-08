import express from "express";
import { body } from "express-validator";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer
router.post(
  "/",
  protect,
  [
    body("paymentMethod").isIn(["COD"]).withMessage("Payment method must be COD for this endpoint"),
    body("items").isArray({ min: 1 }).withMessage("Items are required"),
  ],
  createOrder
);

router.get("/my", protect, getMyOrders);

// Admin
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;

