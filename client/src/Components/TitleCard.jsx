import React, { useState } from "react";
import { IoWalletOutline, IoSearchOutline } from "react-icons/io5";

function TitleCard() {
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleSearchClick = () => {
    setShowSearchModal(true);
  };

  const handleAddSavingClick = () => {
 
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-t-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center mb-4 md:mb-0">
        <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mr-4">
          <IoWalletOutline className="text-white text-3xl" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
            Savings
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Plan and save for products
          </p>
        </div>
      </div>

      <div className="flex gap-2 items-center justify-between md:justify-end w-full md:w-auto">
        <div className="relative flex items-center z-30">
          <input
            type="text"
            placeholder="Search..."
            className="hidden md:block px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            className="text-gray-500 md:hidden focus:outline-none ml-2"
            onClick={handleSearchClick}
          >
            <IoSearchOutline className="text-xl" />
          </button>
        </div>


        <button
          className="hidden md:block px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none"
          onClick={handleSearchClick}
        >
          Search
        </button>


        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none ml-4 md:ml-0"
          onClick={handleAddSavingClick}
        >
          Add Saving
        </button>
      </div>

      {showSearchModal && (
        <div className="fixed z-30 inset-0 flex items-start py-10 justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-4 w-[90%]">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              className="block w-full px-4 py-2 mt-4 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none"
              onClick={() => setShowSearchModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TitleCard;
