const mongoose = require("mongoose");
const moment = require("moment");

const contributionSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  nextPaymentDate: {
    type: Date,
    default: function () {
      const today = moment();
      let nextPaymentDate = moment(this.date);

      if (!this.item) {
        return nextPaymentDate.toDate();
      }

      const { contributionFrequency, contributionDay, contributionDate } =
        this.item;

      switch (contributionFrequency) {
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
          let targetDay = daysOfWeek.indexOf(contributionDay);
          if (targetDay === -1) targetDay = 0; // Default to Sunday if not found

          while (nextPaymentDate.day() !== targetDay) {
            nextPaymentDate.add(1, "day");
          }
          break;
        case "monthly":
          if (contributionDate) {
            nextPaymentDate.date(contributionDate);
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

      return nextPaymentDate.toDate();
    },
  },
});

const Contribution = mongoose.model("Contribution", contributionSchema);

module.exports = Contribution;
