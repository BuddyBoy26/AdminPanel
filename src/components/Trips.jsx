// src/components/Trips.jsx

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TripsTable from "./TripsTable";
import axios from "../api/axios.js";
import { toast } from 'react-toastify';
import { AdminContext } from "../contexts/AdminContext.jsx"; // Import AdminContext

const Trips = () => {
  const navigate = useNavigate();
  const { admin, token } = useContext(AdminContext); // Access admin and token if needed

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [totalPages, setTotalPages] = useState(1);

  const col = [
    "Number Plate",
    "To",
    "From",
    "Start Date",
    "End Date",
  ];

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get("/trips", {
          params: {
            page: currentPage,
            limit: 20, // Adjust as needed
            search: "", // Implement search functionality as needed
          },
        });
        setTrips(response.data.trips);
        setTotalPages(response.data.pages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trips:", error);
        toast.error("Failed to fetch trips.");
        setLoading(false);
      }
    };

    fetchTrips();
  }, [currentPage]);

  const handleCreateTripClick = () => {
    navigate("/create/trip");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      <div className="flex justify-center items-center w-full px-10 py-2 relative mt-5">
        <h1 className="text-4xl font-bold text-[#FF9321]">Trips</h1>
        <button
          onClick={handleCreateTripClick}
          className="absolute right-10 px-4 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white mr-48"
        >
          Create Trip
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center mt-10 text-white">
          Loading trips...
        </div>
      ) : (
        <>
          <TripsTable row={trips} col={col} small={false} link={"/trip/"} clickable={true} />
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

export default Trips;
