// src/components/EnterOtp.jsx

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from '../api/axios'; // Ensure axios is correctly configured

const EnterOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, '');
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input
    if (index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    console.log('Entered OTP:', enteredOtp);

    try {
      // Replace with your actual API endpoint for OTP verification
      const response = await axios.post('/api/verify-otp', { otp: enteredOtp });

      if (response.status === 200) {
        toast.success("OTP Verified Successfully!");
        navigate('/otp-success');
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to verify OTP. Please try again."
      );
    }
  };

  const resendOtp = async () => {
    try {
      // Replace with your actual API endpoint for resending OTP
      const response = await axios.post('/api/resend-otp');

      if (response.status === 200) {
        toast.success("OTP Resent Successfully!");
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to resend OTP. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#322323] px-4 py-8 sm:py-16">
      <div className="max-w-md w-full bg-[#493939] rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#FF9321]">Enter OTP</h2>
          <p className="mt-2 text-gray-300">
            Please enter the 4-digit OTP sent to your registered mobile number.
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-4 justify-center">
            {otp.map((data, index) => (
              <OtpInput
                key={index}
                index={index}
                value={otp[index]}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
                inputRef={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          <div>
            <FormButton type="submit" value="Verify OTP ➤" />
          </div>
        </form>

        {/* Resend OTP */}
        <div className="text-center mt-4">
          <button
            onClick={resendOtp}
            className="text-[#FF9321] hover:text-[#e6811e] font-semibold"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

const OtpInput = ({ index, value, handleChange, handleKeyDown, inputRef }) => (
  <input
    type="text"
    inputMode="numeric"
    maxLength="1"
    value={value}
    onChange={(e) => handleChange(e.target, index)}
    onKeyDown={(e) => handleKeyDown(e, index)}
    ref={inputRef}
    className="w-16 h-16 text-2xl text-center text-white bg-[#322323] border border-[#FF9321] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9321] transition-colors"
    aria-label={`OTP Digit ${index + 1}`}
    required
  />
);

const FormButton = ({ type, value }) => (
  <button
    type={type}
    className="w-full px-4 py-3 bg-[#FF9321] hover:bg-[#e6811e] text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9321] transition-colors"
  >
    {value}
  </button>
);

export default EnterOtp;
