import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OtpSuccess = () => {
  const navigate = useNavigate();

  const handleProceed = () => {
    // Navigate to the dashboard or home page
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#322323] px-4 py-8 sm:py-16">
      <div className="max-w-md w-full bg-[#493939] rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <SuccessIcon />

        {/* Success Message */}
        <div className="mt-6">
          <h2 className="text-3xl font-bold text-[#FF9321]">OTP Verified!</h2>
          <p className="mt-4 text-gray-300 text-lg">
            Your One-Time Password has been successfully verified.
          </p>
          <p className="mt-2 text-gray-300 text-lg">
            You can now access your dashboard and manage your investments.
          </p>
        </div>

        {/* Proceed Button */}
        <div className="mt-8">
          <FormButton type="button" value="Proceed to Dashboard ➤" onClick={handleProceed} />
        </div>
      </div>
    </div>
  );
};

const SuccessIcon = () => (
  <div className="flex justify-center">
    <CheckCircle className="w-16 h-16 text-[#FF9321]" />
  </div>
);

const FormButton = ({ type, value, onClick }) => (
  <button
    type={type}
    onClick={onClick}
    className="w-full px-4 py-3 bg-[#FF9321] hover:bg-[#e6811e] text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9321] focus:ring-offset-2 transition-colors"
  >
    {value}
  </button>
);

export default OtpSuccess;
