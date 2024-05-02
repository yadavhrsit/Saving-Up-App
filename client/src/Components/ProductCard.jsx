import React, { useState } from "react";
import { BsPinAngleFill, BsPinFill } from "react-icons/bs";

function ProductCard({ imgUrl, title, description, id, total, amount }) {
  const [pinned, setPinned] = useState(false);

  const handlePinToggle = () => {
    setPinned(!pinned);
  };

  const percentPaid = (amount / total) * 100;

  return (
    <div
      className={`relative w-full max-w-lg rounded-lg overflow-hidden shadow-lg bg-white text-gray-800 border border-gray-300 transition duration-300 ease-in-out transform hover:shadow-xl`}
    >
      <div className="relative">
        <img
          src={imgUrl}
          alt="Shoes"
          className="w-full h-56 object-cover object-center"
        />
        <div className="absolute top-2 right-2" onClick={handlePinToggle}>
          {pinned ? (
            <BsPinAngleFill className="text-gray-600 text-lg" />
          ) : (
            <BsPinFill className="text-gray-600 text-lg" />
          )}
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm mb-4">{description}</p>
        <div className="flex justify-center xl:justify-between items-center flex-wrap gap-2">
          <button className="px-3 py-2 bg-gray-800 text-white rounded-lg font-semibold text-sm shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out">
            Pay Installment
          </button>
          <div className="flex items-center gap-1">
            <div className="flex flex-col justify-center mr-2">
              <span className="text-xs text-gray-600">Paid:</span>
              <span className="text-xs font-semibold">{amount}</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xs text-gray-600">Remaining:</span>
              <span className="text-xs font-semibold">{total - amount}</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xs text-gray-600">Total:</span>
              <span className="text-xs font-semibold">{total}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 py-1 px-4 rounded-b-md">
        <div className="h-2 w-full rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-blue-500"
            style={{ width: `${percentPaid}%`, transition: "width 0.5s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
