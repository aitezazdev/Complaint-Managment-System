import { deleteUser, getAllUsers, getUserById, loginUser, registerUser } from "../controllers/authController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getAllUsers", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteUser);
router.get("/getUser/:id", authMiddleware, adminMiddleware, getUserById);

export default router;