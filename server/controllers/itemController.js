const Item = require("../models/Item");
const User = require("../models/User");
const moment = require("moment");

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
    const item = await Item.findById(req.params.id);
    if (item) {
      res.json(item);
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
    const { name, targetAmount, contributionFrequency, contributedAmount } = req.body;
    const userId = req.user.id;

    // Fetch user and user's items
    const user = await User.findById(userId);
    const items = await Item.find({ user: userId });

    // Calculate total target amount of all items
    const totalTargetAmount = items.reduce((sum, item) => sum + item.targetAmount, 0);

    // Check if total target amount exceeds user's balance
    if (totalTargetAmount + targetAmount > user.funds) {
      return res.status(400).json({ message: "You cannot add this item because its target amount will exceed your current funds." });
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
      contributedAmount,
    });

    const createdItem = await item.save();
    await User.findByIdAndUpdate(userId, { $push: { items: createdItem._id } });

    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Contribute to item
const contributeToItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const today = moment().startOf("day");
    const nextPaymentDate = moment(item.nextPaymentDate, "MMMM Do, YYYY");

    // Check 
    if (today.isBefore(nextPaymentDate, "day")) {
      return res.status(400).json({
        error: "Contribution is only allowed on or after the next payment date",
      });
    }

    let isPaymentDay = false;
    let contributionAmount = 0;

    switch (item.contributionFrequency) {
      case "daily":
        isPaymentDay = true;
        contributionAmount = item.targetAmount / 30; // Assuming 30 days for monthly target
        break;
      case "weekly":
        isPaymentDay = today.day() >= moment(item.startDate).day();
        contributionAmount = item.targetAmount / 4; // Assuming 4 weeks for monthly target
        break;
      case "monthly":
        isPaymentDay = today.date() >= moment(item.startDate).date();
        contributionAmount = item.targetAmount / 1; // Full amount for monthly target
        break;
      default:
        break;
    }

    // Ensure contribution doesn't exceed the remaining budget
    const remainingBudget = item.targetAmount - item.contributedAmount;
    contributionAmount = Math.min(contributionAmount, remainingBudget);

    // Update item's contributed amount
    item.contributedAmount += contributionAmount;
    await item.save();

    res.status(200).json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error contributing to item" });
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
  contributeToItem,
  markAsFavorite,
  getFrequencyInDays,
  removeFromFavorite,
  updateItem,
  deleteItem,
};
