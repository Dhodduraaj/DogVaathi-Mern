import { Resend } from "resend";

let resend = null;

function getResendClient() {
  if (resend) return resend;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("Resend API key not configured. Set RESEND_API_KEY in .env.");
    return null;
  }
  resend = new Resend(apiKey);
  return resend;
}

export async function sendOrderStatusEmail({ to, order }) {
  const client = getResendClient();
  if (!client || !order) return;

  // IMPORTANT: Resend in test mode only allows sending to the account owner's email (dhodduraajsp@gmail.com).
  // To send to any recipient, you must verify your domain at https://resend.com/domains

  const { _id, status, user, items, totalAmount, shippingAddress, discountAmount } = order;
  const userName = user?.name || "Customer";
  const orderIdShort = _id.toString().slice(-6).toUpperCase();
  const orderName = items && items.length > 0 ? items[0].name : "Order";

  const statusLabels = {
    pending: "Pending",
    confirmed: "Confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  const label = statusLabels[status] || status;
  const statusColor = status === "cancelled" ? "#ef4444" : status === "delivered" ? "#22c55e" : "#f97316";

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
        <div style="font-weight: 600; color: #1e293b;">${item.name}</div>
        <div style="font-size: 12px; color: #64748b;">Qty: ${item.quantity}</div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right; color: #1e293b;">
        ₹${item.price.toLocaleString()}
      </td>
    </tr>
  `).join("");

  try {
    const { data, error } = await client.emails.send({
      from: "Dog Vaathi <onboarding@resend.dev>",
      to: [to],
      subject: `Order Update: ${orderName} (#${orderIdShort}) is ${label}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            <!-- Header -->
            <div style="background-color: #1e293b; padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Dog Vaathi</h1>
              <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 14px;">Premium Pet Care & Supplements</p>
            </div>

            <!-- Body -->
            <div style="padding: 32px;">
              <h2 style="color: #1e293b; margin-top: 0;">Hi ${userName},</h2>
              <p>Great news! The status of your order <strong>${orderName}</strong> has been updated.</p>
              
              <div style="display: inline-block; padding: 8px 16px; background-color: ${statusColor}15; color: ${statusColor}; border-radius: 9999px; font-weight: bold; font-size: 14px; margin: 16px 0;">
                Current Status: ${label}
              </div>

              <div style="margin-top: 32px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
                <h3 style="margin-top: 0; font-size: 16px; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">Order Summary (#${orderIdShort})</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  ${itemsHtml}
                </table>
                <div style="margin-top: 16px;">
                  ${discountAmount > 0 ? `
                    <div style="display: flex; justify-content: space-between; font-size: 14px; color: #64748b; margin-bottom: 4px;">
                      <span>Discount</span>
                      <span>-₹${discountAmount.toLocaleString()}</span>
                    </div>
                  ` : ""}
                  <div style="display: flex; justify-content: space-between; font-weight: bold; color: #1e293b; font-size: 18px; margin-top: 8px;">
                    <span>Total Amount</span>
                    <span style="color: #f97316;">₹${totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div style="margin-top: 32px;">
                <h3 style="font-size: 16px; color: #1e293b; margin-bottom: 8px;">Shipping Address</h3>
                <p style="font-size: 14px; color: #64748b; margin: 0;">
                  ${shippingAddress.name}<br>
                  ${shippingAddress.addressLine1}${shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ""}<br>
                  ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}<br>
                  ${shippingAddress.phone}
                </p>
              </div>

              <div style="margin-top: 40px; text-align: center;">
                <a href="https://dog-vaathi.vercel.app/store/orders" style="display: inline-block; background-color: #f97316; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Track My Order</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #64748b;">
              <p style="margin: 0;">Questions? Reply to this email or visit our support page.</p>
              <p style="margin: 8px 0 0 0;">&copy; 2026 Dog Vaathi. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend email error:", error);
    } else {
      console.log("Professional email sent successfully via Resend:", data.id);
    }
  } catch (err) {
    console.error("Resend email exception:", err?.message || err);
  }
}
