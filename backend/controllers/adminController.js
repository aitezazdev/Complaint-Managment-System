// controllers/adminController.js
import User from "../models/userModel";

export const promoteToAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.role = "admin";
      await user.save();
      
      res.json({ message: `${user.name} is now an admin` });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};