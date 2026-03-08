import express from "express";
import {
  createRazorpayOrder,
  verifyPayment,
  checkPaymentConfig,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/config", protect, checkPaymentConfig);
router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyPayment);

export default router;

