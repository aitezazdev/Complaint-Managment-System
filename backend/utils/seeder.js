// utils/seeder.js
import User from "../models/userModel.js";
import dotenv from "dotenv";
import {connectDB} from "../config/db.js";

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "test1@admin.com" });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    const admin = await User.create({
      name: "Admin",
      email: "test1@admin.com",
      password: "Admin@123", 
      role: "admin",
    });

    console.log("Admin created successfully:", admin.email);
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

createAdmin();