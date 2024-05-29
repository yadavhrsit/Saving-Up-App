const User = require("../models/User");
const Item = require("../models/Item");
const generateToken = require("../utils/generateToken");

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Authenticate user and get token
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    // Fetch user's items
    const items = await Item.find({ user: user._id });

    // Calculate total allocated funds
    const totalAllocatedFunds = items.reduce(
      (sum, item) => sum + item.targetAmount,
      0
    );

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      items: user.items,
      funds: user.funds,
      totalAllocatedFunds,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const initialData = {
      username: user.username,
      email: user.email,
      funds: user.funds,
      password: user.password,
    };

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.funds = req.body.funds || user.funds;
    if (req.body.newPassword) {
      if (user.password === req.body.currentPassword) {
        user.password = req.body.newPassword;
      } else {
        return res.status(400).json({ message: "Invalid password" });
      }
    }
    const updatedUser = await user.save();

    const updatedData = {
      username: updatedUser.username,
      email: updatedUser.email,
      funds: updatedUser.funds,
      password: updatedUser.password,
    };

    const isUpdated =
      JSON.stringify(initialData) !== JSON.stringify(updatedData);

    if (!isUpdated) {
      return res.status(404).json({ message: "Nothing to Update" });
    } else {
      return res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        funds: updatedUser.funds,
        isUpdated,
      });
    }
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
