import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Coupon from "../models/Coupon.js";

const getRazorpayInstance = () => {
  const keyId = (process.env.RAZORPAY_KEY_ID || "").trim().split(/\s+/)[0];
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim().split(/\s+/)[0];
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

    const { items, shippingAddress, couponCode, discountAmount: discount } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    const { total, populatedItems } = await validateCartAndGetTotal(items);
    const finalTotal = Math.max(0, total - (discount || 0));

    const amountPaise = Math.round(finalTotal * 100);
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
      key: (process.env.RAZORPAY_KEY_ID || "").replace(/\s/g, ""),
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
      couponCode,
      discountAmount: discount,
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing Razorpay payment details" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", (process.env.RAZORPAY_KEY_SECRET || "").replace(/\s/g, ""))
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const finalTotal = Math.max(0, total - (discount || 0));

    const order = await Order.create({
      user: req.user._id,
      items: populatedItems,
      totalAmount: finalTotal,
      paymentMethod: "Razorpay",
      paymentStatus: "Paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "confirmed",
      shippingAddress: shippingAddress || {},
      coupon: couponCode,
      discountAmount: discount || 0,
    });

    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase() },
        { $inc: { usedCount: 1 } }
      );
    }

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

/**
 * Create UPI QR Code using Razorpay
 */
export const createQrOrder = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();
    if (!razorpay) return res.status(500).json({ message: "Razorpay keys missing" });

    const { items, shippingAddress, couponCode, discountAmount: discount } = req.body;
    const { total, populatedItems } = await validateCartAndGetTotal(items);
    const finalTotal = Math.max(0, total - (discount || 0));

    const amountPaise = Math.round(finalTotal * 100);
    if (amountPaise < 100) {
      return res.status(400).json({ message: "Minimum amount for QR payment is ₹1" });
    }
    
    // In Razorpay, we can create a payment link with method 'upi' and 'upi_qr'
    // or use the 'Orders' API and show the QR on frontend if supported by checkout.js
    // For a real QR code image source, we use the QR Code API for specific payment links
    
    const razorOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `qr_${Date.now()}`,
      notes: { type: "qr_payment", items: JSON.stringify(items.slice(0, 5)) }
    });

    console.log("Razorpay QR Order Created:", razorOrder.id);

    res.json({
      orderId: razorOrder.id,
      amount: razorOrder.amount,
      key: (process.env.RAZORPAY_KEY_ID || "").replace(/\s/g, "")
    });
  } catch (error) {
    console.error("Create QR Order Error Details:", {
      message: error.message,
      description: error.error?.description,
      code: error.error?.code,
      meta: error.error?.metadata
    });
    res.status(400).json({ 
      message: error.error?.description || error.message || "QR generation failed" 
    });
  }
};

/**
 * Check if a specific Razorpay order has a successful payment
 */
export const checkQrStatus = async (req, res) => {
  try {
    const { orderId, items, shippingAddress, couponCode, discountAmount: discount } = req.body;
    const razorpay = getRazorpayInstance();
    
    const payments = await razorpay.orders.fetchPayments(orderId);
    const successPayment = payments.items.find(p => p.status === "captured");

    if (successPayment) {
      // Check if order already exists to prevent duplicates
      const existingOrder = await Order.findOne({ razorpayOrderId: orderId });
      if (existingOrder) {
        return res.json({ success: true, order: existingOrder });
      }

      const { total, populatedItems } = await validateCartAndGetTotal(items);
      const finalTotal = Math.max(0, total - (discount || 0));
      const order = await Order.create({
        user: req.user._id,
        items: populatedItems,
        totalAmount: finalTotal,
        paymentMethod: "UPI",
        paymentStatus: "Paid",
        razorpayOrderId: orderId,
        razorpayPaymentId: successPayment.id,
        status: "confirmed",
        shippingAddress: shippingAddress || {},
        coupon: couponCode,
        discountAmount: discount || 0,
      });

      if (couponCode) {
        await Coupon.findOneAndUpdate(
          { code: couponCode.toUpperCase() },
          { $inc: { usedCount: 1 } }
        );
      }

      await reduceStock(populatedItems);
      await User.findByIdAndUpdate(req.user._id, {
        $set: { cart: [], defaultAddress: shippingAddress || {} },
      });

      return res.json({ success: true, order });
    }

    res.json({ success: false, message: "Payment pending" });
  } catch (error) {
    console.error("Check QR Status Error:", error);
    res.status(400).json({ message: error.message });
  }
};
