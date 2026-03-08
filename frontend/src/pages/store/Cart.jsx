import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../utils/axios.js";
import toast from "react-hot-toast";
import { loadRazorpayScript } from "../../utils/razorpay.js";

const PAYMENT_RAZORPAY = "Razorpay";
const PAYMENT_COD = "COD";
const PAYMENT_UPI = "UPI";

const UPI_QR_IMAGE = "/images/upi-qr.png";

const EMPTY_ADDRESS = {
  name: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_RAZORPAY);
  const [loading, setLoading] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [addNewAddress, setAddNewAddress] = useState(false);
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [defaultAddress, setDefaultAddress] = useState(null);

  const shippingPayload = useDefaultAddress && defaultAddress ? defaultAddress : address;

  useEffect(() => {
    if (user?.name && !address.name) setAddress((a) => ({ ...a, name: user.name }));
  }, [user?.name]);

  useEffect(() => {
    if (!user) return;
    api.get("/auth/me").then((res) => {
      const u = res.data;
      if (u?.defaultAddress && Object.values(u.defaultAddress).some(Boolean)) {
        setDefaultAddress(u.defaultAddress);
        setUseDefaultAddress(true);
        setAddNewAddress(false);
      } else {
        setDefaultAddress(null);
        setUseDefaultAddress(false);
        setAddNewAddress(true);
      }
    }).catch(() => {
      setDefaultAddress(null);
      setUseDefaultAddress(false);
      setAddNewAddress(true);
    });
  }, [user?.id]);

  const cartPayload = items.map((i) => ({ productId: i._id, quantity: i.quantity }));

  const handleRazorpayCheckout = async () => {
    setLoading(true);
    try {
      await loadRazorpayScript();
      if (typeof window.Razorpay === "undefined") {
        toast.error("Payment script failed to load. Please refresh and try again.");
        setLoading(false);
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
      if (!orderId || !key) {
        toast.error("Invalid payment setup. Please try again.");
        setLoading(false);
        return;
      }

      const options = {
        key: key || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency: currency || "INR",
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
            console.error("Razorpay verify error:", err?.response?.data || err);
            const msg =
              err?.response?.data?.message || "Payment verification failed";
            toast.error(msg);
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#f97316" },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setLoading(false);
        const reason = response.error?.reason || response.error?.description;
        toast.error(reason || "Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      console.error("Razorpay checkout error:", err?.response?.data || err);
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

  const handleUPICheckout = async () => {
    setShowUpiModal(true);
  };

  const confirmUpiPayment = async () => {
    setLoading(true);
    try {
      await api.post("/orders", {
        paymentMethod: "UPI",
        items: cartPayload,
        shippingAddress: shippingPayload,
      });
      toast.success("Order placed! Thank you for your UPI payment.");
      setShowUpiModal(false);
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
    const addr = shippingPayload;
    if (!addr?.name?.trim()) {
      toast.error("Please enter your name.");
      return false;
    }
    if (!addr?.phone?.trim()) {
      toast.error("Please enter your phone number.");
      return false;
    }
    if (!addr?.addressLine1?.trim()) {
      toast.error("Please enter your address.");
      return false;
    }
    if (!addr?.city?.trim()) {
      toast.error("Please enter your city.");
      return false;
    }
    if (!addr?.state?.trim()) {
      toast.error("Please enter your state.");
      return false;
    }
    if (!addr?.postalCode?.trim()) {
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
    } else if (paymentMethod === PAYMENT_UPI) {
      handleUPICheckout();
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
              <div className="space-y-4">
                {defaultAddress && Object.values(defaultAddress).some(Boolean) && (
                  <div className="space-y-2">
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition dark:border-slate-700">
                      <input
                        type="radio"
                        name="addressChoice"
                        checked={useDefaultAddress && !addNewAddress}
                        onChange={() => {
                          setUseDefaultAddress(true);
                          setAddNewAddress(false);
                        }}
                        className="mt-1 text-brand-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          Use default address
                        </span>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                          {defaultAddress.name}, {defaultAddress.phone}
                          <br />
                          {defaultAddress.addressLine1}
                          {defaultAddress.addressLine2 && `, ${defaultAddress.addressLine2}`}
                          <br />
                          {defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}
                        </p>
                      </div>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAddNewAddress(true);
                        setUseDefaultAddress(false);
                        setAddress({ ...EMPTY_ADDRESS, name: user?.name || "" });
                      }}
                      className="text-xs font-medium text-brand-500 hover:underline"
                    >
                      + Add new address
                    </button>
                  </div>
                )}
                {addNewAddress && (
                  <div className="grid gap-3 text-xs sm:grid-cols-2">
                    {defaultAddress && (
                      <div className="sm:col-span-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAddNewAddress(false);
                            setUseDefaultAddress(true);
                          }}
                          className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        >
                          ← Use default address
                        </button>
                      </div>
                    )}
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
                )}
                {!defaultAddress && (
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
                )}
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
                  checked={paymentMethod === PAYMENT_UPI}
                  onChange={() => setPaymentMethod(PAYMENT_UPI)}
                  className="text-brand-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-200">
                  UPI – Scan QR & Pay
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

          {/* UPI QR Modal */}
          {showUpiModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-slate-900">
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
                  Pay via UPI
                </h3>
                <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">
                  Scan the QR code with your UPI app. Amount to pay:
                </p>
                <p className="mb-4 text-2xl font-bold text-brand-500 dark:text-brand-400">
                  ₹ {total.toFixed(2)}
                </p>
                {import.meta.env.VITE_UPI_ID && (
                  <a
                    href={`upi://pay?pa=${import.meta.env.VITE_UPI_ID}&pn=Dog%20Vaathi&am=${total.toFixed(2)}&cu=INR`}
                    className="mb-4 block rounded-lg bg-brand-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-600"
                  >
                    Open in UPI app (₹{total.toFixed(2)} pre-filled)
                  </a>
                )}
                <div className="mb-4 flex justify-center rounded-xl bg-white p-4 dark:bg-slate-800">
                  <img
                    src={UPI_QR_IMAGE}
                    alt="UPI QR Code"
                    className="h-56 w-56 object-contain"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f1f5f9' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-size='12'%3EUpload QR to public/images/upi-qr.png%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUpiModal(false)}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-700 dark:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmUpiPayment}
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? "Placing order..." : "I've paid"}
                  </button>
                </div>
              </div>
            </div>
          )}

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
                  : paymentMethod === PAYMENT_UPI
                    ? "Pay via UPI"
                    : "Proceed to checkout"}
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
