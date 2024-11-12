// src/components/Trip.jsx

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import { toast } from "react-toastify";
import { AdminContext } from "../contexts/AdminContext.jsx"; // Import AdminContext

const Trip = () => {
  const { id } = useParams(); // Get trip ID from URL
  const navigate = useNavigate();
  const { admin, token } = useContext(AdminContext); // Access admin and token if needed
  const [tripInfo, setTripInfo] = useState(null);
  const [originalTripInfo, setOriginalTripInfo] = useState(null); // To track changes
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axios.get(`/trips/admin/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTripInfo(response.data);
        setOriginalTripInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trip:", error);
        toast.error("Failed to fetch trip details.");
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id, token]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (field, value) => {
    setTripInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Prepare the update payload
      const updatePayload = {};
      const allowedUpdates = [
        "NumberPlate",
        "to",
        "from",
        "startDate",
        "endDate",
      ];
      allowedUpdates.forEach((field) => {
        if (tripInfo[field] !== originalTripInfo[field]) {
          updatePayload[field] = tripInfo[field];
        }
      });

      if (Object.keys(updatePayload).length === 0) {
        toast.info("No changes to save.");
        setIsEditing(false);
        return;
      }

      // Add verifier selection logic if needed

      await axios.patch(`/trips/${id}`, updatePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Trip updated successfully.");
      setIsEditing(false);
      setOriginalTripInfo(tripInfo);
    } catch (error) {
      console.error("Error updating trip:", error);
      toast.error("Failed to update trip.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await axios.delete(`/trips/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Trip deleted successfully.");
        navigate("/trips");
      } catch (error) {
        console.error("Error deleting trip:", error);
        toast.error("Failed to delete trip.");
      }
    }
  };

  // Fields to exclude from display
  const excludedFields = ["_id", "createdAt", "updatedAt", "__v"];

  // Field labels mapping
  const fieldLabels = {
    NumberPlate: "Number Plate",
    startDate: "Start Date",
    endDate: "End Date",
    from: "From",
    to: "To",
    // Add more field mappings if necessary
  };

  // Function to format date fields
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#322323] text-white">
        Loading trip details...
      </div>
    );
  }

  if (!tripInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#322323] text-white">
        Trip not found.
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#322323]">
      <div className="flex justify-center w-full h-full bg-[#322323] p-4 overflow-y-auto custom-scrollbar">
        <div className="w-3/5 bg-[#493939] rounded-lg shadow-md p-5 my-6 lg:m-6 pr-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="ml-10 text-3xl font-bold text-[#FF9321]">
              Trip Information
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
              {Object.entries(tripInfo)
                .filter(([fieldKey]) => !excludedFields.includes(fieldKey))
                .map(([fieldKey, fieldValue]) => (
                  <div key={fieldKey} className="mb-6">
                    <div className="p-4 flex justify-around items-center w-full h-12">
                      <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                        {fieldLabels[fieldKey] ||
                          fieldKey.replace(/([A-Z])/g, " $1")}
                      </span>
                      {isEditing ? (
                        <input
                          type={
                            fieldKey.toLowerCase().includes("date")
                              ? "date"
                              : "text"
                          }
                          value={
                            fieldKey.toLowerCase().includes("date")
                              ? tripInfo[fieldKey]
                                ? new Date(tripInfo[fieldKey])
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                              : tripInfo[fieldKey] || ""
                          }
                          onChange={(e) =>
                            handleChange(fieldKey, e.target.value)
                          }
                          className="w-1/2 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                        />
                      ) : (
                        <span className="w-1/2 text-md font-semibold text-white text-center">
                          {fieldKey.toLowerCase().includes("date")
                            ? formatDate(fieldValue)
                            : fieldValue || ""}
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

export default Trip;
