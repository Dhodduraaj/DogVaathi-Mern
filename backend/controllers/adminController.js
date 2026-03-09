import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Achievement from "../models/Achievement.js";
import Video from "../models/Video.js";
import { validationResult } from "express-validator";
import cloudinary from "../config/cloudinary.js";

// Basic dashboard statistics for admin panel
export const getDashboardStats = async (req, res) => {
  try {
    const [totalProducts, totalOrders, pendingOrders, revenueAgg] =
      await Promise.all([
        Product.countDocuments({}),
        Order.countDocuments({}),
        Order.countDocuments({ status: "pending" }),
        Order.aggregate([
          {
            $match: {
              status: { $in: ["confirmed", "delivered"] },
            },
          },
          { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
        ]),
      ]);

    const totalRevenue = revenueAgg[0]?.revenue || 0;

    res.json({
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("Admin dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Portfolio Achievements CRUD (admin)
export const createAchievement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, programName, date, description } = req.body;
    let imageUrl = req.body.imageUrl || "";

    if (req.file && req.file.buffer) {
      try {
        const b64 = req.file.buffer.toString("base64");
        const dataUri = `data:${req.file.mimetype || "image/jpeg"};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: "dogvaathi/achievements",
        });
        imageUrl = uploadResult.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr?.message || uploadErr);
        throw new Error(uploadErr?.message || "Image upload failed. Check Cloudinary config.");
      }
    }

    const achievement = await Achievement.create({
      title,
      programName,
      date,
      description,
      imageUrl,
    });
    res.status(201).json(achievement);
  } catch (error) {
    console.error("Create achievement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({}).sort({ date: -1 });
    res.json(achievements);
  } catch (error) {
    console.error("Get achievements error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAchievement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, programName, date, description } = req.body;
    let imageUrl = req.body.imageUrl || undefined;

    if (req.file && req.file.buffer) {
      try {
        const b64 = req.file.buffer.toString("base64");
        const dataUri = `data:${req.file.mimetype || "image/jpeg"};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: "dogvaathi/achievements",
        });
        imageUrl = uploadResult.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr?.message || uploadErr);
        throw new Error(uploadErr?.message || "Image upload failed. Check Cloudinary config.");
      }
    }

    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      {
        title,
        programName,
        date,
        description,
        ...(imageUrl !== undefined && { imageUrl }),
      },
      { new: true }
    );
    if (!achievement) return res.status(404).json({ message: "Achievement not found" });
    res.json(achievement);
  } catch (error) {
    console.error("Update achievement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) return res.status(404).json({ message: "Achievement not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Delete achievement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Videos CRUD
export const createVideo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, platform, url, isFeatured } = req.body;
    let thumbnailUrl = req.body.thumbnailUrl || "";

    if (req.file && req.file.buffer) {
      try {
        const b64 = req.file.buffer.toString("base64");
        const dataUri = `data:${req.file.mimetype || "image/jpeg"};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: "dogvaathi/videos",
        });
        thumbnailUrl = uploadResult.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr?.message || uploadErr);
        throw new Error(uploadErr?.message || "Image upload failed. Check Cloudinary config.");
      }
    }

    const video = await Video.create({
      title,
      platform,
      url,
      thumbnailUrl,
      isFeatured,
    });
    res.status(201).json(video);
  } catch (error) {
    console.error("Create video error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error("Get videos error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateVideo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, platform, url, isFeatured } = req.body;
    let thumbnailUrl = req.body.thumbnailUrl || undefined;

    if (req.file && req.file.buffer) {
      try {
        const b64 = req.file.buffer.toString("base64");
        const dataUri = `data:${req.file.mimetype || "image/jpeg"};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: "dogvaathi/videos",
        });
        thumbnailUrl = uploadResult.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr?.message || uploadErr);
        throw new Error(uploadErr?.message || "Image upload failed. Check Cloudinary config.");
      }
    }

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      {
        title,
        platform,
        url,
        isFeatured,
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
      },
      { new: true }
    );
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (error) {
    console.error("Update video error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Delete video error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

