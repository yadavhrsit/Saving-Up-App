const mongoose = require("mongoose");
const moment = require("moment");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetAmount: {
    type: Number,
    required: true,
  },
  numberOfPayments: {
    type: Number,
    default: 1,
  },
  contributionFrequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    required: true,
  },
  contributedAmount: {
    type: Number,
    default: 0,
  },
  remainingAmount: {
    type: Number,
  },
  nextPaymentDate:{
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
itemSchema.pre("save", function (next) {
  const today = moment();
  let missedContributions = 0;
  let nextPaymentDate = null;

  switch (this.contributionFrequency) {
    case "daily":
      nextPaymentDate = moment(this.startDate).add(
        this.numberOfPayments,
        "days"
      );
      break;
    case "weekly":
      nextPaymentDate = moment(this.startDate).add(
        this.numberOfPayments * 7,
        "days"
      );
      break;
    case "monthly":
      nextPaymentDate = moment(this.startDate).add(
        this.numberOfPayments,
        "months"
      );
      break;
    default:
      break;
  }

  if (nextPaymentDate.isBefore(today)) {
    const startDate = moment(this.startDate);
    const endDate = today.clone().subtract(1, "day");
    const duration = moment.duration(endDate.diff(startDate)).asDays();
    missedContributions = Math.max(
      0,
      Math.floor(duration / getFrequencyInDays(this.contributionFrequency))
    );
    nextPaymentDate = moment(this.startDate).add(
      missedContributions + this.numberOfPayments,
      this.contributionFrequency
    );
  }

  this.nextPaymentDate = nextPaymentDate.format("MMMM Do, YYYY");
  this.remainingAmount = this.targetAmount - this.contributedAmount;
  next();
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
