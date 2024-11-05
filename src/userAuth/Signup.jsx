// src/userAuth/Signup.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    address: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      const response = await axios.post("/admin/signup", formData); // POST request to /api/admin/signup
      if (response.status === 201) {
        // Navigate to the signup success page
        navigate("/signedup");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        setError(error.response.data.message || "Signup failed.");
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
    <div className="bg-[#322323] min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#493939] shadow-2xl rounded-3xl p-8 w-full max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center"
      >
        {/* Left Section */}
        <div className="w-full md:w-2/5 mb-8 md:mb-0 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white">Welcome to</h1>
            <h2 className="text-3xl font-semibold text-[#FF9321]">
              Bhavya Haulage Services
            </h2>
          </div>
          <img
            src="logo_bhavya.png"
            alt="Bhavya Haulage Services Logo"
            className="w-48 h-48 object-contain"
          />
        </div>

        {/* Right Section: Signup Form */}
        <div className="w-full md:w-3/5 md:pl-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#392929] p-8 rounded-2xl shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-6 text-center text-white">
              Admin's Signup
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border-2 border-[#FF9321] bg-white text-gray-700 focus:outline-none focus:border-[#FF9321] transition duration-200"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border-2 border-[#FF9321] bg-white text-gray-700 focus:outline-none focus:border-[#FF9321] transition duration-200"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Email ID Field */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Email ID
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border-2 border-[#FF9321] bg-white text-gray-700 focus:outline-none focus:border-[#FF9321] transition duration-200"
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
                  className="w-full px-4 py-2 rounded-xl border-2 border-[#FF9321] bg-white text-gray-700 focus:outline-none focus:border-[#FF9321] transition duration-200"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border-2 border-[#FF9321] bg-white text-gray-700 focus:outline-none focus:border-[#FF9321] transition duration-200"
                  placeholder="Enter your address"
                  required
                />
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-center">{error}</p>}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-[#FF9321] hover:bg-[#e6811e] text-white text-lg py-2 rounded-xl transition duration-300 mt-6"
              >
                Register ➤
              </motion.button>
            </form>

            {/* Footer Link */}
            <div className="text-center mt-6">
              <p className="text-gray-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#FF9321] hover:underline font-medium"
                >
                  Login here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
