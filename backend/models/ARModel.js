import mongoose from "mongoose";

const arModelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, default: "General" },
    model: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ARModel = mongoose.model("ARModel", arModelSchema);

export default ARModel;
