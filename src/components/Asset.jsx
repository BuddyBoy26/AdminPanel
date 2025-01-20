// src/components/Asset.jsx

import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { AdminContext } from "../contexts/AdminContext.jsx";
import Select from "react-select";
import TripsTable from "./TripsTable";
import assetReport from "../ui/assetReport.js";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteVerifier, setDeleteVerifier] = useState("");
  const [wialonData, setWialonData] = useState(null)

  // Define columns as an array of objects for TripsTable
  const columns = [
    { header: "To", accessor: "to" },
    { header: "From", accessor: "from" },
    { header: "Start Date", accessor: "startDate" },
    { header: "End Date", accessor: "endDate" },
  ];

  const wialonColumns = [
    { header: "Date", accessor: "date" },
    { header: "Time", accessor: "time" },
    { header: "Latitude", accessor: "x" },
    { header: "Longitude", accessor: "y" },
    { header: "Mileage", accessor: "mileage" },
    { header: "Ignition", accessor: "ignition" },
    { header: "Fuel", accessor: "fuel" },
    { header: "Event", accessor: "event" },
  ]

  useEffect(() => {
    // Fetch asset details
    const fetchAsset = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/assets/admin/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedAsset = response.data;

        // Initialize 'Wialon' field with "abc" if it doesn't exist
        if (!fetchedAsset.Wialon) {
          fetchedAsset.Wialon = "abc";
        }

        setAsset(fetchedAsset);
        setInitialAsset(fetchedAsset);
        console.log("Fetched Asset Data:", fetchedAsset); // Debugging Line
      } catch (error) {
        console.error("Error fetching asset:", error);
        toast.error("Failed to fetch asset details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchWialonData = async () => {
      setLoading(true);
      try {
        console.log("nokay")
        const response = await axiosInstance.get(`/assets/${id}/wialon`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedWialonData = response.data;


        // // Initialize 'Wialon' field with "abc" if it doesn't exist
        // if (!fetchedAsset.Wialon) {
        //   fetchedAsset.Wialon = "abc";
        // }

        setWialonData(fetchedWialonData.wialonDetails);
        // setInitialAsset(fetchedAsset);
        console.log("Fetched Wialon Data:", fetchedWialonData.wialonDetails); // Debugging Line
      } catch (error) {
        console.error("Error fetching Wialon Data:", error);
        toast.error("Failed to fetch Wialon Data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
    fetchWialonData();


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
        toast.error("Failed to fetch investments.");
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

  // Handle save (Update Asset)
  const handleSave = async () => {
    setIsEditing(false);
    try {
      const updatedFields = {};

      // Define which fields to track for changes
      const trackedFields = [
        "NumberPlate",
        "Type",
        "Brand",
        "Model",
        "Wialon", // Added Wialon to trackedFields
        "investment.investmentId",
      ];

      trackedFields.forEach((fieldKey) => {
        const newValue = getNestedValue(asset, fieldKey);
        const oldValue = getNestedValue(initialAsset, fieldKey);
        if (newValue !== oldValue) {
          setNestedValue(updatedFields, fieldKey, newValue);
        }
      });

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
      };

      await axiosInstance.patch(`/assets/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Asset updated successfully.");
      setInitialAsset(asset);
    } catch (error) {
      console.error("Error updating asset:", error);
      toast.error(error.response?.data?.error || "Failed to update asset.");
    }
  };

  // Handle delete (Toggle Deletion Confirmation)
  const handleDelete = () => {
    setIsDeleting(true);
  };

  const handleReport = async () => {
    assetReport(asset)
  };

  // Handle confirm delete with verifier
  const handleConfirmDelete = async () => {
    try {
      if (!deleteVerifier) {
        toast.error("Please select a verifier.");
        return;
      }

      await axiosInstance.delete(`/assets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { verifier: deleteVerifier, updateType: "delete" },
      });
      toast.success("Asset deleted successfully.");
      navigate("/assets");
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast.error(error.response?.data?.error || "Failed to delete asset.");
    } finally {
      setIsDeleting(false);
      setDeleteVerifier("");
    }
  };

  // Field labels and keys
  const fieldLabels = {
    NumberPlate: "Number Plate",
    Type: "Type",
    Brand: "Brand",
    Model: "Model",
    Wialon: "Wialon", // Added Wialon field
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

  // Determine if location data exists based on various possible structures
  const hasLocation =
    (asset.location && asset.location.latitude && asset.location.longitude) ||
    (asset.coordinates &&
      asset.coordinates.latitude &&
      asset.coordinates.longitude) || // Example alternative structure
    (asset.latitude && asset.longitude); // Top-level properties

  // Extract latitude and longitude based on available structure
  let latitude = null;
  let longitude = null;

  if (asset.location) {
    latitude = asset.location.latitude;
    longitude = asset.location.longitude;
  } else if (asset.coordinates) {
    latitude = asset.coordinates.latitude;
    longitude = asset.coordinates.longitude;
  } else if (asset.latitude && asset.longitude) {
    latitude = asset.latitude;
    longitude = asset.longitude;
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#322323]">
      {/* Left section: Asset information */}
      <div className="w-full lg:w-3/5 md:w-3/5 bg-[#322323] p-4 overflow-y-auto custom-scrollbar">
        {/* Asset Information Card */}
        <div className="bg-[#493939] rounded-lg shadow-md p-6 m-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-[#FF9321]">
              Asset Information
            </h2>
            <div>
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-md mr-2 bg-green-500 text-white hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="px-4 py-2 rounded-md mr-2 bg-[#FF9321] text-white hover:bg-[#e78c1c]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
            <div>
            <button
                onClick={handleReport}
                className="px-4 py-2 rounded-md bg-r-500 bg-[#FF9321] border border-[#FF9321] text-white hover:border-white"
              >
                Report
              </button>
            </div>
          </div>

          {/* Asset Fields */}
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(fieldLabels).map(([fieldKey, displayName]) => {
              const fieldValue = getNestedValue(asset, fieldKey);

              // Determine if the field is editable
              const isFieldEditable =
                isEditing && !uneditableFields.includes(fieldKey);

              return (
                <div
                  key={fieldKey}
                  className="flex justify-around items-center"
                >
                  <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                    {displayName}
                  </span>
                  {isFieldEditable ? (
                    fieldKey === "investment.investmentId" ? (
                      // Investment ID dropdown
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
                        className="w-1/2"
                        styles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            backgroundColor: "#493939",
                            borderColor: "#FF9321",
                            color: "white",
                          }),
                          singleValue: (provided) => ({
                            ...provided,
                            color: "white",
                          }),
                          menu: (provided) => ({
                            ...provided,
                            backgroundColor: "#493939",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isFocused
                              ? "#FF9321"
                              : "#493939",
                            color: "white",
                          }),
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={fieldValue || ""}
                        onChange={(e) => handleChange(fieldKey, e.target.value)}
                        className="w-1/2 p-2 text-md text-white bg-[#322323] border border-[#FF9321] rounded-lg"
                      />
                    )
                  ) : (
                    <span className="w-1/2 text-md font-semibold text-white text-center">
                      {fieldValue || ""}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Trips Table */}
          <h2 className="text-2xl font-bold text-[#FF9321] mt-7">
              Trips Table
            </h2>
          <TripsTable
            data={asset.trips || []} // Ensure data is an array
            columns={columns} // Use 'columns' as defined above
            small={false}
            clickable={true}
          />

          <h2 className="text-2xl font-bold text-[#FF9321] mt-7">
              Latest Location
            </h2>

          <TripsTable
            data={wialonData || []} // Ensure data is an array
            columns={wialonColumns} // Use 'columns' as defined above
            small={false}
            clickable={false}
          />
          
        </div>
      </div>

      {/* Right section: Map (visible only on large screens) */}
      <div className="hidden lg:block lg:w-2/5 bg-[#493939]">
        <div className="h-full w-full p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-4 text-[#FF9321] text-center">
            Current Location
          </h2>
          <div className="h-full w-full">
            {hasLocation ? (
              <iframe
                className="w-full h-full rounded-md shadow-2xl"
                title="Map"
                src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=10&output=embed`}
                allowFullScreen
                loading="lazy"
              ></iframe>
            ) : (
              <div className="flex justify-center items-center h-full text-white">
                Location data not available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#493939] rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <h3 className="text-xl font-bold mb-4 text-[#FF9321]">
              Confirm Deletion
            </h3>
            <div className="mb-4">
              <label className="block text-white mb-1 pl-1 font-bold">
                Select Verifier
              </label>
              <select
                value={deleteVerifier}
                onChange={(e) => setDeleteVerifier(e.target.value)}
                className="w-full p-2 text-md text-black rounded-lg"
              >
                <option value="">Select Verifier</option>
                {adminsList.map((adminItem) => (
                  <option key={adminItem._id} value={adminItem._id}>
                    {adminItem.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 mr-2"
                disabled={!deleteVerifier}
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Asset;
