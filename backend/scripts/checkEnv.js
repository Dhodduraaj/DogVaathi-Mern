import dotenv from "dotenv";

dotenv.config();

const required = [
  "MONGODB_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "FRONTEND_URL",
];

let missing = [];

required.forEach((key) => {
  if (!process.env[key]) {
    missing.push(key);
  }
});

if (missing.length) {
  console.error("Missing environment variables:", missing.join(", "));
  process.exit(1);
}

console.log("All required environment variables are set.");

