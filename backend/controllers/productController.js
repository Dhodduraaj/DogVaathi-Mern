import { validationResult } from "express-validator";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// Public: get distinct categories for filter dropdown
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category", { isActive: true });
    res.json(categories.sort());
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Public: list products with search/filter/sort
export const getProducts = async (req, res) => {
  try {
    const { search, category, sort, minPrice, maxPrice } = req.query;

    const filter = { isActive: true };
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Product.find(filter);

    if (sort === "price_asc") query = query.sort({ price: 1 });
    else if (sort === "price_desc") query = query.sort({ price: -1 });
    else if (sort === "newest") query = query.sort({ createdAt: -1 });

    const products = await query.exec();
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: create product, supports optional image upload via Cloudinary
export const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, price, category, stock, tags } = req.body;
    let imageUrl = req.body.imageUrl;
    let image = undefined;
    let arModel = undefined;

    // Handle Image Upload
    if (req.files?.image && req.files.image[0].buffer) {
      try {
        const file = req.files.image[0];
        const b64 = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype || "image/jpeg"};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: "dogvaathi/products",
        });
        imageUrl = uploadResult.secure_url;
        image = { url: uploadResult.secure_url, public_id: uploadResult.public_id };
      } catch (uploadErr) {
        console.error("Cloudinary image upload error:", uploadErr);
        throw new Error("Image upload failed");
      }
    }

    // Handle AR Model Upload
    if (req.files?.arModelFile && req.files.arModelFile[0].buffer) {
      try {
        const file = req.files.arModelFile[0];
        const b64 = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype || "application/octet-stream"};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: "dogvaathi/products/ar_models",
          resource_type: "raw",
        });
        arModel = { url: uploadResult.secure_url, public_id: uploadResult.public_id };
      } catch (uploadErr) {
        console.error("Cloudinary AR model upload error:", uploadErr);
        throw new Error("3D Model upload failed");
      }
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock) || 0,
      tags,
      imageUrl,
      image,
      arModel,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    const msg =
      error?.message ||
      error?.error?.message ||
      (typeof error === "string" ? error : "Server error");
    res.status(500).json({ message: msg });
  }
};

export const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, price, category, stock, tags, isActive } =
      req.body;
    let imageUrl = req.body.imageUrl;
    let image = undefined;
    let arModel = undefined;

    // Handle Image Upload
    if (req.files?.image && req.files.image[0].buffer) {
      try {
        const file = req.files.image[0];
        const b64 = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype || "image/jpeg"};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: "dogvaathi/products",
        });
        imageUrl = uploadResult.secure_url;
        image = { url: uploadResult.secure_url, public_id: uploadResult.public_id };
      } catch (uploadErr) {
        console.error("Cloudinary image upload error:", uploadErr);
        throw new Error("Image upload failed");
      }
    }

    // Handle AR Model Upload
    if (req.files?.arModelFile && req.files.arModelFile[0].buffer) {
      try {
        const file = req.files.arModelFile[0];
        const b64 = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype || "application/octet-stream"};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: "dogvaathi/products/ar_models",
          resource_type: "raw",
        });
        arModel = { url: uploadResult.secure_url, public_id: uploadResult.public_id };
      } catch (uploadErr) {
        console.error("Cloudinary AR model upload error:", uploadErr);
        throw new Error("3D Model upload failed");
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price: price != null ? Number(price) : undefined,
        category,
        stock: stock != null ? Number(stock) : undefined,
        tags,
        isActive,
        arModel,
        ...(imageUrl && { imageUrl }),
        ...(image && { image }),
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    const msg =
      error?.message ||
      error?.error?.message ||
      (typeof error === "string" ? error : "Server error");
    res.status(500).json({ message: msg });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete image from Cloudinary
    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    // Delete AR model from Cloudinary (raw resource)
    if (product.arModel?.public_id) {
      await cloudinary.uploader.destroy(product.arModel.public_id, { resource_type: "raw" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

