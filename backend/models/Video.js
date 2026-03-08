import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    platform: { type: String, default: "instagram" },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);

export default Video;

