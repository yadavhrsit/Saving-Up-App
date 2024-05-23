import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataCard from "../components/DataCard";
import ItemList from "../components/ItemList";
import AddItemForm from "../components/AddItemForm";
import Modal from "../components/Modal";
import AreaTop from "../components/AreaTop";
import { AiOutlineOrderedList } from "react-icons/ai";
import { FaPiggyBank, FaBullseye } from "react-icons/fa";
import {
  FaMoneyBillWave,
  FaRegMoneyBillAlt,
} from "react-icons/fa";
import { BASE_URL } from "../constants/api";
import axios from "axios";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";


const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("saving_up_token");
  const [user, setUser] = useState({});
  const [totalTarget, setTotalTarget] = useState(0);
  const [data, setData] = useState([
    {
      title: "Total Savings Plans",
      icon: AiOutlineOrderedList,
      data: "0",
      color: "#23995e",
    },
    {
      title: "Total Saved Amount",
      icon: FaPiggyBank,
      data: "0",
      color: "#0932b0",
    },
    {
      title: "Total Target Amount",
      icon: FaBullseye,
      data: "0",
      color: "#ff0000",
    },
    {
      title: "Total Funds",
      icon: FaMoneyBillWave,
      data: 0,
      color: "#ff9900",
    },
    {
      title: "Unallocated Funds",
      icon: FaRegMoneyBillAlt,
      data: 0,
      color: "#800080",
    },
  ]);

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  

  useEffect(() => {
    setFilteredItems(
      items.filter(
        (item) =>
          !item.favorite &&
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFavorites(
      items.filter(
        (item) =>
          item.favorite &&
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, items]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchItems = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/item`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(data);
        calculateTotals(data);
      } catch (error) {
        console.error("Error fetching items:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("saving_up_token");
          navigate("/login");
        }
      }
    };
    fetchItems();

    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
        setData((prevData) => {
          let newData = [...prevData];
          newData[2] = { ...newData[2], data: `${data.totalAllocatedFunds}` };
          newData[3] = { ...newData[3], data: `${data.funds}` };
          newData[4] = {
            ...newData[4],
            data: `${data.funds - data.totalAllocatedFunds}`,
          };
          return newData;
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("saving_up_token");
          navigate("/login");
        }
      }
    };
    fetchUser();
  }, [token, navigate]);

  const calculateTotals = (items) => {
    const totalSaved = items.reduce(
      (acc, item) => acc + item.contributedAmount,
      0
    );
    setTotalTarget(items.reduce((acc, item) => acc + item.targetAmount, 0));
    setData((prevData) => {
      let newData = [...prevData]; // create a copy of the previous data
      newData[0] = { ...newData[0], data: items.length };
      newData[1] = { ...newData[1], data: `${totalSaved}` };
      return newData;
    });
  };

  const handleDeleteItem = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`${BASE_URL}/api/item/${id}/delete`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedItems = items.filter((item) => item._id !== id);
        setItems(updatedItems);
        calculateTotals(updatedItems);
        Swal.fire("Deleted!", "Your item has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("saving_up_token");
        navigate("/login");
      }
      Swal.fire("Error!", "There was an error deleting the item.", "error");
    }
  };

  const handleContribute = async (id, amount) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/item/${id}/contribute`,
        { amount: parseInt(amount) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedItems = items.map((item) => (item._id === id ? data : item));
      setItems(updatedItems);
      calculateTotals(updatedItems);
      Swal.fire("Success!", "Your contribution was successful.", "success");
    } catch (error) {
      console.error("Error contributing to item:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("saving_up_token");
        navigate("/login");
      }
      Swal.fire(
        "Error!",
        error.response.data.error ||
        "There was an error contributing to the item.",
        "error"
      );
    }
  };

  const toggleFavorite = async (item) => {
    try {
      const url = `${BASE_URL}/api/item/${item._id}/${
        item.favorite ? "unfavorite" : "favorite"
      }`;
      const { data } = await axios.put(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedItems = items.map((i) => (i._id === item._id ? data : i));
      setItems(updatedItems);
      calculateTotals(updatedItems);
      Swal.fire("Success!", "The item has been updated.", "success");
    } catch (error) {
      console.error("Error toggling favorite:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("saving_up_token");
        navigate("/login");
      }
      Swal.fire("Error!", "There was an error updating the item.", "error");
    }
  };

  return (
    <div className="container mx-auto px-4">
      <AreaTop title="Dashboard" />
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4"
        data-aos="fade-up"
      >
        {data.map((item, index) => (
          <div key={index}>
            <DataCard
              title={item.title}
              icon={item.icon}
              data={item.data}
              color={item.color}
            />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          className="mt-4 p-2 bg-blue-500 text-white rounded"
          onClick={() => setShowModal(true)}
        >
          Add New Item
        </button>
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
      </div>
      <div className="grid grid-cols-1 gap-4 mt-4">
        <div data-aos="fade-left">
          <h2 className="text-lg font-semibold mb-2 dark:text-white">
            Favorites
          </h2>
          {favorites.length > 0 ? (
            <ItemList
              items={favorites}
              onDelete={handleDeleteItem}
              onContribute={handleContribute}
              onToggleFavorite={toggleFavorite}
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-200">
              No favorite items found
            </p>
          )}
        </div>
        {filteredItems.length > 0 && (
          <div data-aos="fade-right">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">
              Other Items
            </h2>
            <ItemList
              items={filteredItems}
              onDelete={handleDeleteItem}
              onContribute={handleContribute}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
