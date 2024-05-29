import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const UpdateItemForm = ({ token,id }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: 0,
    url: "",
    image: null,
    imagePreview: null,
    contributionFrequency: "daily",
    numberOfPayments: 1,
    contributionDay: "",
    contributionDate: "",
    favorite: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/item/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const item = response.data.item;
        setFormData({
          ...item,
          imagePreview: `${item.image}`,
        });
      } catch (error) {
        setErrorMessage("Error fetching item data.");
      }
    };

    fetchItem();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid file type",
        text: "Only JPG, JPEG, and PNG files are allowed.",
      });
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      !formData.name ||
      !formData.targetAmount ||
      !formData.contributionFrequency ||
      !formData.numberOfPayments
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("targetAmount", parseInt(formData.targetAmount));
    data.append("url", formData.url);
    data.append("contributionFrequency", formData.contributionFrequency);
    data.append("numberOfPayments", formData.numberOfPayments);
    data.append("contributionDay", formData.contributionDay);
    data.append("contributionDate", formData.contributionDate);
    data.append("favorite", formData.favorite);
    if (formData.image) {
      data.append("image", formData.image);
    }

    // Show loading
    Swal.fire({
      title: "Please wait...",
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.put(
        `${BASE_URL}/api/item/${id}/update`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
          "Content-Type": "multipart/form-data",
        }
      );

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      }).then(() => {
        navigate("/items/"+id); // Redirect to the items list or another relevant page
      });
    } catch (error) {
      // Show error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response
          ? error.response.data.message
          : "An error occurred. Please try again.",
      });

      setErrorMessage(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <form
        onSubmit={handleSubmit}
        className="mt-4 p-6 flex flex-col lg:flex-row"
      >
        <div className="lg:w-3/5 lg:pr-6">
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">
              Update Item
            </h2>
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, favorite: !formData.favorite })
              }
              className={`ml-4 p-1 ${
                formData.favorite ? "text-yellow-500" : "text-gray-400"
              }`}
            >
              ★
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Item Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.name && (
              <div className="text-red-500 mt-1">{formErrors.name}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Item Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/jpeg, image/png"
              onChange={handleImageChange}
              className="mt-1 block w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Item URL
            </label>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 ${
                formErrors.url ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.url && (
              <div className="text-red-500 mt-1">{formErrors.url}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Target Amount
            </label>
            <input
              type="number"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 ${
                formErrors.targetAmount ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.targetAmount && (
              <div className="text-red-500 mt-1">{formErrors.targetAmount}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Contribution Frequency
            </label>
            <select
              name="contributionFrequency"
              value={formData.contributionFrequency}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          {formData.contributionFrequency === "weekly" && (
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">
                Contribution Day
              </label>
              <select
                name="contributionDay"
                value={formData.contributionDay}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300"
              >
                <option value="">Select Day</option>
                <option value="Sunday">Sunday</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>
            </div>
          )}
          {formData.contributionFrequency === "monthly" && (
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">
                Contribution Date
              </label>
              <select
                name="contributionDate"
                value={formData.contributionDate}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300"
              >
                <option value="">Select Date</option>
                {[...Array(28)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Number of Payments
            </label>
            <input
              type="number"
              name="numberOfPayments"
              value={formData.numberOfPayments}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 ${
                formErrors.numberOfPayments
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formErrors.numberOfPayments && (
              <div className="text-red-500 mt-1">
                {formErrors.numberOfPayments}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Update Item
          </button>
        </div>
        <div className="lg:w-2/5 flex items-center justify-center mt-4 lg:mt-0">
          {formData.imagePreview ? (
            <img
              src={formData.imagePreview}
              alt="Item Preview"
              className="object-cover h-40 w-40 lg:h-full lg:w-full rounded-lg shadow-lg"
            />
          ) : (
            <div className="h-40 w-40 lg:h-full lg:w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg shadow-lg">
              Image Preview
            </div>
          )}
        </div>
      </form>
      {errorMessage && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default UpdateItemForm;
