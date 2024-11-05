// src/userAuth/Login.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

const Login = ({ setIsUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setError(""); // Reset error state

    try {
      const response = await axios.post("/admin/login", formData); // POST request to /api/admin/login
      if (response.status === 200) {
        const { token, admin } = response.data;
        // Store token and admin data in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("adminData", JSON.stringify(admin));
        setIsUser(true);
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        setError(error.response.data.message || "Login failed.");
      } else if (error.request) {
        // No response received
        setError("No response from server. Please try again later.");
      } else {
        // Other errors
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-2 py-4 lg:px-8 md:px-8 lg:py-8 md:py-8 bg-[#322323]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#493939] shadow-2xl rounded-3xl p-8 w-full max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center"
      >
        {/* Left Section */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white">Welcome to</h1>
          </div>
          <img
            src="logo_bhavya.png"
            alt="Bhavya Haulage Services Logo"
            className="w-48 h-48 object-contain"
          />
          <h2 className="text-3xl font-semibold text-[#FF9321] mt-4">
            Bhavya Haulage Services
          </h2>
        </div>

        {/* Right Section: Login Form */}
        <div className="w-full md:w-1/2 md:pl-8 flex justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#392929] p-8 rounded-2xl shadow-lg w-full max-w-md"
          >
            <h3 className="text-2xl font-bold mb-6 text-center text-white">
              Admin's Login
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Email ID
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border-2 border-white bg-white focus:outline-none focus:border-[#FF9321] transition duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border-2 border-white bg-white focus:outline-none focus:border-[#FF9321] transition duration-200"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-center">{error}</p>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-[#FF9321] text-white text-lg py-2 rounded-xl hover:bg-[#e6821e] transition duration-300 mt-6"
              >
                Login
              </motion.button>
            </form>

            {/* Footer Link */}
            <div className="text-center mt-6">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#FF9321] hover:underline font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
