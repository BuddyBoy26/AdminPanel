// src/components/Trips.jsx

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TripsTable from "./TripsTable";
import axios from "../api/axios.js";
import { toast } from 'react-toastify';
import { AdminContext } from "../contexts/AdminContext.jsx"; // Import AdminContext

const Trips = () => {
  const navigate = useNavigate();
  const { admin, token } = useContext(AdminContext); // Access admin and token from context

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  // If pagination is not implemented on the backend, you can remove these states
  // const [currentPage, setCurrentPage] = useState(1); // For pagination
  // const [totalPages, setTotalPages] = useState(1);

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
        // Use the token from AdminContext instead of localStorage
        if (!token) {
          throw new Error('User not authenticated');
        }

        // Fetch trips
        const response = await axios.get('/trips', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrips(response.data);

        // If your backend supports pagination, you can set totalPages here
        // For example:
        // setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching trips:', error);
        // Optionally, display a toast notification
        toast.error('Failed to fetch trips. Please log in again.');

        // Redirect to login if authentication fails
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
    // If you remove pagination, you can adjust the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Depend on token instead of currentPage

  const handleCreateTripClick = () => {
    navigate("/create/trip");
  };

  // If pagination is not implemented, you can remove these handlers
  /*
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  */

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
          {/* If pagination is not implemented, you can remove this section */}
          {/*
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
          */}
        </>
      )}
    </div>
  );
};

export default Trips;
