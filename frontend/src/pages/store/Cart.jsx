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
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);

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

  const validateCoupon = async () => {
    if (!couponCode) return;
    setLoading(true);
    try {
      const res = await api.post("/coupons/validate", {
        code: couponCode,
        cartTotal: total,
      });
      setCouponData(res.data);
      toast.success("Coupon applied!");
    } catch (err) {
      setCouponData(null);
      toast.error(err?.response?.data?.message || "Invalid coupon");
    } finally {
      setLoading(false);
    }
  };

  const finalTotal = total - (couponData?.discountCalculated || 0);

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
        couponCode: couponData?.code,
        discountAmount: couponData?.discountCalculated,
      });
      const { orderId, amount, currency, key } = payRes.data;
      if (!orderId || !key) {
        toast.error("Invalid payment setup. Please try again.");
        setLoading(false);
        return;
      }

      const options = {
        key: key,
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
              couponCode: couponData?.code,
              discountAmount: couponData?.discountCalculated,
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
    setLoading(true);
    try {
      const res = await api.post("/payments/create-qr", {
        items: cartPayload,
        shippingAddress: shippingPayload,
        couponCode: couponData?.code,
        discountAmount: couponData?.discountCalculated,
      });
      const { orderId, amount, key } = res.data;
      
      // We'll use the Razorpay API order ID to generate a UPI intent link
      // For the QR code image, we can use a library or a service
      // Here we set up polling to check if payment is captured
      setShowUpiModal({ orderId, amount, key });
      startPolling(orderId, cartPayload, shippingPayload);
    } catch (err) {
      toast.error(err?.response?.data?.message || "QR generation failed");
    } finally {
      setLoading(false);
    }
  };

  const pollingRef = React.useRef(null);
  
  const startPolling = (orderId, items, shippingAddress) => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    
    pollingRef.current = setInterval(async () => {
      try {
        const res = await api.post("/payments/check-qr-status", {
          orderId,
          items,
          shippingAddress,
          couponCode: couponData?.code,
          discountAmount: couponData?.discountCalculated,
        });
        if (res.data.success) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setShowUpiModal(false);
          toast.success("Payment Successful!");
          clearCart();
          navigate("/store/orders");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    // Stop after 10 mins
    setTimeout(() => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }, 600000);
  };

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const confirmUpiPayment = () => {
    toast.error("Waiting for payment confirmation. If you've paid, please wait a few seconds...");
  };

  const handleCODCheckout = async () => {
    setLoading(true);
    try {
      await api.post("/orders", {
        paymentMethod: "COD",
        items: cartPayload,
        shippingAddress: shippingPayload,
        couponCode: couponData?.code,
        discountAmount: couponData?.discountCalculated,
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
        <h1 className="text-3xl font-bold tracking-tight text-dark-900 dark:text-slate-50">
          Your Cart
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Review your supplements and choose a payment method.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-lg text-slate-500 dark:text-slate-400">
          Your cart is empty.
        </p>
      ) : (
        <>
          <div className="space-y-3 rounded-2xl border border-cream-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 text-lg">
            {items.map((item) => (
              <div
                key={item._id}
                className="group flex flex-wrap items-center gap-4 border-b border-cream-100 pb-4 transition-colors last:border-0 last:pb-0 hover:bg-cream-50/50 dark:border-slate-800 dark:hover:bg-slate-800/50 rounded-lg p-2 -mx-2"
              >
                <div className="flex-1">
                  <p className="text-base font-bold text-dark-900 dark:text-slate-100">
                    {item.name}
                  </p>
                  <p className="text-lg font-semibold text-brand-500 dark:text-brand-400">
                    ₹ {Math.round(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-cream-200 bg-cream-50 px-2 py-1 shadow-inner dark:border-slate-700 dark:bg-slate-900 text-lg">
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-md font-bold text-slate-600 transition-colors hover:bg-white hover:text-brand-600 hover:shadow-sm disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    onClick={() =>
                      updateQuantity(item._id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-dark-900 dark:text-slate-100">{item.quantity}</span>
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-md font-bold text-slate-600 transition-colors hover:bg-white hover:text-brand-600 hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-800"
                    onClick={() =>
                      updateQuantity(item._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="rounded-lg p-2 text-lg font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                  onClick={() => removeFromCart(item._id)}
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4 rounded-2xl bg-brand-500/10 p-5 shadow-sm dark:bg-slate-800/80">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-cream-200 bg-white px-4 py-2 text-base font-bold dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                  <button
                    onClick={validateCoupon}
                    disabled={loading || !couponCode}
                    className="rounded-xl bg-brand-600 px-6 py-2 font-bold text-white transition-all hover:bg-brand-700 disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {couponData && (
              <div className="flex items-center justify-between border-t border-brand-500/20 pt-3 text-base">
                <span className="font-medium text-brand-600 dark:text-brand-400">Discount Applied ({couponData.code}):</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">- ₹ {couponData.discountCalculated}</span>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-brand-500/20 pt-3">
              <p className="text-base font-bold text-dark-900 dark:text-slate-200">Final Total:</p>
              <div className="text-right">
                {couponData && (
                  <p className="text-xs text-slate-400 line-through">₹ {Math.round(total)}</p>
                )}
                <p className="text-3xl font-black text-brand-600 dark:text-brand-400">
                  ₹ {Math.round(finalTotal)}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery address */}
          <div className="rounded-2xl border border-cream-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <h2 className="mb-4 text-base font-bold text-dark-900 dark:text-slate-50">
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
                        <span className="text-lg font-medium text-slate-700 dark:text-slate-200">
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
          <div className="rounded-2xl border border-cream-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <h2 className="mb-4 text-base font-bold text-dark-900 dark:text-slate-50">
              Payment Method
            </h2>
            <div className="space-y-3">
              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all duration-300 hover:shadow-md ${paymentMethod === PAYMENT_RAZORPAY ? 'border-brand-500 bg-brand-500/10 dark:bg-brand-500/10' : 'border-cream-200 hover:border-brand-400 dark:border-slate-700'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === PAYMENT_RAZORPAY}
                  onChange={() => setPaymentMethod(PAYMENT_RAZORPAY)}
                  className="h-4 w-4 text-brand-500 focus:ring-brand-500"
                />
                <span className="font-semibold text-dark-900 dark:text-slate-200">
                  Razorpay – Pay Online
                </span>
              </label>
              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all duration-300 hover:shadow-md ${paymentMethod === PAYMENT_UPI ? 'border-brand-500 bg-brand-500/10 dark:bg-brand-500/10' : 'border-cream-200 hover:border-brand-400 dark:border-slate-700'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === PAYMENT_UPI}
                  onChange={() => setPaymentMethod(PAYMENT_UPI)}
                  className="h-4 w-4 text-brand-500 focus:ring-brand-500"
                />
                <span className="font-semibold text-dark-900 dark:text-slate-200">
                  UPI – Scan QR & Pay
                </span>
              </label>
              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all duration-300 hover:shadow-md ${paymentMethod === PAYMENT_COD ? 'border-brand-500 bg-brand-500/10 dark:bg-brand-500/10' : 'border-cream-200 hover:border-brand-400 dark:border-slate-700'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === PAYMENT_COD}
                  onChange={() => setPaymentMethod(PAYMENT_COD)}
                  className="h-4 w-4 text-brand-500 focus:ring-brand-500"
                />
                <span className="font-semibold text-dark-900 dark:text-slate-200">
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
                {showUpiModal.amount && (
                  <>
                    <p className="mb-2 text-lg text-slate-600 dark:text-slate-300">
                      Scan the QR code with your UPI app. Amount to pay:
                    </p>
                    <p className="mb-4 text-2xl font-bold text-brand-500 dark:text-brand-400">
                      ₹ {(showUpiModal.amount / 100).toFixed(2)}
                    </p>
                    <a
                      href={`upi://pay?pa=razorpay@icici&pn=Dog%20Vaathi&am=${(showUpiModal.amount / 100).toFixed(2)}&cu=INR&tr=${showUpiModal.orderId}`}
                      className="mb-4 block rounded-lg bg-brand-500 px-4 py-2 text-center text-lg font-medium text-white hover:bg-brand-600"
                    >
                      Open in UPI app
                    </a>
                  </>
                )}
                <div className="mb-4 flex flex-col items-center justify-center rounded-xl bg-white p-4 dark:bg-slate-800">
                   <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=razorpay@icici&pn=Dog%20Vaathi&am=${(showUpiModal.amount / 100).toFixed(2)}&cu=INR&tr=${showUpiModal.orderId}`)}`}
                    alt="UPI QR Code"
                    className="h-56 w-56 object-contain"
                  />
                  <p className="mt-2 text-xs text-slate-500">Scan to pay securely via Razorpay</p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (pollingRef.current) {
                        clearInterval(pollingRef.current);
                        pollingRef.current = null;
                      }
                      setShowUpiModal(false);
                    }}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-lg dark:border-slate-700 dark:text-slate-200"
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
