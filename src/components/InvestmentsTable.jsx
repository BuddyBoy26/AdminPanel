// src/components/InvestmentsTable.jsx

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowUp, ArrowDown } from "lucide-react"; // Import sort indicators
import PropTypes from "prop-types"; // For prop type checking

const InvestmentsTable = ({ data = [], columns, link, clickable = false, onRowClick }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: null, // Current sort key (accessor)
    direction: 'ascending', // 'ascending' or 'descending'
  });

  // Function to handle sorting when a header is clicked
  const handleSort = (accessor) => {
    if (sortConfig.key === accessor) {
      // If clicking the same column, toggle the sort direction
      setSortConfig({
        key: accessor,
        direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending',
      });
    } else {
      // If clicking a new column, set sort direction to ascending
      setSortConfig({
        key: accessor,
        direction: 'ascending',
      });
    }
  };

  const handleRowClick = (item) => {
    if (onRowClick) {
      onRowClick(item);
    } else if (clickable && link) {
      navigate(`${link}${item._id}`); // Assuming each item has a unique '_id'
    }
  };

  // Filter rows based on the search term while preserving the '_id' field
  const filteredRows = useMemo(() => {
    if (!searchTerm) return data;

    const lowerCaseTerm = searchTerm.toLowerCase();
    return data.filter((item) =>
      Object.entries(item)
        .filter(([key]) => key !== "_id") // Exclude '_id' from filtering
        .some(([_, value]) =>
          value
            ? value.toString().toLowerCase().includes(lowerCaseTerm)
            : false
        )
    );
  }, [data, searchTerm]);

  // Sort the filtered rows based on sortConfig
  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows;

    const sorted = [...filteredRows].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle different data types
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // If values are of different types or not string/number, convert to string and compare
      return sortConfig.direction === 'ascending'
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });

    return sorted;
  }, [filteredRows, sortConfig]);

  return (
    <div className="container mx-auto px-4 py-8 w-full overflow-x-auto">
      {/* Search Bar */}
      <div className="flex justify-start mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Investments..."
          className="p-2 border border-gray-300 rounded-md w-1/3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF9321]"
        />
      </div>
      <div className="shadow-2xl rounded-lg overflow-hidden border-b border-[#656565]">
        <table className="w-full table-fixed">
          <thead className="bg-[#201010] text-[#FF9321] sticky top-0 z-10">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 font-semibold text-left cursor-pointer select-none"
                  onClick={() => handleSort(column.accessor)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {/* Sort Indicator */}
                    {sortConfig.key === column.accessor ? (
                      sortConfig.direction === 'ascending' ? (
                        <ArrowUp className="ml-1" size={16} />
                      ) : (
                        <ArrowDown className="ml-1" size={16} />
                      )
                    ) : null}
                  </div>
                </th>
              ))}
              {/* Uncomment if you want an Action column */}
              {/* {(clickable || onRowClick) && (
                <th className="px-6 py-3 text-left">Action</th>
              )} */}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length > 0 ? (
              sortedRows.map((item, index) => (
                <tr
                  key={item._id} // Ensure each item has a unique '_id'
                  className={`border-b border-[#6B5A5A] ${
                    index % 2 === 0 ? "bg-[#4B3F3F]" : "bg-[#5A4A4A]"
                  } ${
                    clickable || onRowClick
                      ? "cursor-pointer hover:bg-[#707070]"
                      : ""
                  }`}
                  onClick={() => handleRowClick(item)}
                >
                  {columns.map((column, idx) => {
                    const accessor = column.accessor;
                    const value = item[accessor];
                    return (
                      <td
                        key={idx}
                        className="px-6 py-2 text-left text-white"
                      >
                        {value}
                      </td>
                    );
                  })}
                  {/* Uncomment if you want an Action icon */}
                  {/* {(clickable || onRowClick) && (
                    <td className="px-6 py-2 text-left">
                      <ChevronRight
                        className="inline-block text-gray-400"
                        size={20}
                      />
                    </td>
                  )} */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (clickable || onRowClick ? 1 : 0)} className="px-6 py-4 text-center text-gray-300">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Define PropTypes for better type checking
InvestmentsTable.propTypes = {
  data: PropTypes.array, // Array of data objects
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
    })
  ).isRequired, // Array of column objects with header and accessor
  link: PropTypes.string, // Base link for navigation
  clickable: PropTypes.bool, // Whether rows are clickable
  onRowClick: PropTypes.func, // Custom click handler
};

export default InvestmentsTable;
