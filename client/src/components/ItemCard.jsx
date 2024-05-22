import React, { useEffect, useState } from "react";
import { FaTrash, FaPlusCircle, FaHeart, FaRegHeart } from "react-icons/fa";
import moment from "moment";

const ItemCard = ({ item, onDelete, onContribute, onToggleFavorite }) => {
  const [isContributionDay, setIsContributionDay] = useState(false);
  const [missedContributions, setMissedContributions] = useState(0);
  const [nextPaymentDate, setNextPaymentDate] = useState(null);

  useEffect(() => {
    const calculateContributionStatus = () => {
      const today = moment();
      let shouldContribute = false;
      let missedCount = 0;

      if (item.contributionFrequency === "daily") {
        shouldContribute = true;
      } else if (item.contributionFrequency === "weekly") {
        const startDay = moment(item.startDate).day();
        shouldContribute = today.day() === startDay || today.day() > startDay;
      } else if (item.contributionFrequency === "monthly") {
        const startDate = moment(item.startDate).date();
        shouldContribute =
          today.date() === startDate || today.date() > startDate;
      }

      setIsContributionDay(shouldContribute);

      if (!shouldContribute) {
        const startDate = moment(item.startDate);
        const endDate = today.clone().subtract(1, "day");
        const duration = moment.duration(endDate.diff(startDate)).asDays();
        missedCount = Math.max(
          0,
          Math.floor(duration / getFrequencyInDays(item.contributionFrequency))
        );
      }

      setMissedContributions(missedCount);

      // Calculate the next payment date
      const nextDate = moment(item.startDate).add(
        missedCount + 1,
        item.contributionFrequency
      );
      setNextPaymentDate(nextDate.format("MMMM Do, YYYY"));
    };

    calculateContributionStatus();
  }, [item.contributionFrequency, item.startDate]);

  const handleContribute = () => {
    if (isContributionDay || missedContributions > 0) {
      onContribute(item._id);
    }
  };

  // Calculate progress percentage
  const progressPercentage = Math.min(
    (item.contributedAmount / item.targetAmount) * 100,
    100
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col lg:flex-row justify-between items-center transition duration-300 ease-in-out transform hover:scale-105">
      <div className="flex flex-col justify-between flex-grow lg:pr-6">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {item.name}
          </h3>
          <div className="mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Target:{" "}
            </span>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              ${item.targetAmount}
            </span>
          </div>
          <div className="mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Saved:{" "}
            </span>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              ${item.contributedAmount}
            </span>
          </div>
          <div className="mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Remaining:{" "}
            </span>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              ${item.remainingAmount}
            </span>
          </div>
          <div className="mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Missed Contributions:{" "}
            </span>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {missedContributions}
            </span>
          </div>
          {nextPaymentDate && (
            <div className="mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Next Payment Date:{" "}
              </span>
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {nextPaymentDate}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center w-full">
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {progressPercentage.toFixed(2)}%
          </p>
        </div>
        <div className="flex space-x-4 mt-4">
          {(isContributionDay || missedContributions > 0) && (
            <button
              onClick={handleContribute}
              className="flex items-center text-nowrap justify-center px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Pay Now <FaPlusCircle size="1.5em" className="ml-2" />
            </button>
          )}
          <button
            onClick={() => onDelete(item._id)}
            className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaTrash size="1.5em" />
          </button>
          <button
            onClick={() => onToggleFavorite(item)}
            className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            {item.favorite ? (
              <FaHeart size="1.5em" />
            ) : (
              <FaRegHeart size="1.5em" />
            )}
          </button>
        </div>
      </div>
      <div className="w-full lg:w-2/5 mt-4 lg:mt-0 lg:order-first lg:pl-6 mx-1">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="object-contain h-40 w-40 lg:h-60 lg:w-60 rounded-lg shadow-lg mx-auto"
          />
        )}
      </div>
    </div>
  );
};

export default ItemCard;

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
