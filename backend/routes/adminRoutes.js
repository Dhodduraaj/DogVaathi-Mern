import express from "express";
import { body } from "express-validator";
import {
  getDashboardStats,
  createAchievement,
  getAchievements,
  updateAchievement,
  deleteAchievement,
  createVideo,
  getVideos,
  updateVideo,
  deleteVideo,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Dashboard stats
router.get("/dashboard", protect, adminOnly, getDashboardStats);

// Achievements
router.post(
  "/achievements",
  protect,
  adminOnly,
  [
    body("title").notEmpty(),
    body("programName").notEmpty(),
    body("date").notEmpty(),
    body("description").notEmpty(),
  ],
  createAchievement
);

// Public list for portfolio
router.get("/achievements", getAchievements);
router.put(
  "/achievements/:id",
  protect,
  adminOnly,
  [
    body("title").notEmpty(),
    body("programName").notEmpty(),
    body("date").notEmpty(),
    body("description").notEmpty(),
  ],
  updateAchievement
);
router.delete("/achievements/:id", protect, adminOnly, deleteAchievement);

// Videos
router.post(
  "/videos",
  protect,
  adminOnly,
  [body("title").notEmpty(), body("url").notEmpty()],
  createVideo
);

// Public list
router.get("/videos", getVideos);
router.put(
  "/videos/:id",
  protect,
  adminOnly,
  [body("title").notEmpty(), body("url").notEmpty()],
  updateVideo
);
router.delete("/videos/:id", protect, adminOnly, deleteVideo);

export default router;

