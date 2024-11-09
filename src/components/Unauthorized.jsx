// src/components/Unauthorized.jsx

import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#322323] text-white">
      <h1 className="text-4xl font-bold mb-4">403 - Unauthorized</h1>
      <p className="mb-4">You do not have permission to view this page.</p>
      <Link to="/dashboard" className="text-[#FF9321] underline">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
