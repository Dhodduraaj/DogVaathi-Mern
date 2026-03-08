import { validationResult } from "express-validator";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { sendOrderStatusEmail } from "../utils/emailService.js";

/**
 * Reduce product stock for order items (used after order is created).
 */
async function reduceStock(items) {
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }
}

/**
 * Create order for COD only. Validates cart, checks stock, creates order,
 * reduces stock, clears user cart.
 */
export const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (paymentMethod !== "COD") {
      return res.status(400).json({
        message: "Use payment flow for Razorpay. This endpoint is for COD only.",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    let totalAmount = 0;
    const populatedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res
          .status(400)
          .json({ message: `Product not available: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
      populatedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: populatedItems,
      totalAmount,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      status: "pending",
      shippingAddress: shippingAddress || {},
    });

    await reduceStock(populatedItems);
    await User.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });

    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.user?.email) {
      sendOrderStatusEmail({
        to: order.user.email,
        orderId: order._id.toString(),
        status,
        userName: order.user.name,
      }).catch(err => console.error("Order status email failed:", err));
    }
    res.json(order);
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
