// src/components/Investments.jsx

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import InvestmentsTable from "./InvestmentsTable.jsx"; // Ensure this path is correct
import axios from "../api/axios.js";
import { toast } from "react-toastify";
import { AdminContext } from "../contexts/AdminContext.jsx"; // Ensure this path is correct

const Investments = () => {
  const navigate = useNavigate();
  const { admin, token } = useContext(AdminContext); // Access admin and token if needed

  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [totalPages, setTotalPages] = useState(1);

  // Define column headers without "Investment ID"
  const columns = [
    { header: "Investor Name", accessor: "investorName" },
    { header: "Investor ID", accessor: "investorId" },
    { header: "Amount", accessor: "amount" },
    { header: "ROI (%)", accessor: "ROI" },
    { header: "Contract", accessor: "contract" },
    { header: "Deposit Date", accessor: "depositDate" },
    { header: "Maturity Date", accessor: "maturityDate" },
  ];

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get("/investments", {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: currentPage }, // Assuming your API supports pagination via query params
        });

        // Check if response data exists and has investments
        if (response.data && response.data.investments) {
          // Flatten the investments data
          const flatInvestments = response.data.investments.map((inv) => ({
            investmentId: inv._id, // Keep investmentId for navigation
            investorName: inv.investor.name,
            investorId: inv.investor.id,
            amount: `$${inv.amount.toLocaleString()}`, // Format as currency
            ROI: `${inv.ROI}%`,
            contract: inv.contract ? `/api/contracts/${inv._id}` : "N/A", // Changed here
            depositDate: inv.depositDate
              ? new Date(inv.depositDate).toLocaleDateString()
              : "N/A",
            maturityDate: inv.maturityDate
              ? new Date(inv.maturityDate).toLocaleDateString()
              : "N/A",
          }));

          setInvestments(flatInvestments);
          setTotalPages(response.data.pages || 1); // Default to 1 if pages not provided
        } else {
          setInvestments([]);
          setTotalPages(1);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching investments:", error);
        toast.error("Failed to fetch investments.");
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [currentPage, token]);

  const handleCreateInvestmentClick = () => {
    navigate("/create/investment");
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      <div className="flex justify-center items-center w-full px-10 py-4 relative mt-5">
        <h1 className="text-4xl font-bold text-[#FF9321]">Investments</h1>
        <button
          onClick={handleCreateInvestmentClick}
          className="absolute right-10 px-4 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white"
        >
          Create Investment
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center mt-10 text-white">
          Loading investments...
        </div>
      ) : (
        <>
          {investments.length > 0 ? (
            <InvestmentsTable
              data={investments}
              columns={columns}
              small={false}
              clickable={true}
            />
          ) : (
            <div className="flex justify-center items-center mt-10 text-white">
              No investments found.
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

export default Investments;
