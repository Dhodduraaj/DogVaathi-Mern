import ARModel from "../models/ARModel.js";
import cloudinary from "../config/cloudinary.js";

// Get all standalone AR models
export const getARModels = async (req, res) => {
  try {
    const models = await ARModel.find({ isActive: true });
    res.json(models);
  } catch (error) {
    console.error("Get AR models error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a standalone AR model
export const createARModel = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    let modelData = undefined;

    if (req.file && req.file.buffer) {
      try {
        const b64 = req.file.buffer.toString("base64");
        const dataUri = `data:${req.file.mimetype || "application/octet-stream"};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: "dogvaathi/ar_models",
          resource_type: "raw", // Crucial for non-image files like .glb
        });
        modelData = { url: uploadResult.secure_url, public_id: uploadResult.public_id };
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr);
        return res.status(500).json({ message: "Model upload failed" });
      }
    }

    if (!modelData) {
      return res.status(400).json({ message: "3D model file is required" });
    }

    const arModel = await ARModel.create({
      name,
      description,
      category,
      model: modelData,
    });

    res.status(201).json(arModel);
  } catch (error) {
    console.error("Create AR model error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a standalone AR model
export const deleteARModel = async (req, res) => {
  try {
    const arModel = await ARModel.findById(req.params.id);
    if (!arModel) return res.status(404).json({ message: "Model not found" });

    // Delete from Cloudinary
    if (arModel.model?.public_id) {
      await cloudinary.uploader.destroy(arModel.model.public_id, { resource_type: "raw" });
    }

    await arModel.deleteOne();
    res.json({ message: "Model deleted" });
  } catch (error) {
    console.error("Delete AR model error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
