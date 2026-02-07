import { Complaint } from "../models/complaintModel.js";
import cloudinary from "../config/cloudinary.js";

const deleteFromCloudinary = async (publicId) => {
  try {
    await Promise.race([
      cloudinary.uploader.destroy(publicId),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 10000),
      ),
    ]);
    return true;
  } catch (error) {
    console.error(`Failed to delete ${publicId}:`, error.message);
    return false;
  }
};

export const createComplaint = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, description, category, address, priority } = req.body;

    if (!title || !description || !category || !address) {
      return res.status(400).json({
        success: false,
        message: "Title, description, category, and address are required",
      });
    }

    const uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const b64 = Buffer.from(file.buffer).toString("base64");
          const dataURI = `data:${file.mimetype};base64,${b64}`;

          const result = await cloudinary.uploader.upload(dataURI, {
            folder: "complaint_images",
            resource_type: "image",
          });

          uploadedImages.push({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } catch (uploadError) {
          for (const img of uploadedImages) {
            await deleteFromCloudinary(img.publicId);
          }

          return res.status(500).json({
            success: false,
            message: "Failed to upload images",
            error: uploadError.message,
          });
        }
      }
    }

    const newComplaint = await Complaint.create({
      userId,
      title,
      description,
      category,
      address,
      images: uploadedImages,
      priority: priority || "Medium",
    });

    await newComplaint.populate("userId", "name email");

    res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      data: newComplaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const isOwner = complaint.userId.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this complaint",
      });
    }

    if (!isAdmin && complaint.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Can only update pending complaints",
      });
    }

    const updatedData = {};

    if (req.body.title) updatedData.title = req.body.title;
    if (req.body.description) updatedData.description = req.body.description;
    if (req.body.category) updatedData.category = req.body.category;
    if (req.body.address) updatedData.address = req.body.address;
    if (req.body.priority) updatedData.priority = req.body.priority;

    if (isAdmin) {
      if (req.body.status) updatedData.status = req.body.status;
      if (req.body.adminNotes !== undefined)
        updatedData.adminNotes = req.body.adminNotes;

      if (req.body.status === "Resolved" && !complaint.resolvedAt) {
        updatedData.resolvedAt = new Date();
      }
    }

    if (req.files && req.files.length > 0) {
      const uploadedImages = [];

      for (const file of req.files) {
        try {
          const b64 = Buffer.from(file.buffer).toString("base64");
          const dataURI = `data:${file.mimetype};base64,${b64}`;

          const result = await cloudinary.uploader.upload(dataURI, {
            folder: "complaint_images",
            resource_type: "image",
          });

          uploadedImages.push({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } catch (uploadError) {
          for (const img of uploadedImages) {
            await deleteFromCloudinary(img.publicId);
          }

          return res.status(500).json({
            success: false,
            message: "Failed to upload images",
            error: uploadError.message,
          });
        }
      }

      for (const img of complaint.images) {
        deleteFromCloudinary(img.publicId);
      }

      updatedData.images = uploadedImages;
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true },
    ).populate("userId", "name email");

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      data: updatedComplaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const isOwner = complaint.userId.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this complaint",
      });
    }

    if (!isAdmin && complaint.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Can only delete pending complaints",
      });
    }

    await Complaint.findByIdAndDelete(id);

    for (const img of complaint.images) {
      deleteFromCloudinary(img.publicId);
    }

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id).populate(
      "userId",
      "name email",
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getUserComplaints = async (req, res) => {
  try {
    const userId = req.user._id;

    const complaints = await Complaint.find({ userId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const complaints = await Complaint.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: complaints.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};