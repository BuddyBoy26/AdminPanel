// src/userAuth/Logout.jsx

import React, { useEffect, useContext } from "react";
import { AdminContext } from "../contexts/AdminContext.jsx"; // Updated to AdminContext
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logout } = useContext(AdminContext); // Use AdminContext
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return null; // Since we're redirecting, no UI is needed
};

export default Logout;
