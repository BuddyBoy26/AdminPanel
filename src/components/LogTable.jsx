// src/components/LogTable.jsx

import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types"; // Optional: For prop type validation

const LogTable = ({ row, col, clickable = false, lim = 10 }) => {
  const navigate = useNavigate();

  const handleRowClick = (item) => {
    if (clickable) {
      // Implement navigation or other actions
      console.log("Row clicked:", item);
      // Example navigation (uncomment if needed)
      // navigate(`/details/${item.id}`);
    }
  };

  // Determine the number of rows to display based on `lim`
  let limitedRows;
  if (lim === 0) {
    limitedRows = row; // Show all rows
  } else if (lim > 0) {
    limitedRows = row.slice(0, lim); // Show up to `lim` rows
  } else {
    limitedRows = row.slice(0, 10); // Default to 10 rows if `lim` is negative or invalid
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="shadow-2xl rounded-lg overflow-hidden border-b border-[#656565] transform perspective-1000">
        <table className="w-full text-sm">
          <thead className="bg-[#201010] text-[#FF9321]">
            <tr>
              {col.map((item, index) => (
                <th
                  key={index}
                  className="font-medium text-left text-xs px-4 py-2 uppercase tracking-wider whitespace-nowrap"
                >
                  {item}
                </th>
              ))}
              {clickable && (
                <th className="font-medium text-left text-xs px-4 py-2 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#656565]">
            {limitedRows.map((r, index) => (
              <tr
                key={index}
                className={`border-b border-[#6B5A5A] font-medium text-left text-s ${
                  index % 2 === 0 ? "bg-[#4B3F3F]" : "bg-[#5A4A4A]"
                } ${clickable ? "cursor-pointer hover:bg-[#707070]" : ""}`}
                onClick={() => handleRowClick(r)}
              >
                {Object.values(r).map((value, idx) => (
                  <td
                    key={idx}
                    className="px-4 py-2 text-left text-white"
                  >
                    {value}
                  </td>
                ))}
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
      </div>
    </div>
  );
};

// Optional: Define prop types for better type checking
LogTable.propTypes = {
  row: PropTypes.arrayOf(PropTypes.object).isRequired,
  col: PropTypes.arrayOf(PropTypes.string).isRequired,
  clickable: PropTypes.bool,
  lim: PropTypes.number,
};

// Optional: Define default props (if not using default parameters)
LogTable.defaultProps = {
  clickable: false,
  lim: 10,
};

export default LogTable;
