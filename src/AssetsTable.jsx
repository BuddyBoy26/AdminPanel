import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const AssetsTable = ({ row, col, clickable = false }) => {
  const navigate = useNavigate();
  const tableBodyRef = useRef(null);
  const tableHeaderRef = useRef(null);

  const handleRowClick = (item) => {
    if (clickable) {
      navigate("/asset", { state: { assetData: item } });
    }
  };

  const formatValueAdded = (value) => {
    if (value > 0) {
      return `+${value}`;
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

  const renderTableContent = (isHeader = false) => (
    <table className="w-full text-sm">
      {isHeader ? (
        <thead className="bg-gray-800 text-white">
          <tr>
            {col.map((item, index) => (
              <th
                key={index}
                className="px-6 min-w-32 py-4 font-semibold text-center"
              >
                {item}
              </th>
            ))}
            {clickable && (
              <td className="w-10 py-4 whitespace-nowrap text-right">
                <ChevronRight className="inline-bloc text-gray-800" size={20} />
              </td>
            )}
            <td className="w-2 text-black">|</td>
          </tr>
        </thead>
      ) : (
        <tbody>
          {row.map((r, index) => (
            <tr
              key={index}
              className={`border-b transition-colors duration-200 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } ${clickable ? "cursor-pointer hover:bg-gray-200" : ""}`}
              onClick={() => handleRowClick(r)}
            >
              {Object.entries(r).map(([key, value], idx) => (
                <td
                  key={idx}
                  className={`min-w-32 text-center py-4 ${
                    key === "ValueAdded"
                      ? value > 0
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {key === "ValueAdded" ? formatValueAdded(value) : value}
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
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200 transform perspective-1000 ">
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

export default AssetsTable;
