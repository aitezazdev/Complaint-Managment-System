import { promoteToAdmin, demoteFromAdmin } from "../controllers/adminController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.put("/promote/:id", authMiddleware, adminMiddleware, promoteToAdmin);
router.put("/demote/:id", authMiddleware, adminMiddleware, demoteFromAdmin);

export default router;