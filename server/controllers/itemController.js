const Item = require("../models/Item");
const User = require("../models/User");
const Contribution = require("../models/contribution");
const moment = require("moment");
const cloudinary = require("cloudinary").v2;

// Get all items
const getAllItems = async (req, res) => {
  try {
    const { search } = req.query;
    const userId = req.user.id;

    const query = {
      user: userId,
      ...(search && { name: new RegExp(search, "i") }),
    };

    const items = await Item.find(query);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("user");
    const contributions = await Contribution.find({ item: item._id });
    if (item) {
      res.json({item, contributions});
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new item
const createItem = async (req, res) => {
  try {
    const {
      name,
      targetAmount,
      contributionFrequency,
      contributionDay,
      contributionDate,
      numberOfPayments,
      url,
    } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const items = await Item.find({ user: userId });

    const totalTargetAmount = items.reduce(
      (sum, item) => sum + item.targetAmount,
      0
    );

    if (totalTargetAmount + parseInt(targetAmount) > user.funds) {
      return res.status(400).json({
        message:
          "You cannot add this item because its target amount will exceed your current funds.",
      });
    }

    let image = null;
    if (req.file) {
      image = req.file.path;
    }

    const item = new Item({
      name,
      image,
      user: userId,
      targetAmount,
      contributionFrequency,
      contributionDay,
      contributionDate,
      numberOfPayments,
      url,
    });

    const createdItem = await item.save();
    await User.findByIdAndUpdate(userId, { $push: { items: createdItem._id } });

    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to get frequency in days
const getFrequencyInDays = (frequency) => {
  switch (frequency) {
    case "daily":
      return 1;
    case "weekly":
      return 7;
    case "monthly":
      return 30; // Assuming 30 days in a month
    default:
      return 1;
  }
};

// Mark item as favorite
const markAsFavorite = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    item.favorite = true;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from favorites
const removeFromFavorite = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    item.favorite = false;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update item
const updateItem = async (req, res) => {
  const { name, image } = req.body;
  try {
    const itemId = req.params.id;
    const userId = req.user.id;
    const item = await Item.findById({ _id: itemId, user: userId });
    console.log(item);
    if (item) {
      item.name = name || item.name;
      item.image = image || item.image;
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.user.id;

    const item = await Item.findOneAndDelete({ _id: itemId, user: userId });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Delete the associated image if it exists
    if (item.image) {
      // Extract the public ID from the image URL
      const publicId = item.image.split("/").pop().split(".")[0];
      // Delete the image from Cloudinary
      await cloudinary.uploader.destroy(publicId);
    }

    await User.findByIdAndUpdate(userId, { $pull: { items: item._id } });

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  markAsFavorite,
  getFrequencyInDays,
  removeFromFavorite,
  updateItem,
  deleteItem,
};
