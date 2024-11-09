// src/contexts/AdminContext.jsx

import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios.js"; // Use the custom Axios instance
import { toast } from "react-toastify";

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
    toast.success("Logged in successfully!");
    navigate("/dashboard"); // Redirect to dashboard upon successful login
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post("/admin/logout", {}, { // Ensure the backend handles logout at /admin/logout
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if logout fails, proceed to clear local data
    }
    setToken(null);
    setAdmin(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    toast.success("You have successfully logged out.");
    navigate("/login");
  };

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get("/dashboard/stats"); // Ensure your backend has this endpoint
      setStats(response.data);
      console.log("Dashboard stats fetched:", response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to fetch dashboard statistics.");
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
  }, [token]);

  return (
    <AdminContext.Provider
      value={{ admin, setAdmin, login, logout, stats, fetchDashboardStats, token }}
    >
      {children}
    </AdminContext.Provider>
  );
};
