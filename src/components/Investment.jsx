// src/components/Investment.jsx

import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import { toast } from "react-toastify";
import { AdminContext } from "../contexts/AdminContext.jsx";

const Investment = () => {
  const { id } = useParams();
  const { token } = useContext(AdminContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [investment, setInvestment] = useState(null);
  const [initialInvestment, setInitialInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [contractFile, setContractFile] = useState(null); // For handling contract file uploads

  useEffect(() => {
    // Fetch investment details using the ID
    const fetchInvestment = async () => {
      setLoading(true);
      try {
        // Check if investmentData was passed via state
        if (location.state && location.state.investmentData) {
          setInvestment(location.state.investmentData);
          setInitialInvestment(location.state.investmentData);
        } else {
          const response = await axios.get(`/investments/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setInvestment(response.data.investment);
          setInitialInvestment(response.data.investment);
        }
      } catch (error) {
        console.error("Error fetching investment:", error);
        toast.error("Failed to fetch investment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestment();
  }, [id, token, location.state]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const getNestedValue = (obj, key) => {
    return key.split(".").reduce((o, k) => (o ? o[k] : ""), obj);
  };

  const setNestedValue = (obj, key, value) => {
    const keys = key.split(".");
    const lastKey = keys.pop();
    const deepObj = keys.reduce((o, k) => {
      o[k] = o[k] || {};
      return o[k];
    }, obj);
    deepObj[lastKey] = value;
  };

  // Function to handle input changes
  const handleChange = (key, value) => {
    setInvestment((prevInvestment) => {
      const updatedInvestment = { ...prevInvestment };
      setNestedValue(updatedInvestment, key, value);
      return updatedInvestment;
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setContractFile(file);
  };

  const appendFormData = (formData, data, parentKey = "") => {
    if (data && typeof data === "object" && !(data instanceof File)) {
      Object.keys(data).forEach((key) => {
        appendFormData(
          formData,
          data[key],
          parentKey ? `${parentKey}.${key}` : key
        );
      });
    } else {
      formData.append(parentKey, data);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      const updatedFields = {};

      for (const key of Object.keys(fieldLabels)) {
        if (uneditableFields.includes(key)) continue;
        const newValue = getNestedValue(investment, key);
        const oldValue = getNestedValue(initialInvestment, key);

        if (newValue !== oldValue) {
          setNestedValue(updatedFields, key, newValue);
        }
      }

      // If no fields have changed and no contract file, do nothing
      if (Object.keys(updatedFields).length === 0 && !contractFile) {
        toast.info("No changes to save.");
        return;
      }

      const formData = new FormData();

      // Append updated fields
      appendFormData(formData, updatedFields);

      // Append contract file if it's changed
      if (contractFile) {
        formData.append("contract", contractFile);
      }

      await axios.put(`/investments/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Investment updated successfully");
      // Update initialInvestment to the current investment after save
      setInitialInvestment(investment);
    } catch (error) {
      console.error("Error updating investment:", error);
      toast.error("Failed to update investment.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/investments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Investment deleted successfully");
      navigate("/investments"); // Redirect to investments list page
    } catch (error) {
      console.error("Error deleting investment:", error);
      toast.error("Failed to delete investment.");
    }
  };

  const handleDownloadContract = async () => {
    try {
      const response = await axios.get(`/investments/${id}/contract`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // Important for handling binary data
      });
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      // Create a link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `contract_${id}.pdf`);
      // Append to the document and trigger download
      document.body.appendChild(link);
      link.click();
      // Clean up
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading contract:", error);
      toast.error("Failed to download contract.");
    }
  };

  // Mapping field keys to display labels
  const fieldLabels = {
    investmentId: "Investment ID",
    "investor.name": "Investor Name",
    "investor.userId": "Investor ID",
    amount: "Amount",
    ROI: "Return on Investment (ROI)",
    investmentDate: "Deposit Date",
    maturityDate: "Maturity Date",
    ticketSize: "Ticket Size",
  };

  // Fields that should not be editable
  const uneditableFields = ["investmentId", "investor.name", "investor.userId"];

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
    <div className="flex min-h-[calc(100vh-64px)] bg-[#322323] w-full">
      <div className="flex justify-center w-full h-full bg-[#322323] p-4 overflow-y-auto custom-scrollbar">
        <div className="w-3/6 bg-[#493939] rounded-lg shadow-md p-6 my-6 lg:m-6">
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
              {Object.entries(fieldLabels).map(([fieldKey, displayName]) => {
                const fieldValue = getNestedValue(investment, fieldKey);
                return (
                  <div key={fieldKey} className="mb-6">
                    <div className="p-4 flex justify-around items-center w-full h-12">
                      <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                        {displayName}
                      </span>
                      {isEditing && !uneditableFields.includes(fieldKey) ? (
                        fieldKey.toLowerCase().includes("date") ? (
                          <input
                            type="date"
                            value={
                              fieldValue
                                ? new Date(fieldValue)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              handleChange(fieldKey, e.target.value)
                            }
                            className="w-1/2 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                          />
                        ) : (
                          <input
                            type="text"
                            value={
                              fieldValue === null || fieldValue === undefined
                                ? ""
                                : fieldValue
                            }
                            onChange={(e) =>
                              handleChange(fieldKey, e.target.value)
                            }
                            className="w-1/2 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                          />
                        )
                      ) : (
                        <span className="w-1/2 text-md font-semibold text-white text-center">
                          {fieldValue === null || fieldValue === undefined
                            ? ""
                            : fieldKey.toLowerCase().includes("date")
                            ? new Date(fieldValue).toLocaleDateString()
                            : fieldKey === "amount"
                            ? new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "AED",
                              }).format(fieldValue)
                            : fieldKey === "ROI"
                            ? `${fieldValue}%`
                            : fieldValue}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Contract Handling */}
              <div className="mb-6">
                <div className="p-4 flex justify-around items-center w-full h-12">
                  <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                    Contract
                  </span>
                  {isEditing ? (
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept="application/pdf"
                      className="w-1/2 text-md font-semibold text-white text-center"
                    />
                  ) : (
                    <span className="w-1/2 text-md font-semibold text-white text-center">
                      <button
                        onClick={handleDownloadContract}
                        className="text-[#FF9321] underline"
                      >
                        Download Contract
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Content (e.g., Action Buttons) */}
        </div>
      </div>
    </div>
  );
};

export default Investment;
