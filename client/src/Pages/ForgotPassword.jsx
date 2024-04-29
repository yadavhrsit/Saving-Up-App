// ForgotPassword.jsx
import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email.trim()) {
        throw new Error("Email is required");
      }
      // Code to send reset password email goes here
      // Example: await sendResetPasswordEmail(email);
      setEmailSent(true);
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Forgot Your Password?
        </h2>
        {emailSent ? (
          <p className="text-gray-700 mb-6">
            An email with instructions has been sent to your email address.
          </p>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={`w-full mt-1 p-2 border rounded-md ${
                    error && !email.trim() ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleChange}
                  required
                />
                {error && !email.trim() && (
                  <p className="text-red-500 mt-2">{error}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md transition duration-300 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Password Email"}
              </button>
              {error && email.trim() && (
                <p className="text-red-500 mt-2">{error}</p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
