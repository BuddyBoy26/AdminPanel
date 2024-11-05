// src/userAuth/Logout.jsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ setIsUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminData");
    setIsUser(false);
    navigate("/login", { replace: true });
  }, [navigate, setIsUser]);

  return null; // Optionally, you can show a loading indicator
};

export default Logout;
