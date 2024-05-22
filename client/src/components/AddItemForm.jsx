import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/api";
import Swal from "sweetalert2";

const AddItemForm = ({ token }) => {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: 0,
    image: null,
    imagePreview: null,
    contributionFrequency: "daily",
    numberOfPayments: 1,
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
      imagePreview: URL.createObjectURL(file),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
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
    data.append("contributionFrequency", formData.contributionFrequency);
    data.append("numberOfPayments", formData.numberOfPayments);
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
      const response = await axios.post(`${BASE_URL}/api/item/create`, data, {
        headers: { Authorization: `Bearer ${token}` },
        "Content-Type": "multipart/form-data",
      });

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      });

      setSuccessMessage(response.data.message);
      setFormData({
        name: "",
        targetAmount: "",
        image: null,
        imagePreview: null,
        contributionFrequency: "daily",
        numberOfPayments: 1,
      });
      setFormErrors({});
    } catch (error) {
      // Show error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response
          ? error.response.data.message
          : "An error occurred. Please try again.",
      });

      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <form
        onSubmit={handleSubmit}
        className="mt-4 p-6  flex flex-col lg:flex-row"
      >
        <div className="lg:w-3/5 lg:pr-6">
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
              onChange={handleImageChange}
              className="mt-1 block w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300"
            />
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
          <div className="mb-4">
            <label
              htmlFor="numberOfPayments"
              className="block text-gray-700 dark:text-gray-300"
            >
              Number of Payment Terms:
            </label>
            <input
              type="number"
              name="numberOfPayments"
              value={formData.numberOfPayments}
              onChange={handleChange}
              placeholder="Number of Payment Terms"
              className={`mt-1 block w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 ${
                formErrors.numberOfPayments
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
            {formErrors.numberOfPayments && (
              <div className="text-red-500 mt-1">
                {formErrors.numberOfPayments}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md shadow hover:bg-blue-600 transition duration-300"
          >
            Add Item
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
      {successMessage && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
          role="alert"
        >
          <p>{successMessage}</p>
        </div>
      )}
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

export default AddItemForm;
