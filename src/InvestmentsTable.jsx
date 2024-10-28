import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const InvestmentsTable = ({ row, col, clickable = false }) => {
  const navigate = useNavigate();
  const tableBodyRef = useRef(null);
  const tableHeaderRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");

  const handleRowClick = (item) => {
    if (clickable) {
      navigate("/investment", { state: { investmentData: item } });
    }
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
    <table className="w-full text-sm">
      {isHeader ? (
        <thead className="bg-[#201010] text-[#FF9321]">
          <tr>
            {col.map((item, index) => (
              <th
                key={index}
                className="px-6 min-w-32 py-4 font-semibold text-center"
              >
                {item}
              </th>
            ))}
            <td className="w-2 text-black">|</td>
          </tr>
        </thead>
      ) : (
        <tbody>
          {filteredRows.map((r, index) => (
            <tr
              key={index}
              className={`border-b transition-colors border-[#6B5A5A] duration-200 ${
                index % 2 === 0 ? "bg-[#4B3F3F]" : "bg-[#5A4A4A]"
              } ${clickable ? "cursor-pointer hover:bg-[#707070]" : ""}`}
              onClick={() => handleRowClick(r)}
            >
              {Object.entries(r).map(([key, value], idx) => (
                <td
                  key={idx}
                  className="min-w-32 text-center py-4 text-white"
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
      )}
    </table>
  );

  return (
    <div className="container mx-auto px-4 py-8 w-5/6 max-h-[80vh]">
      <div className="flex justify-start mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="p-2 border border-gray-300 rounded-md w-1/3"
        />
      </div>
      <div className="shadow-2xl rounded-lg overflow-hidden border-b border-[#656565] transform perspective-1000">
        <div
          className="overflow-x-auto invisible-scrollbar relative z-10 bg-gray-800"
          ref={tableHeaderRef}
        >
          {renderTableContent(true)}
        </div>
        <div
          className="max-h-[60vh] overflow-y-auto overflow-x-auto custom-scrollbar relative"
          ref={tableBodyRef}
        >
          {renderTableContent()}
        </div>
      </div>
    </div>
  );
};

export default InvestmentsTable;
