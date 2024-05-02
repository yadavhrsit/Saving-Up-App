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
      // sendResetPasswordEmail(email);
      setEmailSent(true);
    } catch (error) {
      setError(error.message);
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
            Recover password
          </p>

          <p className="text-white text-center lg:text-xl">
            Access your account to continue saving up for your desired products.
          </p>
        </div>
      </div>
      <div className="md:w-1/2 md:h-screen  h-full bg-gray-100 flex flex-col justify-center">
        <div className="mx-auto max-w-md lg:min-w-[50%] min-w-[90%] px-4 py-8 bg-white shadow-md rounded">
          {!emailSent && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800">
                Forgot Your Password?
              </h2>
              <p className="text-center lg:text-lg mb-6 mt-2">
                Enter your email to reset your password.
              </p>
            </>
          )}
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
                    className="block text-left text-gray-700 font-medium"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`w-full border border-gray-300 ${
                      error && !email.trim()
                        ? "border-red-500"
                        : "border-gray-300"
                    } p-2 rounded-md outline-none focus:border-blue-500 focus:border-2`}
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
                  {loading ? "Sending..." : "Send Reset Password Link"}
                </button>
                {error && email.trim() && (
                  <p className="text-red-500 mt-2">{error}</p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
