const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      const check = setInterval(() => {
        if (window.Razorpay) {
          clearInterval(check);
          resolve();
        }
      }, 50);
      const timeout = setTimeout(() => {
        clearInterval(check);
        if (window.Razorpay) resolve();
        else reject(new Error("Razorpay script load timeout"));
      }, 5000);
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
    document.head.appendChild(script);
  });
}
