// src/components/Investment.jsx

import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { AdminContext } from "../contexts/AdminContext.jsx";
import { toast } from "react-toastify";

const Investment = () => {
  const { id } = useParams(); // Extract investment ID from the route parameters
  const { token } = useContext(AdminContext); // Access admin token
  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch investment details using the ID
    const fetchInvestment = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/investments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvestment(response.data.investment);
      } catch (error) {
        console.error("Error fetching investment:", error);
        toast.error("Failed to fetch investment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestment();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10 text-white">
        Loading investment details...
      </div>
    );
  }

  if (!investment) {
    return (
      <div className="flex justify-center items-center mt-10 text-white">
        Investment not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h2 className="text-3xl font-bold mb-4">Investment Details</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <p>
          <strong>Investment ID:</strong> {investment.investmentId}
        </p>
        <p>
          <strong>Investor Name:</strong> {investment.investorName}
        </p>
        <p>
          <strong>Investor ID:</strong> {investment.investorId}
        </p>
        <p>
          <strong>Amount:</strong> {investment.amount}
        </p>
        <p>
          <strong>ROI:</strong> {investment.ROI}%
        </p>
        <p>
          <strong>Contract:</strong>{" "}
          {investment.contract ? (
            <a
              href={`/api/contracts/${investment.investmentId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Contract
            </a>
          ) : (
            "N/A"
          )}
        </p>
        <p>
          <strong>Deposit Date:</strong> {investment.depositDate}
        </p>
        <p>
          <strong>Maturity Date:</strong> {investment.maturityDate}
        </p>
        <p>
          <strong>Ticket Size:</strong> {investment.ticketSize}
        </p>
      </div>
    </div>
  );
};

export default Investment;
