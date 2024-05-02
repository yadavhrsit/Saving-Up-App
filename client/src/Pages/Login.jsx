import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    }
    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        throw new Error(data.message || "Failed to login");
      }
      console.log("User logged in successfully:", data);
    } catch (error) {
      setLoading(false);
      setLoginError(error.message);
      console.error("Error logging in:", error.message);
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
            Welcome back!
          </p>
          <h1 className="text-white text-center text-2xl lg:text-5xl font-bold mt-4">
            LOGIN
          </h1>
          <p className="text-white text-center lg:text-xl">
            Access your account to continue saving up for your desired products.
          </p>
        </div>
      </div>
      <div className="md:w-1/2 grow bg-gray-100 flex flex-col justify-center">
        <div className="mx-auto max-w-md px-4 py-8 bg-white shadow-md rounded">
          <h2 className="text-2xl font-bold mb-4">Log in to your account</h2>
          <p className="text-gray-600 mb-4">
            Access your account and continue your journey
          </p>
          <div className="flex flex-col gap-4">
            <button className="bg-white hover:bg-slate-100 text-gray-800 border-gray-800 border  py-2 rounded flex justify-center items-center gap-2">
              <FcGoogle />
              Login with Google
            </button>
            <button className="bg-gray-800 hover:bg-gray-900 text-white border-gray-800 py-2 rounded flex justify-center items-center gap-2">
              <FaApple />
              Login with Apple
            </button>
            <p className="text-gray-800 text-sm">or</p>
            <p className="text-gray-800">Log in with Email</p>
          </div>
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className={`w-full border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-sm text-left text-red-500 mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>

              <input
                type="password"
                placeholder="Password"
                className={`w-full border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500 ${
                  errors.password ? "border-red-500" : ""
                }`}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-sm text-left text-red-500 mt-1">{errors.password}</p>
              )}
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white mt-4 py-2 rounded w-full"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
              {loginError && (
                <p className="text-sm text-red-500">{loginError}</p>
              )}
            </div>
          </form>
          <p className="text-gray-600 text-center mt-4">
            New user?{" "}
            <a href="/signup" className="text-blue-500">
              Sign up
            </a>
          </p>
          <p className="text-gray-600 text-center mt-2">
            Forgot your password?{" "}
            <a href="/forgot-password" className="text-blue-500">
              Reset it
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
