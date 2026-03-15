import Carousel from "../models/Carousel.js";
import cloudinary from "../config/cloudinary.js";

// Public: Get all active carousel slides
export const getActiveSlides = async (req, res) => {
  try {
    const slides = await Carousel.find({ isActive: true }).sort({ order: 1 });
    res.json(slides);
  } catch (error) {
    console.error("Get slides error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Get all slides
export const getAllSlides = async (req, res) => {
  try {
    const slides = await Carousel.find().sort({ order: 1 });
    res.json(slides);
  } catch (error) {
    console.error("Get all slides error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Create slide
export const createSlide = async (req, res) => {
  try {
    const { title, subtitle, order } = req.body;
    let image = undefined;

    if (req.file && req.file.buffer) {
      try {
        const b64 = req.file.buffer.toString("base64");
        const dataUri = `data:${req.file.mimetype || "image/jpeg"};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: "dogvaathi/carousel",
        });
        image = { url: uploadResult.secure_url, public_id: uploadResult.public_id };
      } catch (uploadErr) {
        console.error("Cloudinary slider upload error:", uploadErr);
        return res.status(500).json({ message: "Image upload failed" });
      }
    } else {
      return res.status(400).json({ message: "Image is required" });
    }

    const slide = await Carousel.create({
      image,
      title,
      subtitle,
      order: Number(order) || 0,
    });

    res.status(201).json(slide);
  } catch (error) {
    console.error("Create slide error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Update slide
export const updateSlide = async (req, res) => {
  try {
    const { title, subtitle, order, isActive } = req.body;
    let image = undefined;

    if (req.file && req.file.buffer) {
      try {
        const b64 = req.file.buffer.toString("base64");
        const dataUri = `data:${req.file.mimetype || "image/jpeg"};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: "dogvaathi/carousel",
        });
        image = { url: uploadResult.secure_url, public_id: uploadResult.public_id };
        
        // Delete old image if updating
        const oldSlide = await Carousel.findById(req.params.id);
        if (oldSlide?.image?.public_id) {
          await cloudinary.uploader.destroy(oldSlide.image.public_id);
        }
      } catch (uploadErr) {
        console.error("Cloudinary slider update upload error:", uploadErr);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const slide = await Carousel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        subtitle,
        order: order != null ? Number(order) : undefined,
        isActive: isActive === "true" || isActive === true,
        ...(image && { image }),
      },
      { new: true }
    );

    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }
    res.json(slide);
  } catch (error) {
    console.error("Update slide error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Delete slide
export const deleteSlide = async (req, res) => {
  try {
    const slide = await Carousel.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }

    if (slide.image?.public_id) {
      await cloudinary.uploader.destroy(slide.image.public_id);
    }

    await slide.deleteOne();
    res.json({ message: "Slide deleted" });
  } catch (error) {
    console.error("Delete slide error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
