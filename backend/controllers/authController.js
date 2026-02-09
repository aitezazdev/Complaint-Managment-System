import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import { sendAccountCreatedEmail } from "../utils/SendEmail.js";

// register a new user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      sendAccountCreatedEmail(user.email, user.name)
        .catch(err => console.log("Email error:", err));

      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id),
        success: true,
        message: "Account created successfully"
      });
    }

  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => {
        if (err.kind === 'minlength') {
          return `${err.path.charAt(0).toUpperCase() + err.path.slice(1)} must be at least ${err.properties.minlength} characters long`;
        }
        return err.message;
      });
      return res.status(400).json({ message: messages[0] || "Validation error" });
    }
    res.status(500).json({ message: "Something went wrong. Please try again" });
  }
};

// login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again" });
  }
};

// get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// get user by id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.json({
        success: true,
        data: user
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.json({ 
        success: true,
        message: "User removed successfully" 
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};