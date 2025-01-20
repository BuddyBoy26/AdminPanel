// src/components/Users.jsx

import React, { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import UsersTable from "./UsersTable"; // Ensure correct path
import axios from "../api/axios.js"; // Use the custom Axios instance
import { AdminContext } from "../contexts/AdminContext.jsx"; // Use AdminContext
import { toast } from "react-toastify";
import TheTable from "./TheTable.jsx";

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

  // Define column headers
  const columns = [
    { header: "Investor ID", accessor: "userId" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Status", accessor: "status" },
    // { header: "Actions", accessor: "actions" }, // Added Actions column
  ];

  // Fetch users when component mounts or when currentPage, tripFilter changes
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Check if token exists
        if (!token) {
          throw new Error("User not authenticated");
        }

        // Fetch users with pagination and filter
        const response = await axios.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: currentPage, search: searchQuery }, // Adjust based on API
        });

        // Check if response data exists and has users
        if (response.data && response.data.users) {
          const flatUsers = response.data.users.map((user) => ({
            _id: user._id,
            userId: user.userId,
            name: user.name,
            email: user.email,
            status: user.isProfileComplete ? "Active" : "Inactive",
          }));

          console.log("Users:", response.data.users);
          console.log("Flat Users:", flatUsers);
          setUsers(flatUsers);
          setTotalPages(response.data.totalPages || 1); // Assuming the API returns totalPages
        } else {
          setUsers([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users to be verified.");

        // Redirect to login if authentication fails
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, currentPage, searchQuery, navigate]);

  /**
   * Compute statistics based on users.
   * Utilizes useMemo for performance optimization.
   */
  const computeStats = (users) => {
    const total = users.length;
    const active = users.filter((u) => u.status === "Active").length;
    const inactive = total - active;
    return {
      totalUsers: total,
      activeUsers: active,
      inactiveUsers: inactive,
    };
  };

  // Compute statistics whenever 'users' changes
  const computedStats = useMemo(() => computeStats(users), [users]);

  // Update stats state when computedStats changes
  useEffect(() => {
    setStats(computedStats);
    console.log("Updated Stats:", computedStats);
  }, [computedStats]);

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

  // Handle user action (e.g., view details)
  const handleUserAction = (userId) => {
    navigate(`/users/${userId}`); // Ensure this route exists
  };

  const handleReport = async (users) => {
    try {
      // Dynamically construct the endpoint using unit type
      const endpoint = `/users/report/pdf`;

      const getFormattedDate = (date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().split("T")[0];
      };

      const startDate = getFormattedDate(new Date(new Date().setMonth(new Date().getMonth() - 1)));
      const endDate = getFormattedDate(new Date());

      const response = await axios.get(endpoint, {
        responseType: "blob", // Expecting a PDF blob
        params: {
          startDate: startDate,
          endDate: endDate
          // Include additional params if necessary, e.g., unitName
        },
      });

      console.log(response)
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Users_Report_${new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString()}_${new Date().toLocaleDateString()}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Unitwise PDF:", error);
      toast.error("Failed to download the Unitwise report.");
    }
    return; // Exit since Unitwise case has been handled
  };

  console.log("u:", users)
  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-screen pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#FF9321] mb-4 md:mb-0">
            Users Management
          </h1>
          <div className="flex space-x-4">
            {/* Search Input */}
            {/* <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search users..."
              className="px-4 py-2 rounded-md focus:outline-none bg-[#4A3A3A] text-white"
              aria-label="Search users"
            /> */}
        {/* Report */}
        <button
          onClick={handleReport}
          className="mt-4 sm:mt-0 sm:absolute sm:right-48 px-5 py-2 mx-20 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
          aria-label="Create a new asset"
        >
           Report
        </button>
            {/* Create User Button */}
            <button
              onClick={handleCreateUserClick}
              className="px-5 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#FF9321]"
              aria-label="Create a new user"
            >
              Create User
            </button>
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
          <div className="flex justify-center items-center mt-10 text-white">
            Loading users...
          </div>
        ) : (
          <>
            {users.length > 0 ? (
              <TheTable
                data={users}
                columns={columns}
                link="/user/"
                clickable={true}
              />
            ) : (
              <div className="flex justify-center items-center mt-10 text-white">
                No users found.
              </div>
            )}

            {/* Pagination Controls */}

              <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 mx-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-[#FF9321] text-white hover:bg-[#e07a1f]"
                  }`}
                  aria-label="Previous Page"
                >
                  Prev
                </button>
                <span className="px-3 py-1 text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 mx-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-[#FF9321] text-white hover:bg-[#e07a1f]"
                  }`}
                  aria-label="Next Page"
                >
                  Next
                </button>
              </div>
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
