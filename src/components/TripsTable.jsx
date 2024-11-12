// src/components/TripsTable.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const TripsTable = ({ data, columns, small = false, clickable = false }) => {
  const navigate = useNavigate();

  /**
   * Handle row click to navigate to trip details.
   * @param {Object} trip - The trip data for the clicked row.
   */
  const handleRowClick = (trip) => {
    if (clickable) {
      navigate(`/trip/${trip._id}`, { state: { tripData: trip } });
    }
  };

  /**
   * Render the table header.
   */
  const renderTableHeader = () => (
    <table className="w-full table-fixed text-sm">
      <thead className="bg-[#201010] text-[#FF9321]">
        <tr>
          {columns.map((col, index) => (
            <th
              key={index}
              className={`px-6 min-w-32 py-4 font-semibold text-center ${
                small ? "text-xs" : "text-base"
              }`}
            >
              {col.header}
            </th>
          ))}
          {clickable && <th className="w-10 text-black">Action</th>}
        </tr>
      </thead>
    </table>
  );

  /**
   * Render the table body with trips data.
   */
  const renderTableBody = () => (
    <table className="w-full table-fixed text-sm">
      <tbody>
        {data.map((trip, index) => (
          <tr
            key={trip._id || index}
            className={`border-b transition-colors border-[#6B5A5A] duration-200 ${
              index % 2 === 0 ? "bg-[#4B3F3F]" : "bg-[#5A4A4A]"
            } ${clickable ? "cursor-pointer hover:bg-[#707070]" : ""}`}
            onClick={() => handleRowClick(trip)}
          >
            <td className="min-w-32 text-center py-4 text-white">
              {trip.NumberPlate}
            </td>
            <td className="min-w-32 text-center py-4 text-white">
              {trip.to}
            </td>
            <td className="min-w-32 text-center py-4 text-white">
              {trip.from}
            </td>
            <td className="min-w-32 text-center py-4 text-white">
              {new Date(trip.startDate).toLocaleDateString()}
            </td>
            <td className="min-w-32 text-center py-4 text-white">
              {trip.endDate
                ? new Date(trip.endDate).toLocaleDateString()
                : "Ongoing"}
            </td>
            {clickable && (
              <td className="w-10 py-4 whitespace-nowrap text-right">
                <ChevronRight
                  className="inline-block text-gray-400"
                  size={20}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="container mx-auto px-4 py-8 w-5/6 max-h-[80vh]">
      {/* Trips Table */}
      <div className="shadow-2xl rounded-lg overflow-hidden border-b border-[#656565]">
        {/* Table Header */}
        <div className="overflow-x-auto bg-gray-800">
          {renderTableHeader()}
        </div>

        {/* Table Body */}
        <div className="max-h-[60vh] overflow-y-auto overflow-x-auto">
          {renderTableBody()}
        </div>
      </div>
    </div>
  );
};

export default TripsTable;
