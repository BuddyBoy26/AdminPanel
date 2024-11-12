// src/components/Asset.jsx

import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { AdminContext } from "../contexts/AdminContext.jsx";
import Select from "react-select";
import TripsTable from "./TripsTable";

const Asset = () => {
  const { id } = useParams();
  const { admin, token } = useContext(AdminContext);
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [initialAsset, setInitialAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [investments, setInvestments] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [selectedVerifier, setSelectedVerifier] = useState("");

  const col = ["To", "From", "Start Date", "End Date"];

  useEffect(() => {
    // Fetch asset details
    const fetchAsset = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/assets/admin/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAsset(response.data);
        setInitialAsset(response.data);
      } catch (error) {
        console.error("Error fetching asset:", error);
        toast.error("Failed to fetch asset details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [id, token]);

  useEffect(() => {
    // Fetch investments for the dropdown
    const fetchInvestments = async () => {
      try {
        const response = await axiosInstance.get("/investments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvestments(response.data.investments);
      } catch (error) {
        console.error("Error fetching investments:", error);
      }
    };

    fetchInvestments();
  }, [token]);

  useEffect(() => {
    // Fetch admins for assigning as verifier
    const fetchAdmins = async () => {
      try {
        const response = await axiosInstance.get("/admins", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Exclude the current admin from the list
        const otherAdmins = response.data.admins.filter(
          (adminItem) => adminItem._id !== admin._id
        );
        setAdminsList(otherAdmins);
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast.error("Failed to fetch admins.");
      }
    };

    fetchAdmins();
  }, [admin, token]);

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

  // Handle input changes
  const handleChange = (key, value) => {
    setAsset((prevAsset) => {
      const updatedAsset = { ...prevAsset };
      setNestedValue(updatedAsset, key, value);
      return updatedAsset;
    });
  };

  // Handle investment change
  const handleInvestmentChange = (selectedOption) => {
    const investmentId = selectedOption.value;
    const selectedInvestment = investments.find(
      (inv) => inv.investmentId === investmentId
    );
    if (selectedInvestment) {
      setAsset((prevAsset) => ({
        ...prevAsset,
        investment: selectedInvestment,
      }));
    }
  };

  // Handle save
  const handleSave = async () => {
    setIsEditing(false);
    try {
      // Check if verifier is selected
      if (!selectedVerifier) {
        toast.error("Please select a verifier.");
        return;
      }

      const updatedFields = {};

      for (const key of Object.keys(fieldLabels)) {
        if (uneditableFields.includes(key)) continue;

        const newValue = getNestedValue(asset, key);
        const oldValue = getNestedValue(initialAsset, key);

        if (newValue !== oldValue) {
          setNestedValue(updatedFields, key, newValue);
        }
      }

      // Check if investment has changed
      if (asset.investment._id !== initialAsset.investment._id) {
        updatedFields.investment = asset.investment._id;
      }

      if (Object.keys(updatedFields).length === 0) {
        toast.info("No changes to save.");
        return;
      }

      // Prepare the payload
      const payload = {
        updates: updatedFields,
        verifier: selectedVerifier,
        updateType: "update",
      };

      await axiosInstance.post(`/assets/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Update request submitted.");
      setInitialAsset(asset);
      setSelectedVerifier(""); // Reset verifier selection
    } catch (error) {
      console.error("Error updating asset:", error);
      toast.error(
        error.response?.data?.error || "Failed to submit update request."
      );
    }
  };

  // Handle delete (Implement similar logic for verifier selection if needed)
  const handleDelete = async () => {
    // Implement deletion logic with verifier selection here
  };

  // Field labels and keys
  const fieldLabels = {
    NumberPlate: "Number Plate",
    Type: "Type",
    Brand: "Brand",
    Model: "Model",
    "investment.investmentId": "Investment ID",
    "investment.investor.name": "Investor Name",
    "investment.investor.userId": "Investor ID",
  };

  // Fields that should not be editable
  const uneditableFields = [
    "investment.investor.name",
    "investment.investor.userId",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10 text-white">
        Loading asset details...
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex justify-center items-center mt-10 text-white">
        Asset not found.
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#322323]">
      {/* Left section: Asset information */}
      <div className="w-full lg:w-3/5 md:w-3/5 bg-[#322323] p-4 overflow-y-auto custom-scrollbar">
        {/* Asset Information Card */}
        <div className="bg-[#493939] rounded-lg shadow-md p-6 m-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-[#FF9321] ml-10">
              Asset Information
            </h2>
            <div>
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-md mr-2 bg-green-500 border text-white hover:border-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="px-4 py-2 rounded-md bg-gray-500 border text-white hover:border-white"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="px-4 py-2 rounded-md mr-2 bg-[#FF9321] border border-[#FF9321] text-white hover:border-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-md bg-red-500 border border-red-500 text-white hover:border-white"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Verifier Selection */}
          {isEditing && (
            <div className="border border-[#FF9321] rounded-lg p-4 mb-4 mx-6">
              <h3 className="text-lg font-bold mb-2 text-[#FF9321]">
                Select Verifier
              </h3>
              <div className="p-4 flex justify-around items-center w-full h-12">
                <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                  Verifier
                </span>
                <select
                  value={selectedVerifier}
                  onChange={(e) => setSelectedVerifier(e.target.value)}
                  className="w-1/2 p-2 text-md text-black rounded-lg"
                >
                  <option value="">Select Verifier</option>
                  {adminsList.map((adminItem) => (
                    <option key={adminItem._id} value={adminItem._id}>
                      {adminItem.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-0 mt-8 ml-4 w-full">
            <div className="border border-[#FF9321] rounded-lg p-4 mb-4">
              {Object.entries(fieldLabels).map(([fieldKey, displayName]) => {
                let fieldValue = getNestedValue(asset, fieldKey);

                // Handle editing state
                let isFieldEditable =
                  isEditing && !uneditableFields.includes(fieldKey);
                // Special case: investmentId is editable via dropdown
                if (fieldKey === "investment.investmentId") {
                  isFieldEditable = isEditing;
                }

                return (
                  <div key={fieldKey} className="mb-6">
                    <div className="p-4 flex justify-around items-center w-full h-12">
                      <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                        {displayName}
                      </span>
                      {isFieldEditable ? (
                        fieldKey === "investment.investmentId" ? (
                          // Investment ID dropdown using React Select
                          <div className="w-1/2">
                            <Select
                              value={{
                                label: asset.investment.investmentId,
                                value: asset.investment.investmentId,
                              }}
                              onChange={handleInvestmentChange}
                              options={investments.map((inv) => ({
                                label: inv.investmentId,
                                value: inv.investmentId,
                              }))}
                              className="text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                              styles={{
                                control: (baseStyles) => ({
                                  ...baseStyles,
                                  backgroundColor: "#322323",
                                  borderColor: "#FF9321",
                                  color: "white",
                                }),
                                singleValue: (provided) => ({
                                  ...provided,
                                  color: "white",
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  backgroundColor: "#322323",
                                }),
                                option: (provided, state) => ({
                                  ...provided,
                                  backgroundColor: state.isFocused
                                    ? "#493939"
                                    : "#322323",
                                  color: "white",
                                }),
                              }}
                            />
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={fieldValue || ""}
                            onChange={(e) =>
                              handleChange(fieldKey, e.target.value)
                            }
                            className="w-1/2 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                          />
                        )
                      ) : (
                        <span className="w-1/2 text-md font-semibold text-white text-center">
                          {fieldValue || ""}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <TripsTable
            row={asset.trips}
            col={col}
            small={false}
            link={"/trip/"}
            clickable={true}
          />

          {/* Additional content like Trip History, Truck History, etc. */}
          {/* ... */}
        </div>
      </div>

      {/* Right section: Map (visible only on large screens) */}
      <div className="hidden lg:block lg:w-2/5 md:block md:w-2/5 bg-[#493939]">
        <div className="h-full w-full p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-4 text-[#FF9321] text-center">
            Current Location
          </h2>
          <div className="h-[calc(100%-40px)] w-full">
            <iframe
              className="w-full h-full rounded-md mt-4 mb-8 shadow-2xl justify center"
              title="Map"
              src="https://maps.google.com/maps?q=51.5074,0.1278&z=10&output=embed"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Asset;
