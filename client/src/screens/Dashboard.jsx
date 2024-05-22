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
import swal from "sweetalert2";
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
      color: "#ff0000",
    },
  ]);

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
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
      const { data } = await swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            await axios.delete(`${BASE_URL}/api/item/${id}/delete`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const updatedItems = items.filter((item) => item._id !== id);
            setItems(updatedItems);
            calculateTotals(updatedItems);
            return true;
          } catch (error) {
            console.error("Error deleting item:", error);
            if (error.response && error.response.status === 401) {
              localStorage.removeItem("saving_up_token");
              navigate("/login");
            }
            throw new Error(error);
          }
        },
        allowOutsideClick: () => !swal.isLoading(),
      });

      if (data) {
        swal.fire("Deleted!", "Your item has been deleted.", "success");
      }
    } catch (error) {
      swal.fire("Error!", "An error occurred. Please try again.", "error");
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
      swal.fire("Success!", "Contribution added successfully.", "success");
    } catch (error) {
      console.error("Error contributing to item:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("saving_up_token");
        navigate("/login");
      }
      swal.fire("Error!",error.response.data.error || "An error occurred. Please try again.", "error");
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
      swal.fire(
        "Success!",
        `${item.favorite ? "Removed from" : "Added to"} favorites.`,
        "success"
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("saving_up_token");
        navigate("/login");
      }
      swal.fire("Error!", "An error occurred. Please try again.", "error");
    }
  };

  return (
    <div className="container mx-auto px-4">
      <AreaTop title={"Dashboard"} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        {data.map((item, index) => (
          <div data-aos="fade-up" key={index}>
            <DataCard
              title={item.title}
              icon={item.icon}
              data={item.data}
              color={item.color}
            />
          </div>
        ))}
      </div>
      <div className="mt-4" data-aos="fade-down">
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
        <div data-aos="fade-right">
          <h2 className="text-lg font-semibold mb-2">Favorites</h2>
          {favorites.length > 0 ? (
            <ItemList
              items={favorites}
              onDelete={handleDeleteItem}
              onContribute={handleContribute}
              onToggleFavorite={toggleFavorite}
            />
          ) : (
            <p className="text-gray-500">No favorite items found</p>
          )}
        </div>
        {filteredItems.length > 0 && (
          <div data-aos="fade-left">
            <h2 className="text-lg font-semibold mb-2">Other Items</h2>
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
