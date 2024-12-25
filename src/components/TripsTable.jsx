// src/components/TripsTable.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import PropTypes from "prop-types";

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
  const renderTableHeader = () => {
    if (!columns || !Array.isArray(columns)) {
      console.error("TripsTable: 'columns' prop is missing or not an array.");
      return null;
    }

    return columns.map((col, index) => (
      <th
        key={index}
        className={`px-6 min-w-32 py-4 font-semibold text-center ${
          small ? "text-xs" : "text-base"
        }`}
      >
        {col.header}
      </th>
    ));
  };

  /**
   * Render the table body with trips data.
   */
  const renderTableBody = () => {
    if (!data || !Array.isArray(data)) {
      console.error("TripsTable: 'data' prop is missing or not an array.");
      return null;
    }

    return data.map((trip, index) => (
      <tr
        key={trip._id || index}
        className={`border-b transition-colors border-[#6B5A5A] duration-200 ${
          index % 2 === 0 ? "bg-[#4B3F3F]" : "bg-[#5A4A4A]"
        } ${clickable ? "cursor-pointer hover:bg-[#707070]" : ""}`}
        onClick={() => handleRowClick(trip)}
      >
        {columns.map((col, colIndex) => {
          let cellContent = trip[col.accessor];
          // Special handling for specific columns
          if (col.accessor === "startDate" || col.accessor === "endDate") {
            cellContent = trip[col.accessor]
              ? new Date(trip[col.accessor]).toLocaleDateString()
              : col.accessor === "endDate"
              ? "Ongoing"
              : "N/A";
          }
          // Add more conditions here if needed for other columns

          return (
            <td
              key={colIndex}
              className="py-4 px-6 text-center text-white"
            >
              {cellContent}
            </td>
          );
        })}
        {/* {clickable && (
          <td className="w-10 py-4 whitespace-nowrap text-right">
            <ChevronRight
              className="inline-block text-gray-400"
              size={20}
            />
          </td>
        )} */}
      </tr>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8 w-full max-h-[80vh] overflow-x-auto">
      {/* Trips Table */}
      <div className="shadow-2xl rounded-lg overflow-hidden border-b border-[#656565]">
        {/* Table Header */}
        <div
          className="overflow-x-auto bg-[#201010]"
          // pr-4 matches the padding in InvestmentsTable.jsx
        >
          <table className="w-full table-fixed text-sm">
            <thead className="bg-[#201010] text-[#FF9321]">
              <tr>
                {renderTableHeader()}
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body */}
        <div className="max-h-[60vh] overflow-y-auto overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <tbody>
              {renderTableBody()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Define PropTypes for better type checking
TripsTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
    })
  ).isRequired,
  small: PropTypes.bool,
  clickable: PropTypes.bool,
};

export default TripsTable;
