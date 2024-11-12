// src/components/Users.jsx

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UsersTable from "./UsersTable";
import axios from "../api/axios.js"; // Use the custom Axios instance
import { AdminContext } from "../contexts/AdminContext.jsx"; // Use AdminContext
import { toast } from "react-toastify";

const Users = () => {
  const navigate = useNavigate();
  const { admin, token } = useContext(AdminContext); // Access authenticated admin user

  const [users, setUsers] = useState([]);

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

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users");
        console.log("Users:", response.data);
        setUsers(response.data);

        // If you have pagination info from the response, set totalPages here
        // For example:
        // setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching incomplete users:", error);
        toast.error("Failed to fetch users to be verified.");
      }
    };

    fetchUsers();
  }, []); // Runs once on mount

  // Compute statistics whenever 'users' changes
  useEffect(() => {
    computeStats(users);
    console.log("Updated Stats:", stats);
  }, [users]); // Runs whenever 'users' changes

  const computeStats = (users) => {
    const total = users.length;
    const active = users.filter((u) => u.isProfileComplete === true).length;
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
      // Optionally, fetch users for the new page if using server-side pagination
    }
  };

  // Handle search input change (Optional)
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
    // Optionally, implement search functionality here
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
          <StatCard title="Verified Users" value={stats.activeUsers} />
          <StatCard title="Unverified Users" value={stats.inactiveUsers} />
        </div>

        {/* Users Table Section */}
        <UsersTable
          users={users}
          columns={columns}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
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
