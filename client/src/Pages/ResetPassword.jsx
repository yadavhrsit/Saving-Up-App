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
      // Example: await resetPassword(token, password);
      setSuccess(true);
    } catch (errors) {
      setErrors(errors.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
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
                  className={`w-full mt-1 p-2 border rounded-md ${
                    errors.password ? "border-red-500" : ""
                  }`}
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
                  className={`w-full mt-1 p-2 border rounded-md ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
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
  );
}

export default ResetPassword;
