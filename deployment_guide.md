# Deployment Guide: Dog Vaathi MERN

This guide explains how to deploy the **Frontend to Vercel** and the **Backend to Render**.

---

## 🚀 Part 1: Backend (Render)

1. **Dashboard**: Go to [Render.com](https://render.com) and create a new **Web Service**.
2. **Repository**: Connect your GitHub repository.
3. **Settings**:
   - **Environment**: `Node`
   - **Root Directory**: `backend` (Important!)
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js` (or `npm start`)
4. **Environment Variables**: Add the following in the Render dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A long random string.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: From Cloudinary.
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`: From Razorpay.
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: For emails.
   - `RESEND_API_KEY`: Your API key from Resend.com.
   - `FRONTEND_URL`: Your Vercel URL (e.g., `https://dogvaathi.vercel.app`).
   - `PORT`: `5000` (Render detects this automatically, but good to have).

---

## 📧 Part 3: Email Service (Resend)

By default, Resend only allows sending emails to the **account owner's email** (e.g., `dhodduraajsp@gmail.com`). To send emails to any customer, you must verify your domain:

1. **Add Domain**: Go to [Resend.com/domains](https://resend.com/domains) and add your domain (e.g., `dogvaathi.com`).
2. **DNS Records**: Add the provided MX and SPF records to your domain's DNS settings (GoDaddy, Namecheap, etc.).
3. **Verify**: Click "Verify" in Resend.
4. **Update From Address**: Once verified, change the `from` address in `backend/utils/emailService.js` from `onboarding@resend.dev` to an email using your domain (e.g., `orders@yourdomain.com`).

---

## 🎨 Part 4: Frontend (Vercel)

1. **Dashboard**: Go to [Vercel.com](https://vercel.com) and create a new **Project**.
2. **Repository**: Connect your GitHub repository.
3. **Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (Important!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**: Add the following in the Vercel dashboard:
   - `VITE_API_URL`: Your Render Backend URL (e.g., `https://dogvaathi-backend.onrender.com/api`).
     - *Note: Ensure it ends with `/api`.*

---

## 🛠️ Part 3: Troubleshooting

- **CORS**: If you see CORS errors, ensure `FRONTEND_URL` in Render matches your Vercel URL exactly (no trailing slash).
- **Email**: The email service is optimized for IPv4 on Port 465. If it fails, check if your SMTP provider supports these settings.
- **AR Models**: Ensure your Cloudinary `PRESET` is set to allow `.glb` files if you use signed uploads, or ensure the backend has correct permissions.
