# Dog Vaathi – Dog Trainer Portfolio + Dog Supplements E‑Commerce (MERN)

Full‑stack MERN app combining a professional dog trainer portfolio with a dog supplements store.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Auth**: JWT, bcrypt, role‑based admin routes
- **Payments**: Razorpay
- **Uploads**: Multer + Cloudinary

## Local Setup

1. **Backend**
   - `cd backend`
   - `npm install`
   - Create `.env` with:
     - `MONGODB_URI=`
     - `JWT_SECRET=`
     - `CLOUDINARY_CLOUD_NAME=`
     - `CLOUDINARY_API_KEY=`
     - `CLOUDINARY_API_SECRET=`
     - `RAZORPAY_KEY_ID=`
     - `RAZORPAY_KEY_SECRET=`
     - `FRONTEND_URL=http://localhost:5173`
   - `npm run dev`

2. **Frontend**
   - `cd frontend`
   - `npm install`
   - Create `.env` with:
     - `VITE_API_URL=http://localhost:5000/api`
     - `VITE_RAZORPAY_KEY_ID=your_razorpay_key`
   - `npm run dev`

## Deployment

- **Backend (Render)**: point to `backend/server.js`, set same env vars as above.
- **Frontend (Vercel)**: root `frontend`, build command `npm run build`, output `dist`, env `VITE_API_URL=https://your-backend-domain/api`.

## AR‑Ready Frontend

The React app is structured so you can later add AR product visualization (e.g. a dedicated `ARViewer` component using WebXR/Three.js/AR.js) and mount it on future product‑detail routes without major refactors.

