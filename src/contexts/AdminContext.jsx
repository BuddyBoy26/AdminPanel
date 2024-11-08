// src/contexts/AdminContext.jsx

import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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


  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAssets: 0,
    totalTrips: 0,
    totalInvestments: 0,
    currentInvestmentValue: 0,
    investmentIncrease: 0,
  });

  // Login function
  const login = (token, adminData) => {
    console.log("Logging in with token:", token, "and admin data:", adminData);
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

      // Fetch dashboard stats
      const fetchDashboardStats = async () => {
        try {
          const response = await axios.get('/dashboard/stats');
          setStats(response.data);
          console.log(setStats)
        } catch (error) {
          console.error('Error fetching dashboard stats:', error);
        }
      };

  // Initialize data on component mount
  useEffect(() => {
    const initialize = async () => {
      if (token && admin) {
        await fetchDashboardStats();
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Re-run if token changes
 

  return (
    <AdminContext.Provider value={{ admin, token, login, logout,stats }}>
      {children}
    </AdminContext.Provider>
  );
};
