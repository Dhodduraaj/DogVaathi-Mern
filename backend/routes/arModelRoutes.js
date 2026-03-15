import express from "express";
import multer from "multer";
import { getARModels, createARModel, deleteARModel } from "../controllers/arModelController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } }); // Higher limit for 3D models

router.get("/", getARModels);

router.post("/", protect, adminOnly, upload.single("modelFile"), createARModel);

router.delete("/:id", protect, adminOnly, deleteARModel);

export default router;
