// src/components/Admins.jsx

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import AdminsTable from "./AdminsTable.jsx"; // Ensure correct path
import axios from "../api/axios.js";
import { toast } from "react-toastify";
import { AdminContext } from "../contexts/AdminContext.jsx"; // Ensure this path is correct
import TheTable from "./TheTable.jsx";

const Admins = () => {
  const navigate = useNavigate();
  const { token } = useContext(AdminContext); // Access admin token

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [totalPages, setTotalPages] = useState(1);

  // Define column headers, including "Contract"
  const columns = [
    { header: "Admin ID", accessor: "adminId" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
  ];

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/admins", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Check if response data exists and has admins
        if (response.data && response.data.admins) {
          // // Flatten the admins data
          // const flatAdmins = response.data.admins.map((admin) => ({
          //   _id: admin._id,
          //   investmentId: admin.investment.investmentId,
          //   numberPlate: admin.NumberPlate,
          //   type: admin.Type,
          //   brand: admin.Brand,
          //   model: admin.Model,
          //   investor: admin.investment.investor.name,
          // }));
          console.log("admins:", response.data.admins)
          setAdmins(response.data.admins);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setAdmins([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast.error("Failed to fetch admins.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [currentPage, token]);

  console.log(admins)

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      {/* Header */}
      <div className="relative flex flex-col sm:flex-row justify-center items-center w-full px-6 py-4 mt-5">
        {/* Admins Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#FF9321]">
          Admins
        </h1>
        
        {/* Create Admin Button */}
        {/* <button
          onClick={handleCreateAdminClick}
          className="mt-4 sm:mt-0 sm:absolute sm:right-10 px-5 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
          aria-label="Create a new admin"
        >
          Create Admin
        </button> */}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center mt-10 text-white">
          Loading admins...
        </div>
      ) : (
        <>
          {/* Admins Table */}
          {admins.length > 0 ? (
            <TheTable
              data={admins}
              columns={columns}
              // link="/admin/" // Base link for navigation
              // clickable={true}
            />
          ) : (
            <div className="flex justify-center items-center mt-10 text-white">
              No admins found.
            </div>
          )}

          {/* Pagination Controls */}
          {/* <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === 1
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#FF9321] text-white hover:bg-[#e07a1f]"
              }`}
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
            >
              Next
            </button>
          </div> */}
        </>
      )}
    </div>
  );
};

export default Admins;
