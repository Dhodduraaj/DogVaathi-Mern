import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    imageUrl: { type: String },
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
    arModel: {
      url: { type: String },
      public_id: { type: String },
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;

