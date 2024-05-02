import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.firstName.trim()) {
      validationErrors.firstName = "First Name is required";
    }
    if (!formData.lastName.trim()) {
      validationErrors.lastName = "Last Name is required";
    }
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    }
    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    }
    if (!formData.confirmPassword.trim()) {
      validationErrors.confirmPassword = "Please repeat password";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (formData.confirmPassword !== formData.password) {
      validationErrors.confirmPassword =
        "Repeat Password should be same as Password";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setLoading(false);
      console.log("User registered successfully:", data);
    } catch (error) {
      setLoading(false);
      console.error("Error registering user:", error.message);
    }
  };
  return (
    <div className="flex flex-col md:flex-row h-full grow">
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://img.freepik.com/free-vector/vector-abstract-wavy-patterned-blue-background_53876-172726.jpg?t=st=1714258206~exp=1714261806~hmac=21dbd27dbab5e368eadb6bd894a905a3ed90606c37b62702ad765ea8a8a455e5&w=740')`,
        }}
      >
        <div className="flex flex-col gap-2 items-center justify-center h-full px-4 py-4">
          <p className="text-white text-center text-lg lg:text-2xl font-semibold">
            Looking to save for those coveted items?
          </p>
          <h1 className="text-white text-center text-2xl lg:text-5xl font-bold mt-4">
            SAVE UP
          </h1>
          <p className="text-white text-center lg:text-xl">
            makes it effortless. Set personalized savings goals,
          </p>
          <p className="text-white text-center lg:text-xl">
            track your progress, and celebrate milestones along the way.
          </p>
          <p className="text-white text-center lg:text-xl">
            Turn your wishlist into reality with ease.
          </p>
        </div>
      </div>
      <div className="md:w-1/2 grow bg-gray-100 flex flex-col justify-center">
        <div className="mx-auto max-w-md px-4 py-8 bg-white shadow-md rounded">
          <h2 className="text-2xl font-bold mb-4">Create new account</h2>
          <p className="text-gray-600 mb-4">
            Join our platform by creating a new account for exclusive access
          </p>
          <div className="flex flex-col gap-4">
            <button className="bg-white hover:bg-slate-100 text-gray-800 border-gray-800 border  py-2 rounded flex justify-center items-center gap-2">
              <FcGoogle />
              Signup with Google
            </button>
            <button className="bg-gray-800 hover:bg-gray-900 text-white border-gray-800 py-2 rounded flex justify-center items-center gap-2">
              <FaApple />
              Signup with Apple
            </button>
            <p className="text-gray-800 text-sm">or</p>
            <p className="text-gray-800">Register with Email</p>
          </div>
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grids-cols-2 gap-4">
              <div className="w-full">
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  className={`w-full border border-gray-300 ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  } p-2 rounded-md outline-none focus:border-blue-500`}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 text-left mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  className={`w-full border border-gray-300 ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  } p-2 rounded-md outline-none focus:border-blue-500`}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 text-left mt-1">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div className="w-full">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  className={`w-full border border-gray-300 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } p-2 rounded-md outline-none focus:border-blue-500`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 text-left mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="w-full">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  className={`w-full border border-gray-300 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } p-2 rounded-md outline-none focus:border-blue-500`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 text-left mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
              <div className="w-full">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  className={`w-full border border-gray-300 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } p-2 rounded-md outline-none focus:border-blue-500`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 text-left mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className={`${
                  loading ? "bg-blue-300 " : "bg-blue-500 "
                } text-white mt-4 py-2 rounded w-full`}
                disabled={loading}
              >
                Create Account
              </button>
            </div>
          </form>
          <p className="text-gray-600 text-center mt-4">
            Already a member?{" "}
            <a href="/login" className="text-blue-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
