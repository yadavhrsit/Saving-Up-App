import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { LIGHT_THEME } from "../constants/themeConstants";
import deposit from "../assets/icons/deposit.png";
import addItem from "../assets/icons/add-item.png";
import logo from "../assets/images/save-money.png";
import {
  MdOutlineClose,
  MdOutlineGridView,
  MdOutlineLogout,
  MdAdd,
  MdAttachMoney,
} from "react-icons/md";

import { FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { SidebarContext } from "../context/SidebarContext";
import Modal from "./Modal";
import AddItemForm from "./AddItemForm";
import axios from "axios";
import { BASE_URL } from "../constants/api";
import Swal from "sweetalert2";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const [funds, setFunds] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModalFunds, setShowModalFunds] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [totalTarget, setTotalTarget] = useState(0);
  const [user, setUser] = useState({});

  const token = localStorage.getItem("saving_up_token") || "";

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data;
        setUser(userData);
        setFunds(response.data.funds);
      } catch (error) {
        console.error(error);
      }
    };
    if (token!==""){
      fetchUserDetails();
    }
  }, [token]);

  const calculateTotals = (items) => {
    setTotalTarget(items.reduce((acc, item) => acc + item.targetAmount, 0));
  };

  // closing the navbar when clicked outside the sidebar area
  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-open-btn"
    ) {
      closeSidebar();
    }
  };

  async function addFundsHandler(e) {
    e.preventDefault();
    Swal.fire({
      title: "Info",
      text: `You are about to add $${
        e.target.funds.value
      } to your account. Proceed? New balance will be $${
        parseInt(e.target.funds.value) + parseInt(funds)
      }`,
      icon: "info",
      confirmButtonText: "OK",
    }).then(async(result) => {
      if (result.isConfirmed) {
       const response = await axios.put(
      `${BASE_URL}/api/user/profile/update`,
      { funds: parseInt(e.target.funds.value) + parseInt(funds) },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      Swal.fire({
        title: "Funds added successfully",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });  
    }
      }
    });
    
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <Link to={"/"} className="sidebar-brand">
          <img
            src={theme === LIGHT_THEME ? logo : logo}
            alt=""
            height={50}
            width={60}
          />
          <span className="sidebar-brand-text text-right">Saving Up</span>
        </Link>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <Link
                to="/dashboard"
                className={`menu-link ${
                  location.pathname.includes("dashboard") && "active"
                }`}
              >
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Dashboard</span>
              </Link>
            </li>
            <li className="menu-item">
              <button className="menu-link" onClick={() => setShowModal(true)}>
                <span className="menu-link-icon">
                  <img src={addItem} alt="deposit" height={18} width={18} />
                </span>
                <span className="menu-link-text">Add Item</span>
              </button>
            </li>
            <li className="menu-item">
              <button
                className="menu-link"
                onClick={() => setShowModalFunds(true)}
              >
                <span className="menu-link-icon">
                  <span className="flex items-center">
                    <img src={deposit} alt="deposit" height={18} width={18} />
                  </span>
                </span>
                <span className="menu-link-text">Add Funds</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              <Link
                to="/settings"
                className={`menu-link ${
                  location.pathname.includes("settings") && "active"
                }`}
              >
                <span className="menu-link-icon">
                  <FaUser size={20} />
                </span>
                <span className="menu-link-text">{user.username}</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineLogout size={20} />
                </span>
                <button
                  className="menu-link-text"
                  onClick={() => {
                    localStorage.removeItem("saving_up_token");
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </Link>
            </li>
          </ul>
        </div>
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <AddItemForm
            token={token}
            setItems={(newItems) => {
              setItems(newItems);
              setFilteredItems(newItems);
              calculateTotals(newItems);
            }}
          />
        </Modal>
        <Modal show={showModalFunds} onClose={() => setShowModalFunds(false)}>
          <form onSubmit={addFundsHandler}>
            <div className="form-group">
              <label htmlFor="funds" className="text-black dark:text-white">Amount</label>
              <input
                type="number"
                id="funds"
                name="funds"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4"
            >
              Add Funds
            </button>
          </form>
        </Modal>
      </div>
    </nav>
  );
};

export default Sidebar;
