import express from "express";
import {
  createComplaint,
  updateComplaint,
  deleteComplaint,
  getComplaintById,
  getUserComplaints,
  getAllComplaints,
} from "../controllers/complaintController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/create", authMiddleware, upload.array("images", 5), createComplaint);
router.put("/update/:id", authMiddleware, upload.array("images", 5), updateComplaint);
router.delete("/delete/:id", authMiddleware, deleteComplaint);
router.get("/user", authMiddleware, getUserComplaints);
router.get("/all", authMiddleware, getAllComplaints);
router.get("/:id", authMiddleware, getComplaintById);

export default router;