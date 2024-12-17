// src/components/InvestmentsTable.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const InvestmentsTable = ({
  data,
  columns,
  small = false,
  clickable = false,
}) => {
  const navigate = useNavigate();

  /**
   * Handle row click to navigate to investment details.
   * @param {Object} item - The investment data for the clicked row.
   */
  const handleRowClick = (item) => {
    if (clickable) {
      navigate(`/investment/${item._id}`);
    }
  };

  /**
   * Filter out the "contract" column from the columns array.
   */
  const filteredColumns = columns.filter((col) => col.accessor !== "contract");

  /**
   * Render the table header.
   */
  const renderTableHeader = () => (
    <table className="w-full table-fixed text-sm">
      <thead className="bg-[#201010] text-[#FF9321]">
        <tr>
          {filteredColumns.map((col, index) => (
            <th
              key={index}
              className={`px-6 min-w-32 py-4 font-semibold text-center ${
                small ? "text-xs" : "text-base"
              }`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
    </table>
  );

  /**
   * Render the table body with investments data.
   */
  const renderTableBody = () => (
    <table className="w-full table-fixed text-sm">
      <tbody>
        {data.map((r, index) => (
          <tr
            key={r.investmentId || index}
            className={`border-b transition-colors border-[#6B5A5A] duration-200 ${
              index % 2 === 0 ? "bg-[#4B3F3F]" : "bg-[#5A4A4A]"
            } ${clickable ? "cursor-pointer hover:bg-[#707070]" : ""}`}
            onClick={() => handleRowClick(r)}
          >
            {filteredColumns.map((col, colIndex) => (
              <td key={colIndex} className="py-4 px-6 text-center text-white">
                {r[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="container mx-auto px-4 py-8 w-full max-h-[80vh]">
      {/* Table with Header and Body */}
      <div className="shadow-2xl rounded-lg overflow-hidden border-b border-[#656565]">
        {/* Table Header */}
        <div className="overflow-x-auto bg-gray-800 pr-4">
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

export default InvestmentsTable;
