import express from "express";
import {
  createRazorpayOrder,
  verifyPayment,
  checkPaymentConfig,
  createQrOrder,
  checkQrStatus,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/config", protect, checkPaymentConfig);
router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyPayment);
router.post("/create-qr", protect, createQrOrder);
router.post("/check-qr-status", protect, checkQrStatus);

export default router;

