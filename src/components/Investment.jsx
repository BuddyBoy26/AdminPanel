// src/components/Investment.jsx

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import { toast } from "react-toastify";
import { AdminContext } from "../contexts/AdminContext.jsx"; // Import AdminContext
import RenderFieldValue from "./RenderFieldValue.jsx"; // Import the helper component

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

  // Mapping field keys to display labels
  const fieldLabels = {
    InvestmentID: "Investment ID",
    InvestorName: "Investor Name",
    InvestorID: "Investor ID",
    Amount: "Amount",
    ROI: "Return on Investment (ROI)",
    DepositDate: "Deposit Date",
    MaturityDate: "Maturity Date",
    _id: "ID",
    investor: "Investor",
    contract: "Contract",
    ticketSize: "Ticket Size",
    createdAt: "Created At",
    updatedAt: "Updated At",
    investmentId: "Investment ID",
    __v: "Version",
    // Add more field mappings as needed
  };

  // Function to beautify field keys
  const beautifyFieldKey = (key) => {
    return fieldLabels[key] || key.replace(/([A-Z])/g, " $1");
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#322323]">
      <div className="flex justify-center w-full h-full bg-[#322323] p-4 overflow-y-auto custom-scrollbar">
        <div className="w-4/5 bg-[#493939] rounded-lg shadow-md p-6 my-6 lg:m-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="ml-10 text-3xl font-bold text-[#FF9321]">
              Investment Information
            </h2>
            <div>
              <button
                onClick={isEditing ? handleSave : handleEditToggle}
                className={`px-4 py-2 rounded-md mr-2 ${
                  isEditing
                    ? "bg-green-500 border text-white hover:border-white"
                    : "bg-[#FF9321] border border-[#FF9321] text-white hover:border-white"
                }`}
              >
                {isEditing ? "Save" : "Edit"}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-500 border border-red-500 text-white hover:border-white"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-0 mt-8 ml-4 w-full">
            <div className="border border-[#FF9321] rounded-lg p-4 mb-4">
              {Object.entries(investmentInfo).map(([fieldKey, fieldValue]) => (
                <div key={fieldKey} className="mb-6">
                  <div className="p-4 flex justify-around items-center w-full h-12">
                    <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                      {beautifyFieldKey(fieldKey)}
                    </span>
                    {isEditing ? (
                      fieldKey === "Contract" ? (
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="w-1/2 text-md font-semibold text-white text-center"
                        />
                      ) : typeof fieldValue === "object" &&
                        fieldValue !== null ? (
                        <RenderFieldValue
                          value={fieldValue}
                          beautifyFieldKey={beautifyFieldKey}
                        />
                      ) : (
                        <input
                          type="text"
                          value={fieldValue}
                          onChange={(e) =>
                            handleChange(fieldKey, e.target.value)
                          }
                          className="w-1/2 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                        />
                      )
                    ) : fieldKey === "Contract" ? (
                      <span className="w-1/2 text-md font-semibold text-white text-center">
                        <a
                          href={`/contracts/${fieldValue}`} // Adjust the path as needed
                          className="text-[#FF9321] underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            console.log("Download contract:", fieldValue);
                          }}
                        >
                          {fieldValue}
                        </a>
                      </span>
                    ) : typeof fieldValue === "object" &&
                      fieldValue !== null ? (
                      <RenderFieldValue
                        value={fieldValue}
                        beautifyFieldKey={beautifyFieldKey}
                      />
                    ) : (
                      <span className="w-1/2 text-md font-semibold text-white text-center">
                        {fieldKey.toLowerCase().includes("date")
                          ? new Date(fieldValue).toLocaleDateString()
                          : fieldValue}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Content (e.g., Action Buttons) */}
        </div>
      </div>
    </div>
  );
};

export default Investment;
