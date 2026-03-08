import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const run = async () => {
  try {
    const email = process.argv[2] || "admin@dogvaathi.com";
    const password = process.argv[3] || "Admin@123";

    // Ensure DB is connected before running queries
    await connectDB();

    let user = await User.findOne({ email });
    if (user) {
      user.role = "admin";
      await user.save();
      console.log("Updated existing user to admin:", email);
    } else {
      user = await User.create({
        name: "Dog Vaathi Admin",
        email,
        password,
        role: "admin",
      });
      console.log("Created admin user:", email);
    }
    process.exit(0);
  } catch (err) {
    console.error("Create admin error:", err);
    process.exit(1);
  }
};

run();

