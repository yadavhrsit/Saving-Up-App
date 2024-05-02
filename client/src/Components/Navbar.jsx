import React, { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex items-center justify-between bg-gradient-to-br from-blue-950 to-blue-900 p-4">
    
      <a href="#" className="text-white text-2xl font-bold">
        SaveUp
      </a>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="text-white rounded-full p-1 hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
          >
            <img
              className="h-8 w-8 rounded-full"
              src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              alt="Profile"
            />
          </button>
          {isOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg text-gray-800">
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Settings
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Logout
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
