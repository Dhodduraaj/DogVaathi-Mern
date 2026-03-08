import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../utils/axios.js";
import toast from "react-hot-toast";
import { loadRazorpayScript } from "../../utils/razorpay.js";

const PAYMENT_RAZORPAY = "Razorpay";
const PAYMENT_COD = "COD";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_RAZORPAY);
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const shippingPayload = address;

  useEffect(() => {
    if (user?.name) setAddress((a) => ({ ...a, name: user.name }));
  }, [user?.name]);

  const cartPayload = items.map((i) => ({ productId: i._id, quantity: i.quantity }));

  const handleRazorpayCheckout = async () => {
    setLoading(true);
    try {
      await loadRazorpayScript();
      if (typeof window.Razorpay === "undefined") {
        toast.error("Payment script failed to load. Please refresh and try again.");
        return;
      }
    } catch {
      toast.error("Payment script failed to load.");
      setLoading(false);
      return;
    }
    try {
      const payRes = await api.post("/payments/create-order", {
        items: cartPayload,
        shippingAddress: shippingPayload,
      });
      const { orderId, amount, currency, key } = payRes.data;

      const options = {
        key: key || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Dog Vaathi Supplements",
        order_id: orderId,
        handler: async function (response) {
          try {
            await api.post("/payments/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              items: cartPayload,
              shippingAddress: shippingPayload,
            });
            toast.success("Payment successful!");
            clearCart();
            navigate("/store/orders");
          } catch (err) {
            const msg =
              err?.response?.data?.message || "Payment verification failed";
            toast.error(msg);
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#f97316" },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.errors)
          ? err.response?.data?.errors[0]?.msg
          : null) ||
        "Payment initialization failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCODCheckout = async () => {
    setLoading(true);
    try {
      await api.post("/orders", {
        paymentMethod: "COD",
        items: cartPayload,
        shippingAddress: shippingPayload,
      });
      toast.success("Order placed! Cash on Delivery.");
      clearCart();
      navigate("/store/orders");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.errors)
          ? err.response?.data?.errors[0]?.msg
          : null) ||
        "Order failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const validateAddress = () => {
    if (!address.name?.trim()) {
      toast.error("Please enter your name.");
      return false;
    }
    if (!address.phone?.trim()) {
      toast.error("Please enter your phone number.");
      return false;
    }
    if (!address.addressLine1?.trim()) {
      toast.error("Please enter your address.");
      return false;
    }
    if (!address.city?.trim()) {
      toast.error("Please enter your city.");
      return false;
    }
    if (!address.state?.trim()) {
      toast.error("Please enter your state.");
      return false;
    }
    if (!address.postalCode?.trim()) {
      toast.error("Please enter your postal code.");
      return false;
    }
    return true;
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty. Add products before checkout.");
      return;
    }
    if (!showAddressForm) {
      setShowAddressForm(true);
      return;
    }
    if (!validateAddress()) return;
    if (paymentMethod === PAYMENT_RAZORPAY) {
      handleRazorpayCheckout();
    } else {
      handleCODCheckout();
    }
  };

  return (
    <div className="w-full space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Your Cart
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Review your supplements and choose a payment method.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your cart is empty.
        </p>
      ) : (
        <>
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60 text-xs">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-3 last:border-0 last:pb-0 dark:border-slate-800"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    ₹ {item.price?.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-slate-300 px-2 py-1 dark:border-slate-700"
                    onClick={() =>
                      updateQuantity(item._id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    className="rounded-full border border-slate-300 px-2 py-1 dark:border-slate-700"
                    onClick={() =>
                      updateQuantity(item._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="text-[11px] text-red-500 dark:text-red-400"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <p className="text-slate-600 dark:text-slate-300">Total:</p>
            <p className="text-lg font-semibold text-brand-500 dark:text-brand-400">
              ₹ {total.toFixed(2)}
            </p>
          </div>

          {/* Delivery address */}
          <div className="rounded-2xl border border-cream-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/80">
            <h2 className="mb-3 text-sm font-semibold text-[#333333] dark:text-slate-50">
              Delivery Address
            </h2>
            {showAddressForm ? (
              <div className="grid gap-3 text-xs sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-slate-600 dark:text-slate-400">Name</label>
                  <input
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-slate-600 dark:text-slate-400">Phone</label>
                  <input
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="10-digit mobile"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-slate-600 dark:text-slate-400">Address Line 1</label>
                  <input
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="Street, building, landmark"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-slate-600 dark:text-slate-400">Address Line 2 (optional)</label>
                  <input
                    value={address.addressLine2}
                    onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="Apartment, floor, etc."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-slate-600 dark:text-slate-400">City</label>
                  <input
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-slate-600 dark:text-slate-400">State</label>
                  <input
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-slate-600 dark:text-slate-400">Postal Code</label>
                  <input
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="PIN / ZIP"
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You will be asked to enter your delivery address before placing the order.
              </p>
            )}
          </div>

          {/* Payment method selection */}
          <div className="rounded-2xl border border-cream-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/80">
            <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-50">
              Payment Method
            </h2>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition dark:border-slate-700">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === PAYMENT_RAZORPAY}
                  onChange={() => setPaymentMethod(PAYMENT_RAZORPAY)}
                  className="text-brand-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-200">
                  Razorpay – Pay Online
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition dark:border-slate-700">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === PAYMENT_COD}
                  onChange={() => setPaymentMethod(PAYMENT_COD)}
                  className="text-brand-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-200">
                  Cash on Delivery (COD)
                </span>
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-50 sm:w-auto"
          >
            {loading
              ? "Processing..."
              : !showAddressForm
                ? "Proceed to Payment"
                : paymentMethod === PAYMENT_COD
                  ? "Place order (COD)"
                  : "Proceed to checkout"}
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
