// src/contexts/AdminContext.jsx

import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create AdminContext
export const AdminContext = createContext();

// AdminProvider Component
export const AdminProvider = ({ children }) => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(() => {
    const adminData = localStorage.getItem("admin");
    return adminData ? JSON.parse(adminData) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || null);

  // Login function
  const login = (token, adminData) => {
    setToken(token);
    setAdmin(adminData);
    localStorage.setItem("adminToken", token);
    localStorage.setItem("admin", JSON.stringify(adminData));
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  // Optional: Check token validity on mount
  useEffect(() => {
    // Implement token validation logic here if needed
  }, []);

  return (
    <AdminContext.Provider value={{ admin, token, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
