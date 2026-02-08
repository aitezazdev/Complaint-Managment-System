import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Get current user profile (authenticated users)
router.get("/me", authMiddleware, getCurrentUser);

// Get all users (admin only)
router.get("/", authMiddleware, getAllUsers);

// Get user by ID (admin only)
router.get("/:id", authMiddleware, getUserById);

// Update user (self or admin) - with optional profile picture
router.put("/:id", authMiddleware, upload.single("profilePicture"), updateUser);

// Delete user (self or admin, with restrictions)
router.delete("/:id", authMiddleware, deleteUser);

export default router;