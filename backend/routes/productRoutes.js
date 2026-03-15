import express from "express";
import multer from "multer";
import {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();
// Use memory storage to avoid disk path issues; upload buffer directly to Cloudinary
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Public
router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);

// Admin
router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([{ name: "image", maxCount: 1 }, { name: "arModelFile", maxCount: 1 }]),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a valid number"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  createProduct
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.fields([{ name: "image", maxCount: 1 }, { name: "arModelFile", maxCount: 1 }]),
  [
    body("name").optional().notEmpty(),
    body("description").optional().notEmpty(),
    body("price").optional().isNumeric(),
    body("category").optional().notEmpty(),
  ],
  updateProduct
);

router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;

