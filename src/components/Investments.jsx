// src/components/Investments.jsx

import React, { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import InvestmentsTable from "./InvestmentsTable.jsx";
import axios from "../api/axios.js";
import { toast } from "react-toastify";
import { AdminContext } from "../contexts/AdminContext.jsx"; // Ensure this path is correct

const Investments = () => {
  const navigate = useNavigate();
  const { token } = useContext(AdminContext); // Access admin token

  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Added searchTerm state

  // Define column headers, including "Contract"
  const columns = [
    { header: "Investment ID", accessor: "investmentId" }, // Corrected accessor
    { header: "Investor Name", accessor: "investorName" },
    { header: "Investor ID", accessor: "investorId" },
    { header: "Amount", accessor: "amount" },
    { header: "ROI (%)", accessor: "ROI" },
    { header: "Deposit Date", accessor: "investmentDate" }, // Mapped from investmentDate
    { header: "Maturity Date", accessor: "maturityDate" },
    { header: "Contract", accessor: "contract" }, // No change needed
  ];

  useEffect(() => {
    const fetchInvestments = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/investments", {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: currentPage }, // Assuming your API supports pagination via query params
        });

        // Check if response data exists and has investments
        if (response.data && response.data.investments) {
          // Flatten the investments data
          const flatInvestments = response.data.investments.map((inv) => ({
            _id: inv._id,
            investmentId: inv.investmentId, // Correctly mapped
            investorName: inv.investor.name,
            investorId: inv.investor.userId, // Ensure 'userId' is populated
            amount: `AED ${Number(inv.amount).toLocaleString()}`, // Format as currency
            ROI: `${inv.ROI}%`,
            contract: `investments/${inv._id}/contract/user`, // Directly set the contract URL
            investmentDate: inv.investmentDate
              ? new Date(inv.investmentDate).toLocaleDateString()
              : "N/A", // Mapped from investmentDate
            maturityDate: inv.maturityDate
              ? new Date(inv.maturityDate).toLocaleDateString()
              : "N/A",
          }));

          setInvestments(flatInvestments);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setInvestments([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching investments:", error);
        toast.error("Failed to fetch investments.");
      } finally {
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

  /**
   * Handle search input changes.
   * @param {string} term - The current search term entered by the user.
   */
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
  };

  /**
   * Filter investments based on the search term.
   * This uses useMemo for performance optimization.
   */
  const filteredInvestments = useMemo(() => {
    if (!searchTerm) return investments;

    const lowerCaseTerm = searchTerm.toLowerCase();
    return investments.filter((investment) =>
      Object.values(investment).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(lowerCaseTerm)
      )
    );
  }, [investments, searchTerm]);

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      {/* Header */}
      <div className="flex justify-center items-center w-full px-10 py-4 relative mt-5">
        <h1 className="text-4xl font-bold text-[#FF9321]">Investments</h1>
        <button
          onClick={handleCreateInvestmentClick}
          className="absolute right-10 px-4 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white"
        >
          Create Investment
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center mt-10 text-white">
          Loading investments...
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <div className="flex justify-start px-10 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search investments..."
              className="p-2 border border-gray-300 rounded-md w-1/3"
            />
          </div>

          {/* Investments Table */}
          {filteredInvestments.length > 0 ? (
            <InvestmentsTable
              data={filteredInvestments}
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
