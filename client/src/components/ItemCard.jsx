import React, { useEffect, useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  FaTrash,
  FaPlusCircle,
  FaStar,
  FaRegStar,
  FaEye,
  FaEdit,
} from "react-icons/fa";
import moment from "moment";
import { Link } from "react-router-dom";

const ItemType = "ITEM_CARD";

const ItemCard = ({
  item,
  moveCard,
  onDelete,
  onContribute,
  onToggleFavorite,
  setUpdateId,
  setShowModalEdit,
}) => {
  const ref = useRef(null);

  const handleContribute = () => {
    onContribute(item._id, item.contributionAmount);
  };

  const progressPercentage = Math.min(
    (item.contributedAmount / item.targetAmount) * 100,
    100
  );

  const [, drop] = useDrop({
    accept: ItemType,
    hover(draggedItem) {
      if (draggedItem._id !== item._id) {
        moveCard(draggedItem._id, item._id);
        draggedItem._id = item._id;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { type: ItemType, _id: item._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 lg:p-6 flex flex-col lg:flex-row justify-between items-center transition duration-300 ease-in-out transform hover:scale-105 cursor-grab"
    >
      <div className="flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-lg capitalize lg:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2 lg:mb-4">
            {item.name}
          </h3>
          <div className="mb-2 lg:mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Target:{" "}
            </span>
            <span className="text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200">
              ${item.targetAmount}
            </span>
          </div>
          <div className="mb-2 lg:mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Saved:{" "}
            </span>
            <span className="text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200">
              ${item.contributedAmount}
            </span>
          </div>
          <div className="mb-2 lg:mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Remaining:{" "}
            </span>
            <span className="text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200">
              ${item.remainingAmount}
            </span>
          </div>

          <div className="mb-2 lg:mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Next Payment Date:{" "}
            </span>
            <span className="text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200">
              {moment(item.nextPaymentDate).format("MMM Do YY")}
            </span>
          </div>
        </div>
        <div className="flex items-center w-full mb-2 lg:mb-4">
          <div className="w-full bg-gray-200 h-2 lg:h-3 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between mb-2 lg:mb-4">
          <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
            Progress
          </p>
          <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
            {progressPercentage.toFixed(2)}%
          </p>
        </div>
        <div className="flex space-x-2 lg:space-x-4">
          <button
            onClick={handleContribute}
            className="flex items-center text-nowrap justify-center px-3 lg:px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Pay Now <FaPlusCircle size="1.25em" className="ml-1 lg:ml-2" />
          </button>

          <button
            onClick={() => onDelete(item._id)}
            className="flex items-center justify-center px-3 lg:px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaTrash size="1.25em" />
          </button>
          <button
            onClick={() => {
              setUpdateId(item._id);
              setShowModalEdit(true);
            }}
            className="flex items-center justify-center px-3 lg:px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaEdit size="1.25em" />
          </button>
          <button
            onClick={() => onToggleFavorite(item)}
            className="flex items-center justify-center px-3 lg:px-4 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            {item.favorite ? (
              <FaStar size="1.25em" />
            ) : (
              <FaRegStar size="1.25em" />
            )}
          </button>
          <Link
            to={`/items/${item._id}`}
            className="flex items-center text-nowrap justify-center px-3 lg:px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            View <FaEye size="1.25em" className="ml-1 lg:ml-2" />
          </Link>
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
