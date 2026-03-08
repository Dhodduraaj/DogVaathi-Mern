import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const getRazorpayInstance = () => {
  const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
  if (!keyId || !keySecret) {
    return null;
  }
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export const checkPaymentConfig = async (req, res) => {
  const hasKeys =
    !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET;
  res.json({
    configured: hasKeys,
    keyPrefix: hasKeys ? process.env.RAZORPAY_KEY_ID?.slice(0, 10) + "..." : null,
  });
};

/**
 * Validate cart items, check stock, calculate total. Used by create-order and verify.
 */
async function validateCartAndGetTotal(items) {
  let total = 0;
  const populatedItems = [];
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) {
      throw new Error(`Product not available: ${item.productId}`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    total += product.price * item.quantity;
    populatedItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
  }
  return { total, populatedItems };
}

/**
 * Reduce product stock for order items.
 */
async function reduceStock(items) {
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }
}

/**
 * Create Razorpay order only. Validates cart, checks stock, returns Razorpay order + key.
 * Order is created in DB only after verify.
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return res
        .status(500)
        .json({ message: "Razorpay keys not configured on server" });
    }

    const { items, shippingAddress } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    const { total, populatedItems } = await validateCartAndGetTotal(items);

    const amountPaise = Math.round(total * 100);
    if (amountPaise < 100) {
      return res
        .status(400)
        .json({ message: "Minimum order amount for online payment is ₹1" });
    }

    const options = {
      amount: Number(amountPaise),
      currency: "INR",
      receipt: `dogvaathi_${Date.now()}`,
    };
    const razorOrder = await razorpay.orders.create(options);

    res.json({
      orderId: razorOrder.id,
      amount: Number(razorOrder.amount),
      currency: razorOrder.currency || "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    let msg = error.message || "Payment initialization failed";
    if (error.statusCode === 401 || error.error?.description === "Authentication failed") {
      msg =
        "Razorpay keys invalid. Regenerate Key ID & Secret together in Razorpay Dashboard (Test Mode), update backend .env, and restart the server.";
    } else if (error.error?.description) {
      msg = error.error.description;
    }
    res.status(400).json({ message: msg });
  }
};

/**
 * Verify Razorpay signature, then create order in DB, reduce stock, clear user cart.
 * Payload: razorpay_payment_id, razorpay_order_id, razorpay_signature, items, shippingAddress.
 */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      items,
      shippingAddress,
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing Razorpay payment details" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const { total, populatedItems } = await validateCartAndGetTotal(items);

    const order = await Order.create({
      user: req.user._id,
      items: populatedItems,
      totalAmount: total,
      paymentMethod: "Razorpay",
      paymentStatus: "Paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "confirmed",
      shippingAddress: shippingAddress || {},
    });

    await reduceStock(populatedItems);
    await User.findByIdAndUpdate(req.user._id, {
      $set: { cart: [], defaultAddress: shippingAddress || {} },
    });

    res.json({ success: true, order });
  } catch (error) {
    console.error("Verify payment error:", error);
    let msg = error.message || "Payment verification failed";
    if (error.statusCode === 400 || error.error?.description) {
      msg = error.error?.description || error.description || msg;
    }
    res.status(400).json({ message: msg });
  }
};
