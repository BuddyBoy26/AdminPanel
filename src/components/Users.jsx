// src/components/Users.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersTable from "./UsersTable";
import axios from "../api/axios.js";
import { toast } from 'react-toastify';

const Users = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [totalPages, setTotalPages] = useState(1);

  const col = ["Investor ID", "Name", "Email"];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users", {
          params: {
            page: currentPage,
            limit: 20, // Adjust as needed
            search: "", // Implement search functionality as needed
          },
        });
        setUsers(response.data.users);
        setTotalPages(response.data.pages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleCreateUserClick = () => {
    navigate("/create/user");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      <div className="flex justify-center items-center w-full px-10 py-2 relative mt-5">
        <h1 className="text-4xl font-bold text-[#FF9321]">Users</h1>
        <button
          onClick={handleCreateUserClick}
          className="absolute right-10 px-4 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white mr-48"
        >
          Create User
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center mt-10 text-white">
          Loading users...
        </div>
      ) : (
        <>
          <UsersTable row={users} col={col} clickable={true} />
          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 mx-1 bg-[#FF9321] text-white rounded disabled:bg-gray-500"
            >
              Prev
            </button>
            <span className="px-3 py-1 text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 mx-1 bg-[#FF9321] text-white rounded disabled:bg-gray-500"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;
