// src/components/Trips.jsx

import React, { useEffect, useState, useContext, useMemo } from "react";
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
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [tripFilter, setTripFilter] = useState("All"); // State for trip filter

  // Define column headers
  const columns = [
    { header: "Number Plate", accessor: "NumberPlate" },
    { header: "To", accessor: "to" },
    { header: "From", accessor: "from" },
    { header: "Start Date", accessor: "startDate" },
    { header: "End Date", accessor: "endDate" },
    { header: "Action", accessor: "action" }, // Added Action column for navigation
  ];

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
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

  /**
   * Handle search input changes.
   * @param {string} term - The current search term entered by the user.
   */
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  /**
   * Handle filter button clicks.
   * @param {string} filter - The selected filter ("All", "Ongoing", "Completed").
   */
  const handleFilterChange = (filter) => {
    setTripFilter(filter);
  };

  /**
   * Determine if a trip is ongoing based on its endDate.
   * @param {Object} trip - The trip object.
   * @returns {boolean} - True if the trip is ongoing, else false.
   */
  const isOngoing = (trip) => {
    if (!trip.endDate) return true; // endDate is null
    const today = new Date();
    const endDate = new Date(trip.endDate);
    return endDate >= today;
  };

  /**
   * Filter trips based on search term and selected filter.
   * This uses useMemo for performance optimization.
   */
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // Apply filter based on tripFilter state
      if (tripFilter === "Ongoing" && !isOngoing(trip)) return false;
      if (tripFilter === "Completed" && isOngoing(trip)) return false;

      // Apply search filter
      if (searchTerm) {
        const lowerCaseTerm = searchTerm.toLowerCase();
        return Object.values(trip).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(lowerCaseTerm)
        );
      }

      return true; // If no search term, include the trip
    });
  }, [trips, searchTerm, tripFilter]);

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      {/* Header */}
      <div className="flex justify-center items-center w-full px-10 py-4 relative mt-5">
        <h1 className="text-4xl font-bold text-[#FF9321]">Trips</h1>
        <button
          onClick={handleCreateTripClick}
          className="absolute right-10 px-4 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white"
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
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row justify-between px-10 mb-4">
            {/* Search Bar */}
            <div className="mb-4 md:mb-0">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search trips..."
                className="p-2 border border-gray-300 rounded-md w-72"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              {["All", "Ongoing", "Completed"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`px-4 py-2 rounded-md border ${
                    tripFilter === filter
                      ? "bg-[#FF9321] text-white border-[#FF9321]"
                      : "bg-transparent text-white border-white hover:bg-[#FF9321] hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Trips Table */}
          {filteredTrips.length > 0 ? (
            <TripsTable
              data={filteredTrips}
              columns={columns}
              small={false}
              clickable={true}
            />
          ) : (
            <div className="flex justify-center items-center mt-10 text-white">
              No trips found.
            </div>
          )}

          {/* If pagination is implemented, include pagination controls here */}
        </>
      )}
    </div>
  );
};

export default Trips;
