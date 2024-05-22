import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataCard from "../components/DataCard";
import ItemList from "../components/ItemList";
import AddItemForm from "../components/AddItemForm";
import Modal from "../components/Modal";
import { AiOutlineOrderedList } from "react-icons/ai";
import { FaPiggyBank, FaBullseye, FaCalendarAlt } from "react-icons/fa";
import { BASE_URL } from "../constants/api";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import AreaTop from "../components/AreaTop";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("saving_up_token");

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
      title: "Upcoming Contributions",
      icon: FaCalendarAlt,
      data: "0",
      color: "#fff563",
    },
  ]);

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

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
        setFilteredItems(data); // Initialize filtered items with all items
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
  }, [token, navigate]);

  useEffect(() => {
    // Update filteredItems based on search query
    setFilteredItems(
      items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, items]);

  const calculateTotals = (items) => {
    const totalSaved = items.reduce(
      (acc, item) => acc + item.contributedAmount,
      0
    );
    const totalTarget = items.reduce((acc, item) => acc + item.targetAmount, 0);
    setData((prevData) => [
      { ...prevData[0], data: items.length },
      { ...prevData[1], data: `$${totalSaved}` },
      { ...prevData[2], data: `$${totalTarget}` },
      { ...prevData[3], data: `$${10000 - totalSaved}` },
    ]);
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/item/${id}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedItems = items.filter((item) => item._id !== id);
      setItems(updatedItems);
      setFilteredItems(updatedItems);
      calculateTotals(updatedItems);
    } catch (error) {
      console.error("Error deleting item:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("saving_up_token");
        navigate("/login");
      }
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
      setFilteredItems(updatedItems);
      calculateTotals(updatedItems);
    } catch (error) {
      console.error("Error contributing to item:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("saving_up_token");
        navigate("/login");
      }
    }
  };

  return (
    <>
      <AreaTop title={"Dashboard"} />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
          {data.map((item, index) => (
            <div data-aos="fade-down" key={index}>
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
            data-aos="fade-up"
          />
        </div>
        <button
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 ease-in-out"
          onClick={() => setShowModal(true)}
          data-aos="fade-up"
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
        <div data-aos="fade-up">
          <ItemList
            items={filteredItems}
            onDelete={handleDeleteItem}
            onContribute={handleContribute}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
