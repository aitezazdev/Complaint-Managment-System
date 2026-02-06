import { loginUser , registerUser } from "../controllers/authController.js";
import express from "express";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);

export default router;