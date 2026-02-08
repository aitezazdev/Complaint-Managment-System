import User from "../models/userModel.js";

export const promoteToAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({ 
        success: false,
        message: "User is already an admin" 
      });
    }

    user.role = "admin";
    const savedUser = await user.save();

    res.json({ 
      success: true,
      message: `${savedUser.name} is now an admin`,
      data: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    console.error("Error in promoteToAdmin:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const demoteFromAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    if (user.role === "user") {
      return res.status(400).json({ 
        success: false,
        message: "User is already a regular user" 
      });
    }

    user.role = "user";
    const savedUser = await user.save();

    res.json({ 
      success: true,
      message: `${savedUser.name} is now a regular user`,
      data: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    console.error("Error in demoteFromAdmin:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};