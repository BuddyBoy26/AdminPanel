import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Login = ({ isUser, setIsUser }) => {
  const navigate = useNavigate();
  const handleClick = (event) => {
    event.preventDefault(); // Prevent default form submission
    setIsUser(true);
    navigate("/", { replace: true });
  };
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-2 py-4 lg:px-8 md:px-8 lg:py-8 md:py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center"
      >
        <div className="w-full md:w-1/2 mb-8 md:mb-0 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Welcome to</h1>
            <h2 className="text-3xl font-semibold text-[#EBB251]">
              Bhavya Haulage Services
            </h2>
          </div>
          <img
            src="logo_bhavya.png"
            alt="Bhavya Haulage Services Logo"
            className="w-48 h-48 object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 md:pl-8 flex justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-50 p-8 rounded-2xl shadow-lg w-full max-w-md"
          >
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Investor's Login
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-black mb-1 pl-1 font-bold">
                  Email ID
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-xl border-2 border-white bg-white focus:outline-none focus:border-[#EBB251] transition duration-200"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-black mb-1 pl-1 font-bold">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-xl border-2 border-white bg-white focus:outline-none focus:border-[#EBB251] transition duration-200"
                  placeholder="Enter your password"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-[#EBB251] text-white text-lg py-2 rounded-xl hover:bg-[#EBB251] transition duration-300 mt-6"
                onClick={handleClick}
              >
                Login
              </motion.button>
            </form>
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-[#EBB251] hover:underline font-medium"
                >
                  Sign up here
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
