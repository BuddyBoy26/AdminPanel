// src/components/AssetsTable.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const AssetsTable = ({ row, col, link, clickable = false, onRowClick }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleRowClick = (item) => {
    if (onRowClick) {
      onRowClick(item);
    } else if (clickable && link) {
      navigate(`${link}${item.id}`);
    }
  };

  // Filter rows based on the search term while preserving the 'id' field
  const filteredRows = row
    .map((r) => ({ ...r })) // Create a shallow copy of each row
    .filter((r) =>
      Object.entries(r)
        .filter(([key]) => key !== "id") // Exclude 'id' from filtering
        .some(([, value]) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

  return (
    <div className="container mx-auto px-4 py-8 w-full overflow-x-auto">
      {/* Search Bar */}
      <div className="flex justify-start mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search assets..."
          className="p-2 border border-gray-300 rounded-md w-1/3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF9321]"
        />
      </div>
      <div className="shadow-2xl rounded-lg overflow-hidden border-b border-[#656565]">
        <table className="w-full table-fixed">
          <thead className="bg-[#201010] text-[#FF9321] sticky top-0 z-10">
            <tr>
              {col.map((item, index) => (
                <th
                  key={index}
                  className="px-6 py-3 font-semibold text-left"
                >
                  {item}
                </th>
              ))}
              {/* {(clickable || onRowClick) && (
                <th className="px-6 py-3 text-left">Action</th>
              )} */}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((r, index) => (
              <tr
                key={r.id}
                className={`border-b border-[#6B5A5A] ${
                  index % 2 === 0 ? "bg-[#4B3F3F]" : "bg-[#5A4A4A]"
                } ${
                  clickable || onRowClick
                    ? "cursor-pointer hover:bg-[#707070]"
                    : ""
                }`}
                onClick={() => handleRowClick(r)}
              >
                {col.map((column, idx) => {
                  const key = column.replace(/\s+/g, ""); // Remove spaces to match keys
                  const value = r[key];
                  return (
                    <td
                      key={idx}
                      className="px-6 py-2 text-left text-white"
                    >
                      {value}
                    </td>
                  );
                })}
                {/* {(clickable || onRowClick) && (
                  <td className="px-6 py-2 text-left">
                    <ChevronRight
                      className="inline-block text-gray-400"
                      size={20}
                    />
                  </td>
                )} */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetsTable;
