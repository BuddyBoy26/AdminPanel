// src/components/Investment.jsx

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import { toast } from 'react-toastify';
import { AdminContext } from "../contexts/AdminContext.jsx"; // Import AdminContext

const Investment = () => {
  const { id } = useParams(); // Get investment ID from URL
  const navigate = useNavigate();
  const { admin, token } = useContext(AdminContext); // Access admin and token if needed
  const [investmentInfo, setInvestmentInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvestment = async () => {
      try {
        const response = await axios.get(`/investments/admin/${id}`);
        setInvestmentInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching investment:", error);
        toast.error("Failed to fetch investment details.");
        setLoading(false);
      }
    };

    fetchInvestment();
  }, [id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (field, value) => {
    setInvestmentInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Prepare the update payload
      const updatePayload = {};
      const allowedUpdates = ["InvestmentID", "InvestorName", "InvestorID", "Amount", "ROI", "DepositDate", "MaturityDate"];
      allowedUpdates.forEach((field) => {
        if (investmentInfo[field]) {
          updatePayload[field] = investmentInfo[field];
        }
      });

      const response = await axios.patch(`/investments/${id}`, updatePayload);
      toast.success("Investment update requested and pending verification.");
      setIsEditing(false);
      // Optionally, refetch investment data to reflect changes
      // setInvestmentInfo(response.data);
    } catch (error) {
      console.error("Error updating investment:", error);
      toast.error("Failed to update investment.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this investment?")) {
      try {
        await axios.delete(`/investments/${id}`);
        toast.success("Investment deletion requested and pending verification.");
        navigate("/investments");
      } catch (error) {
        console.error("Error deleting investment:", error);
        toast.error("Failed to delete investment.");
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("Contract", file);

    try {
      const response = await axios.patch(`/investments/${id}/contract`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Contract updated successfully.");
      setInvestmentInfo((prev) => ({
        ...prev,
        Contract: file.name,
      }));
    } catch (error) {
      console.error("Error uploading contract:", error);
      toast.error("Failed to upload contract.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#322323] text-white">
        Loading investment details...
      </div>
    );
  }

  if (!investmentInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#322323] text-white">
        Investment not found.
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#322323]">
      <div className="flex justify-center w-full h-full bg-[#322323] p-4 overflow-y-auto custom-scrollbar">
        <div className="w-4/5 bg-[#493939] rounded-lg shadow-md p-6 my-6 lg:m-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="ml-10 text-3xl font-bold text-[#FF9321]">Investment Information</h2>
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
                      {fieldKey.replace(/([A-Z])/g, ' $1')}
                    </span>
                    {isEditing ? (
                      fieldKey === "Contract" ? (
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="w-1/2 text-md font-semibold text-white text-center"
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
