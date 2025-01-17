// src/components/Trips.jsx

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TripsTable from "./TripsTable"; // Ensure correct path
import axios from "../api/axios.js";
import { toast } from "react-toastify";
import { AdminContext } from "../contexts/AdminContext.jsx"; // Ensure this path is correct
import TheTable from "./TheTable.jsx";

const Trips = () => {
  const navigate = useNavigate();
  const { admin, token } = useContext(AdminContext); // Access admin and token from context

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tripFilter, setTripFilter] = useState("All"); // State for trip filter

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Define column headers
  const columns = [
    { header: "Number Plate", accessor: "numberPlate" },
    { header: "To", accessor: "to" },
    { header: "From", accessor: "from" },
    { header: "Start Date", accessor: "startDate" },
    { header: "End Date", accessor: "endDate" },
    // { header: "Action", accessor: "action" }, // Uncomment if you add an Action column
  ];

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        // Use the token from AdminContext instead of localStorage
        if (!token) {
          throw new Error("User not authenticated");
        }

        // Determine filter parameter
        let filterParam = "";
        if (tripFilter === "Ongoing") {
          filterParam = "ongoing";
        } else if (tripFilter === "Completed") {
          filterParam = "completed";
        } else {
          filterParam = "all";
        }

        // Fetch trips with pagination and filter
        const response = await axios.get("/trips", {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: currentPage, filter: filterParam }, // Adjust based on API
        });

        // Check if response data exists and has trips
        if (response.data && response.data.trips) {
          const flatTrips = response.data.trips.map((trip) => ({
            _id: trip._id,
            numberPlate: trip.NumberPlate,
            to: trip.to,
            from: trip.from,
            startDate: trip.startDate
              ? new Date(trip.startDate).toLocaleDateString()
              : "N/A",
            endDate: trip.endDate
              ? new Date(trip.endDate).toLocaleDateString()
              : "N/A",
          }));
          console.log("trips", response.data.trips)
          console.log("trips2", flatTrips)
          setTrips(flatTrips);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setTrips([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
        // Optionally, display a toast notification
        toast.error("Failed to fetch trips. Please log in again.");

        // Redirect to login if authentication fails
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [token, currentPage, tripFilter, navigate]);

  const handleCreateTripClick = () => {
    navigate("/create/trip");
  };

  /**
   * Handle filter button clicks.
   * @param {string} filter - The selected filter ("All", "Ongoing", "Completed").
   */
  const handleFilterChange = (filter) => {
    setTripFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  /**
   * Handle pagination button clicks.
   * @param {number} pageNumber - The page number to navigate to.
   */
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-screen pb-2">
      {/* Header */}
      <div className="relative flex flex-col sm:flex-row justify-center items-center w-full px-6 py-4 mt-5">
        {/* Trips Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#FF9321]">
          Trips
        </h1>

        {/* Create Trip Button */}
        <button
          onClick={handleCreateTripClick}
          className="mt-4 sm:mt-0 sm:absolute sm:right-10 px-5 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
          aria-label="Create a new trip"
        >
          Create Trip
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center mt-10 text-white">
          Loading trips...
        </div>
      ) : (
        <>
          {/* Filter Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-center sm:justify-start gap-2">
              {["All", "Ongoing", "Completed"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`px-4 py-2 rounded-md border transition duration-200 
                    ${
                      tripFilter === filter
                        ? "bg-[#FF9321] text-white border-[#FF9321]"
                        : "bg-transparent text-white border-white hover:bg-[#FF9321] hover:text-white"
                    }`}
                  aria-pressed={tripFilter === filter}
                  aria-label={`Filter trips: ${filter}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Trips Table */}
          {trips.length > 0 ? (
            <TheTable
              data={trips}
              columns={columns}
              link="/trip/"
              clickable={true}
            />
          ) : (
            <div className="flex justify-center items-center mt-10 text-white">
              No trips found.
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
  );
};

export default Trips;