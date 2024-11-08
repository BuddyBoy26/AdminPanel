// src/components/LogTable.jsx

import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LogTable = ({ row, col, clickable = false }) => {
  const navigate = useNavigate();

  const handleRowClick = (item) => {
    if (clickable) {
      // Implement navigation or other actions
      console.log("Row clicked:", item);
    }
  };

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
            </tr>
          </thead>
          <tbody className="divide-y divide-[#656565]">
            {row.map((r, index) => (
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

export default LogTable;
