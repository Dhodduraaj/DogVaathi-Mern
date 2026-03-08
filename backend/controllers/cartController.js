import User from "../models/User.js";
import Product from "../models/Product.js";

/**
 * Get current user's cart with product details populated.
 */
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "cart.productId",
        model: "Product",
        select: "name price imageUrl isActive",
      })
      .lean();

    if (!user || !user.cart) {
      return res.json([]);
    }

    // Map to cart items with product details; filter out invalid/deleted products
    const items = user.cart
      .filter((c) => c.productId && c.productId.isActive)
      .map((c) => ({
        _id: c.productId._id,
        name: c.productId.name,
        price: c.productId.price,
        imageUrl: c.productId.imageUrl,
        quantity: c.quantity,
      }));

    res.json(items);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update user's cart. Body: { items: [{ productId, quantity }] }.
 * Validates productIds and quantity; stores only valid entries.
 */
export const updateCart = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Items must be an array" });
    }

    const cart = [];
    for (const item of items) {
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const product = await Product.findById(item.productId);
      if (product && product.isActive && product.stock >= qty) {
        cart.push({ productId: product._id, quantity: qty });
      }
    }

    await User.findByIdAndUpdate(req.user._id, { $set: { cart } });
    res.json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
