const mongoose = require("mongoose");
const moment = require("moment");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  url: { type: String },
  startDate: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetAmount: { type: Number, required: true },
  numberOfPayments: { type: Number, default: 1 },
  contributionFrequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    required: true,
  },
  contributionDay: { type: String }, // For weekly contributions
  contributionDate: { type: String }, // For monthly contributions
  contributedAmount: { type: Number, default: 0 },
  contributionAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number },
  favorite: { type: Boolean, default: false },
  nextPaymentDate: { type: Date },
  contributionDates: { type: [Date] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

itemSchema.pre("save", function (next) {
  this.remainingAmount = this.targetAmount - this.contributedAmount;
  this.contributionAmount = this.targetAmount / this.numberOfPayments;

  // Calculate nextPaymentDate and contributionDates
  const today = moment(this.startDate).startOf("day");
  const contributionDates = [];
  let nextPaymentDate = moment(this.startDate).startOf("day");

  for (let i = 0; i < this.numberOfPayments; i++) {
    switch (this.contributionFrequency) {
      case "daily":
        nextPaymentDate.add(1, "day");
        break;
      case "weekly":
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        let targetDay = daysOfWeek.indexOf(this.contributionDay);
        if (targetDay === -1) targetDay = 0; // Default to Sunday if not found

        while (nextPaymentDate.day() !== targetDay) {
          nextPaymentDate.add(1, "day");
        }
        break;
      case "monthly":
        if (this.contributionDate) {
          nextPaymentDate.date(this.contributionDate);
          if (nextPaymentDate.isBefore(today, "day")) {
            nextPaymentDate.add(1, "month");
          }
        } else {
          nextPaymentDate.add(1, "month");
        }
        break;
      default:
        nextPaymentDate.add(1, "day");
        break;
    }
    contributionDates.push(nextPaymentDate.toDate());
  }

  this.nextPaymentDate = contributionDates[0];
  this.contributionDates = contributionDates;
  next();
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
