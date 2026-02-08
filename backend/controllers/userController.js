import User from "../models/userModel.js";
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

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const { role, page = 1, limit = 10, search } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const complaintCount = await Complaint.countDocuments({
          userId: user._id,
        });
        return {
          ...user.toObject(),
          complaintCount,
        };
      }),
    );

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: usersWithStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const complaintCount = await Complaint.countDocuments({ userId: id });
    const pendingCount = await Complaint.countDocuments({
      userId: id,
      status: "Pending",
    });
    const resolvedCount = await Complaint.countDocuments({
      userId: id,
      status: "Resolved",
    });

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        statistics: {
          totalComplaints: complaintCount,
          pending: pendingCount,
          resolved: resolvedCount,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Update user profile
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isSelf = user._id.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isSelf && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this user",
      });
    }

    if (req.body.name) user.name = req.body.name;

    if (req.body.email) {
      const emailExists = await User.findOne({
        email: req.body.email,
        _id: { $ne: id },
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }

      user.email = req.body.email;
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      user.password = req.body.password;
    }

    if (req.file) {
      try {
        if (user.profilePicture?.publicId) {
          await deleteFromCloudinary(user.profilePicture.publicId);
        }

        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "user_profiles",
          resource_type: "image",
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
            { quality: "auto" },
          ],
        });

        user.profilePicture = {
          url: result.secure_url,
          publicId: result.public_id,
        };
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile picture",
          error: uploadError.message,
        });
      }
    }

    if (isAdmin && req.body.role) {
      user.role = req.body.role;
    }

    await user.save();

    const updatedUser = await User.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isSelf = user._id.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isSelf && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this user",
      });
    }

    if (isAdmin && isSelf) {
      return res.status(400).json({
        success: false,
        message:
          "Admins cannot delete their own account. Please contact another admin.",
      });
    }

    const userComplaints = await Complaint.find({ userId: id });

    const deletionPromises = [];

    for (const complaint of userComplaints) {
      if (complaint.images && complaint.images.length > 0) {
        for (const img of complaint.images) {
          deletionPromises.push(deleteFromCloudinary(img.publicId));
        }
      }
    }

    if (user.profilePicture && user.profilePicture.publicId) {
      deletionPromises.push(deleteFromCloudinary(user.profilePicture.publicId));
    }

    await Promise.allSettled(deletionPromises);

    await Complaint.deleteMany({ userId: id });

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User and all associated data deleted successfully",
      deletedComplaints: userComplaints.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const complaintCount = await Complaint.countDocuments({ userId });
    const pendingCount = await Complaint.countDocuments({
      userId,
      status: "Pending",
    });
    const inProgressCount = await Complaint.countDocuments({
      userId,
      status: "In Progress",
    });
    const resolvedCount = await Complaint.countDocuments({
      userId,
      status: "Resolved",
    });
    const rejectedCount = await Complaint.countDocuments({
      userId,
      status: "Rejected",
    });

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        statistics: {
          totalComplaints: complaintCount,
          pending: pendingCount,
          inProgress: inProgressCount,
          resolved: resolvedCount,
          rejected: rejectedCount,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
