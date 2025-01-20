// src/components/Investments.jsx

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import InvestmentsTable from "./InvestmentsTable.jsx"; // Ensure correct path
import axios from "../api/axios.js";
import { toast } from "react-toastify";
import { AdminContext } from "../contexts/AdminContext.jsx"; // Ensure this path is correct
import InvestmentsTable from "./InvestmentsTable.jsx";
import TheTable from "./TheTable.jsx";

const Investments = () => {
  const navigate = useNavigate();
  const { token } = useContext(AdminContext); // Access admin token

  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [totalPages, setTotalPages] = useState(1);

  // Define column headers, including "Contract"
  const columns = [
    { header: "Investment ID", accessor: "investmentId" },
    { header: "Investor Name", accessor: "investorName" },
    { header: "Investor ID", accessor: "investorId" },
    { header: "Amount", accessor: "amount" },
    { header: "ROI (%)", accessor: "ROI" },
    { header: "Deposit Date", accessor: "investmentDate" },
    { header: "Maturity Date", accessor: "maturityDate" },
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
            investmentId: inv.investmentId,
            investorName: inv.investor.name,
            investorId: inv.investor.userId,
            amount: `AED ${Number(inv.amount).toLocaleString()}`,
            ROI: inv.ROI,
            contract: `/investments/${inv._id}/contract/user`, // Adjusted to start with '/'
            investmentDate: inv.investmentDate
              ? new Date(inv.investmentDate).toLocaleDateString()
              : "N/A",
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

  const handleReport = async (investments) => {
    try {
      // Dynamically construct the endpoint using unit type
      const endpoint = `/investments/report/pdf`;

      const getFormattedDate = (date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().split("T")[0];
      };

      const startDate = getFormattedDate(new Date(new Date().setMonth(new Date().getMonth() - 1)));
      const endDate = getFormattedDate(new Date());

      const response = await axios.get(endpoint, {
        responseType: "blob", // Expecting a PDF blob
        params: {
          startDate: startDate,
          endDate: endDate
          // Include additional params if necessary, e.g., unitName
        },
      });

      console.log(response)
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Investments_Report_${new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString()}_${new Date().toLocaleDateString()}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Unitwise PDF:", error);
      toast.error("Failed to download the Unitwise report.");
    }
    return; // Exit since Unitwise case has been handled
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  console.log(investments)

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      {/* Header */}
      <div className="relative flex flex-col sm:flex-row justify-center items-center w-full px-6 py-4 mt-5">
        {/* Investments Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#FF9321]">
          Investments
        </h1>

        
        {/* Report */}
        <button
          onClick={handleReport}
          className="mt-4 sm:mt-0 sm:absolute sm:right-48 px-5 py-2 mx-12 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
          aria-label="Create a new asset"
        >
           Report
        </button>
        
        {/* Create Investment Button */}
        <button
          onClick={handleCreateInvestmentClick}
          className="mt-4 sm:mt-0 sm:absolute sm:right-10 px-5 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
          aria-label="Create a new investment"
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
          {/* Investments Table */}
          {investments.length > 0 ? (
            <TheTable
              data={investments}
              columns={columns}
              link="/investment/" // Base link for navigation
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
