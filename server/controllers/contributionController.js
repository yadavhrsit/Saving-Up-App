const Contribution = require("../models/Contribution");
const Item = require("../models/Item");
const moment = require("moment");

const contributeToItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const userId = req.user.id;

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const today = moment().startOf("day");
    const nextPaymentDate = moment(item.nextPaymentDate);

    if (today.isBefore(nextPaymentDate, "day")) {
      return res
        .status(400)
        .json({
          error:
            "Contribution is only allowed on or after the next payment date",
        });
    }

    const remainingBudget = item.targetAmount - item.contributedAmount;
    const contributionAmount = Math.min(amount, remainingBudget);

    const contribution = new Contribution({
      item: item._id,
      user: userId,
      amount: contributionAmount,
      date: new Date(),
    });

    item.contributedAmount += contributionAmount;

    // Update nextPaymentDate to the next contribution date
    item.contributionDates.shift();
    item.nextPaymentDate = item.contributionDates[0] || null;

    await item.save();
    await contribution.save();

    res.status(200).json(contribution);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error contributing to item" });
  }
};


// getContributionByItem
const getContributionByItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    } 
    const contributions = await Contribution.find({ item: id, user: userId });
    res.status(200).json(contributions);
  }
  catch (error) {
    res.status(500).json({ error: "Error getting contributions" });
  }
}

module.exports = {
  contributeToItem,
  getContributionByItem
};
