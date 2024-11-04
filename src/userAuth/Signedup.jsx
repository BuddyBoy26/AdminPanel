import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Signedup = () => {
  const navigate = useNavigate();

  const handleProceed = () => {
    // Navigate to the login page or dashboard
    navigate('/login'); // Change this path based on your routing setup
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#322323] px-4 py-8 sm:py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#493939] shadow-2xl rounded-3xl p-8 w-full max-w-md mx-auto flex flex-col items-center"
      >
        {/* Success Icon */}
        <SuccessIcon />

        {/* Success Message */}
        <div className="mt-6 text-center">
          <h2 className="text-3xl font-bold text-[#FF9321]">Signup Successful!</h2>
          <p className="mt-4 text-gray-300 text-lg">
            Thank you for signing up. The team will review your information and do the needful shortly.
          </p>
          <p className="mt-2 text-gray-300 text-lg">
            We appreciate your patience.
          </p>
        </div>

        {/* Proceed Button */}
        <div className="mt-8 w-full">
          <FormButton type="button" value="Proceed to Login ➤" onClick={handleProceed} />
        </div>
      </motion.div>
    </div>
  );
};

const SuccessIcon = () => (
  <div className="flex justify-center">
    <CheckCircle className="w-16 h-16 text-[#FF9321]" aria-hidden="true" />
  </div>
);

const FormButton = ({ type, value, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    type={type}
    onClick={onClick}
    className="w-full bg-[#FF9321] hover:bg-[#e6811e] text-white font-bold text-lg py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9321] focus:ring-offset-2 transition duration-300"
  >
    {value}
  </motion.button>
);

export default Signedup;
