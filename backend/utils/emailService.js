import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    console.warn("SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS for order status emails.");
    return null;
  }
  transporter = nodemailer.createTransport({
    host,
    port: port ? parseInt(port, 10) : 587,
    secure: port === "465",
    auth: { user, pass },
  });
  return transporter;
}

export async function sendOrderStatusEmail({ to, orderId, status, userName }) {
  const transport = getTransporter();
  if (!transport) return;

  const statusLabels = {
    pending: "Pending",
    confirmed: "Confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  const label = statusLabels[status] || status;

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: `Dog Vaathi – Order #${orderId?.slice(-6)} status: ${label}`,
      html: `
        <p>Hi ${userName || "Customer"},</p>
        <p>Your order <strong>#${orderId?.slice(-6)}</strong> status has been updated to <strong>${label}</strong>.</p>
        <p>You can view your order details at: ${process.env.FRONTEND_URL || "http://localhost:5173"}/store/orders</p>
        <p>Thanks for choosing Dog Vaathi!</p>
      `,
    });
  } catch (err) {
    console.error("Send order status email error:", err?.message || err);
  }
}
