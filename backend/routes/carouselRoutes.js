import express from "express";
import multer from "multer";
import {
  getActiveSlides,
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
} from "../controllers/carouselController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 5 * 1024 * 1024 } 
});

// Public
router.get("/", getActiveSlides);

// Admin
router.get("/admin", protect, adminOnly, getAllSlides);
router.post("/", protect, adminOnly, upload.single("image"), createSlide);
router.put("/:id", protect, adminOnly, upload.single("image"), updateSlide);
router.delete("/:id", protect, adminOnly, deleteSlide);

export default router;
