// src/components/Assets.jsx

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import AssetsTable from "./AssetsTable.jsx"; // Ensure correct path
import axios from "../api/axios.js";
import { toast } from "react-toastify";
import { AdminContext } from "../contexts/AdminContext.jsx"; // Ensure this path is correct
import AssetsTable from "./AssetsTable.jsx";
import TheTable from "./TheTable.jsx";

const Assets = () => {
  const navigate = useNavigate();
  const { token } = useContext(AdminContext); // Access admin token

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [totalPages, setTotalPages] = useState(1);

  // Define column headers, including "Contract"
  const columns = [
    { header: "Investment ID", accessor: "investmentId" },
    { header: "Investor", accessor: "investor" },
    { header: "Number Plate", accessor: "numberPlate" },
    { header: "Type", accessor: "type" },
    { header: "Brand", accessor: "brand" },
    { header: "Model", accessor: "model" },
  ];

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/assets", {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: currentPage }, // Assuming your API supports pagination via query params
        });

        // Check if response data exists and has assets
        if (response.data && response.data.assets) {
          // Flatten the assets data
          const flatAssets = response.data.assets.map((asset) => ({
            _id: asset._id,
            investmentId: asset.investment.investmentId,
            numberPlate: asset.NumberPlate,
            type: asset.Type,
            brand: asset.Brand,
            model: asset.Model,
            investor: asset.investment.investor.name,
          }));

          setAssets(flatAssets);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setAssets([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
        toast.error("Failed to fetch assets.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [currentPage, token]);

  const handleCreateAssetClick = () => {
    navigate("/create/asset");
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  console.log(assets)

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      {/* Header */}
      <div className="relative flex flex-col sm:flex-row justify-center items-center w-full px-6 py-4 mt-5">
        {/* Assets Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#FF9321]">
          Assets
        </h1>
        
        {/* Create Asset Button */}
        <button
          onClick={handleCreateAssetClick}
          className="mt-4 sm:mt-0 sm:absolute sm:right-10 px-5 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
          aria-label="Create a new asset"
        >
          Create Asset
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center mt-10 text-white">
          Loading assets...
        </div>
      ) : (
        <>
          {/* Assets Table */}
          {assets.length > 0 ? (
            <TheTable
              data={assets}
              columns={columns}
              link="/asset/" // Base link for navigation
              clickable={true}
            />
          ) : (
            <div className="flex justify-center items-center mt-10 text-white">
              No assets found.
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === 1
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#FF9321] text-white hover:bg-[#e07a1f]"
              }`}
            >
              Prev
            </button>
            <span className="px-3 py-1 text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#FF9321] text-white hover:bg-[#e07a1f]"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Assets;
