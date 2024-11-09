// src/components/Users.jsx

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UsersTable from "./UsersTable";
import axios from "../api/axios.js"; // Use the custom Axios instance
import { AdminContext } from "../contexts/AdminContext.jsx"; // Use AdminContext
import { toast } from "react-toastify";
import { CircularProgress } from "@material-ui/core";

const Users = () => {
  const navigate = useNavigate();
  const { admin, token } = useContext(AdminContext); // Access authenticated admin user

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });

  const [searchQuery, setSearchQuery] = useState(""); // For search functionality (Optional)

  // Columns to display in the UsersTable
  const columns = ["Investor ID", "Name", "Email", "Status", "Actions"];

  useEffect(() => {
    // Fetch incomplete users
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users");
        console.log("Users:", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching incomplete users:", error);
        toast.error("Failed to fetch users to be verified.");
      }
    };

    fetchUsers();
  }, []); // Runs once on mount

  // Function to compute user statistics
  const computeStats = (fetchedUsers) => {
    const total = fetchedUsers.length;
    const active = fetchedUsers.filter(
      (u) => u.isProfileComplete && !u.isDeleted
    ).length;
    const inactive = total - active;
    setStats({
      totalUsers: total,
      activeUsers: active,
      inactiveUsers: inactive,
    });
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle search input change (Optional)
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle Create User button click
  const handleCreateUserClick = () => {
    navigate("/create/user"); // Ensure this route exists
  };

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-screen pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#FF9321] mb-4 md:mb-0">
            Users Management
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={handleCreateUserClick}
              className="px-4 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white font-bold inline-flex items-center"
            >
              <svg
                className="fill-current w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
              </svg>
              <span>Create User</span>
            </button>
            {/* Optional: Add a search input */}
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search users..."
              className="px-4 py-2 rounded-md focus:outline-none bg-[#4A3A3A] text-white"
            />
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers} />
          <StatCard title="Active Users" value={stats.activeUsers} />
          <StatCard title="Inactive Users" value={stats.inactiveUsers} />
        </div>

        {/* Users Table Section */}
        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <CircularProgress />
          </div>
        ) : (
          <>
            <UsersTable
              users={users}
              columns={columns}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

// Component to display individual statistics
const StatCard = ({ title, value }) => (
  <div className="p-6 bg-[#493939] rounded-lg shadow-md">
    <h2 className="text-xl font-semibold text-white">{title}</h2>
    <p className="text-3xl font-bold text-[#FF9321]">{value}</p>
  </div>
);

export default Users;
