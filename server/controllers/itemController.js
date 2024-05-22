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
      ...(search && { name: new RegExp(search, "i") })
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
    const { name, targetAmount, contributionFrequency, contributedAmount } =
      req.body;
    const userId = req.user.id;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
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
    let isPaymentDay = false;
    let contributionAmount = 0;
    let missedContributions = 0;

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

    // Calculate missed contribution count
    if (!isPaymentDay) {
      const startDate = moment(item.startDate);
      const endDate = today.clone().subtract(1, "day");
      const duration = moment.duration(endDate.diff(startDate)).asDays();
      missedContributions = Math.max(
        0,
        Math.floor(duration / getFrequencyInDays(item.contributionFrequency))
      );
    }

    // Check if payment is allowed before the next due date
    const nextPaymentDate = moment(item.startDate).add(
      missedContributions + 1,
      item.contributionFrequency
    );
    if (today.isBefore(nextPaymentDate)) {
      return res
        .status(400)
        .json({ error: "Payment is not allowed before the next due date" });
    }

    // Ensure payment doesn't exceed the budget
    const remainingBudget = item.targetAmount - item.contributedAmount;
    if (contributionAmount > remainingBudget) {
      contributionAmount = remainingBudget;
    }

    item.contributedAmount += contributionAmount;
    item.missedContributions = missedContributions;
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

// Update item
const updateItem = async (req, res) => {
  const {
    name,
    image,
    targetAmount,
    contributionFrequency,
    contributedAmount,
  } = req.body;
  try {
    const itemId = req.params.id;
    const userId = req.user.id;
    const item = await Item.findById({ _id: itemId, user: userId });
    if (item) {
      item.name = name || item.name;
      item.image = image || item.image;
      item.targetAmount = targetAmount || item.targetAmount;
      item.contributionFrequency =
        contributionFrequency || item.contributionFrequency;
      item.contributedAmount = contributedAmount || item.contributedAmount;
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
  updateItem,
  deleteItem,
};
