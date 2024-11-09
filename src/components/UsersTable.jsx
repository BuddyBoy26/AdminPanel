// src/components/UsersTable.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const UsersTable = ({
  users,
  columns,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const navigate = useNavigate();

  const handleViewUser = (id) => {
    navigate(`/user/${id}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-[#493939] rounded-lg">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="py-2 px-4 bg-[#FF9321] text-white text-left text-sm uppercase font-semibold"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t border-[#FF9321]">
              <td className="py-2 px-4 text-white">{user.userId}</td>
              <td className="py-2 px-4 text-white">{user.name}</td>
              <td className="py-2 px-4 text-white">{user.email}</td>
              <td className="py-2 px-4 text-white">
                {user.isProfileComplete ? "Active" : "Inactive"}
              </td>
              <td className="py-2 px-4 text-white">
                <button
                  onClick={() => navigate(`/user/${user._id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md ${
            currentPage === 1
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#FF9321] hover:bg-[#FF9933] text-white"
          }`}
        >
          Previous
        </button>
        <span className="text-white px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md ${
            currentPage === totalPages
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#FF9321] hover:bg-[#FF9933] text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersTable;
