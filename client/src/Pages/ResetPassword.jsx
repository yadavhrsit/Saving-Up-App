// ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Code to verify token validity goes here
    // Example: verifyToken(token);
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      const validationErrors = {};
      setErrors(validationErrors);
      if (!formData.password.trim()) {
        validationErrors.password = "Password is required";
      }
      if (formData.password !== formData.confirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match";
      }
      if (!formData.confirmPassword.trim()) {
        validationErrors.confirmPassword = "Please repeat password";
      }
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setLoading(true);
      // Code to reset password goes here
      // await resetPassword(token, password);
      setSuccess(true);
    } catch (errors) {
      setErrors(errors.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div
        className="hidden md:block md:w-1/2 md:h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url('https://img.freepik.com/free-vector/vector-abstract-wavy-patterned-blue-background_53876-172726.jpg?t=st=1714258206~exp=1714261806~hmac=21dbd27dbab5e368eadb6bd894a905a3ed90606c37b62702ad765ea8a8a455e5&w=740')`,
        }}
      >
        <div className="flex flex-col gap-2 items-center justify-center h-full px-4 py-4">
          <p className="text-white text-center text-lg lg:text-2xl font-semibold">
            Welcome back!
          </p>
          <h1 className="text-white text-center text-2xl lg:text-5xl font-bold mt-4">
            Reset Password
          </h1>
          <p className="text-white text-center lg:text-xl">
            Access your account to continue saving up for your desired products.
          </p>
        </div>
      </div>
      <div className="md:w-1/2 md:h-screen  h-full bg-gray-100 flex flex-col justify-center">
        <div className="mx-auto max-w-md lg:min-w-[50%] min-w-[90%] px-4 py-8 bg-white shadow-md rounded">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Reset Your Password
        </h2>
        {success ? (
          <p className="text-green-600 mb-6">
            Your password has been successfully reset.
          </p>
        ) : (
          <>
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-left text-gray-700 font-medium"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`w-full border border-gray-300 ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  } p-2 rounded-md outline-none focus:border-blue-500`}
                  placeholder="Enter your new password"
                  value={formData.password}
                  onChange={handleChange}
                />

                {errors.password && (
                  <p className="text-left text-red-500 mt-2">
                    {errors.password}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-left text-gray-700 font-medium"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`w-full border border-gray-300 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } p-2 rounded-md outline-none focus:border-blue-500`}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <p className="text-left text-red-500 mt-2">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md transition duration-300 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </>
        )}
        </div>
      </div>
    </div>


    
  );
}

export default ResetPassword;
