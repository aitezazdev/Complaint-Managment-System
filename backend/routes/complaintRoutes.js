import express from "express";
import { createComplaint, updateComplaint, deleteComplaint } from "../controllers/complaintController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/create", authMiddleware, upload.array("images", 5), createComplaint);
router.put("/update/:id", authMiddleware, upload.array("images", 5), updateComplaint);
router.delete("/delete/:id", authMiddleware, deleteComplaint);

export default router;