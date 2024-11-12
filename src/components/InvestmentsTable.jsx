// src/components/InvestmentsTable.jsx

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const InvestmentsTable = ({
  data,
  columns,
  small = false,
  clickable = false,
}) => {
  const navigate = useNavigate();

  const tableBodyRef = useRef(null);
  const tableHeaderRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Handle row click to navigate to investment details.
   * @param {Object} item - The investment data for the clicked row.
   */
  const handleRowClick = (item) => {
    if (clickable) {
      navigate(`/investment/${item.investmentId}`, {
        state: { investmentData: item },
      });
    }
  };

  /**
   * Synchronize the scroll position between the table header and body.
   */
  useEffect(() => {
    const handleBodyScroll = () => {
      if (tableHeaderRef.current && tableBodyRef.current) {
        tableHeaderRef.current.scrollLeft = tableBodyRef.current.scrollLeft;
      }
    };

    const handleHeaderScroll = () => {
      if (tableHeaderRef.current && tableBodyRef.current) {
        tableBodyRef.current.scrollLeft = tableHeaderRef.current.scrollLeft;
      }
    };

    const tableBody = tableBodyRef.current;
    const tableHeader = tableHeaderRef.current;

    if (tableBody) {
      tableBody.addEventListener("scroll", handleBodyScroll);
    }

    if (tableHeader) {
      tableHeader.addEventListener("scroll", handleHeaderScroll);
    }

    return () => {
      if (tableBody) {
        tableBody.removeEventListener("scroll", handleBodyScroll);
      }
      if (tableHeader) {
        tableHeader.removeEventListener("scroll", handleHeaderScroll);
      }
    };
  }, []);

  /**
   * Filter rows based on the search term.
   */
  const filteredRows = data.filter((r) =>
    Object.values(r).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  /**
   * Render the table header.
   */
  const renderTableHeader = () => (
    <table className="w-full text-sm">
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
          {clickable && <th className="w-2 text-black">Action</th>}
        </tr>
      </thead>
    </table>
  );

  /**
   * Render the table body with filtered rows.
   */
  const renderTableBody = () => (
    <table className="w-full text-sm">
      <tbody>
        {filteredRows.map((r, index) => (
          <tr
            key={r.investmentId || index}
            className={`border-b transition-colors border-[#6B5A5A] duration-200 ${
              index % 2 === 0 ? "bg-[#4B3F3F]" : "bg-[#5A4A4A]"
            } ${clickable ? "cursor-pointer hover:bg-[#707070]" : ""}`}
            onClick={() => handleRowClick(r)}
          >
            {columns.map((col, colIndex) => (
              <td key={colIndex} className="py-4 px-6 text-center text-white">
                {col.accessor === "contract" && r[col.accessor] !== "N/A" ? (
                  <a
                    href={r[col.accessor]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                    onClick={(e) => e.stopPropagation()} // Prevent row click when clicking the link
                  >
                    View Contract
                  </a>
                ) : (
                  r[col.accessor]
                )}
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
  );

  return (
    <div className="container mx-auto px-4 py-8 w-full max-h-[80vh]">
      {/* Search Bar */}
      <div className="flex justify-start mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search investments..."
          className="p-2 border border-gray-300 rounded-md w-1/3"
        />
      </div>

      {/* Table with Header and Body */}
      <div className="shadow-2xl rounded-lg overflow-hidden border-b border-[#656565]">
        {/* Table Header */}
        <div className="overflow-x-auto bg-gray-800" ref={tableHeaderRef}>
          {renderTableHeader()}
        </div>

        {/* Table Body */}
        <div
          className="max-h-[60vh] overflow-y-auto overflow-x-auto"
          ref={tableBodyRef}
        >
          {renderTableBody()}
        </div>
      </div>
    </div>
  );
};

export default InvestmentsTable;
