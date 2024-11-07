// src/api/axios.js

import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://api-bhs.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token in headers if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken"); // Updated token key
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor to handle global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific status codes if needed
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, possibly redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
