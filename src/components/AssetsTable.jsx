import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const AssetsTable = ({ row, col, link, clickable = false, onRowClick }) => {
  const navigate = useNavigate();
  const tableBodyRef = useRef(null);
  const tableHeaderRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");

  const handleRowClick = (item) => {
    if (onRowClick) {
      onRowClick(item);
    } else if (clickable && link) {
      navigate(`${link}${item.id}`);
    }
  };

  const formatValueAdded = (value) => {
    if (typeof value === "number") {
      return value > 0 ? `+${value}` : value;
    }
    return value;
  };

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

  // Filter rows based on the search term
  const filteredRows = row.filter((r) =>
    Object.values(r).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const renderTableContent = (isHeader = false) => (
    <table className="w-full min-w-max table-auto">
      {isHeader ? (
        <thead className="bg-[#201010] text-[#FF9321]">
          <tr>
            {col.map((item, index) => (
              <th
                key={index}
                className="px-6 py-3 font-semibold text-left"
              >
                {item}
              </th>
            ))}
            {(clickable || onRowClick) && (
              <th className="px-6 py-3 text-left">Action</th>
            )}
          </tr>
        </thead>
      ) : (
        <tbody>
          {filteredRows.map((r, index) => (
            <tr
              key={index}
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
                    {key === "ValueAdded" ? formatValueAdded(value) : value}
                  </td>
                );
              })}
              {(clickable || onRowClick) && (
                <td className="px-6 py-2 text-left">
                  <ChevronRight
                    className="inline-block text-gray-400"
                    size={20}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      )}
    </table>
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
        {/* Table Header */}
        <div
          className="overflow-x-auto bg-gray-800"
          ref={tableHeaderRef}
        >
          {renderTableContent(true)}
        </div>
        {/* Table Body */}
        <div
          className="max-h-[60vh] overflow-y-auto overflow-x-auto"
          ref={tableBodyRef}
        >
          {renderTableContent()}
        </div>
      </div>
    </div>
  );
};

export default AssetsTable;
