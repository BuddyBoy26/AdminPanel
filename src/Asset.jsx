import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TheTable from "./TheTable";
import axiosInstance from "../utils/axiosInstance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Asset = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState(null);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const response = await axiosInstance.get(`/assets/admin/${id}`);
        setVehicleInfo(response.data);
      } catch (error) {
        console.error("Error fetching asset:", error);
      }
    };
    fetchAsset();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (key, value) => {
    setVehicleInfo((prevInfo) => ({
      ...prevInfo,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      await axiosInstance.patch(`/assets/${id}`, vehicleInfo);
      console.log("Asset updated successfully");
    } catch (error) {
      console.error("Error updating asset:", error);
    }
  };

  if (!vehicleInfo) {
    return <div>Loading...</div>;
  }

  const displayFields = [
    { label: "Number Plate", key: "NumberPlate" },
    { label: "Type", key: "Type" },
    { label: "Brand", key: "Brand" },
    { label: "Model", key: "Model" },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#322323]">
      {/* Left section: Vehicle information and tables */}
      <div className="w-full lg:w-3/5 md:w-3/5  bg-[#322323] p-4 overflow-y-auto custom-scrollbar">
        {/* Vehicle Information Card */}
        <div className="bg-[#493939] rounded-lg shadow-md p-6 m-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-[#FF9321] ml-10">
              Vehicle Information
            </h2>
            <button
              onClick={isEditing ? handleSave : handleEdit}
              className={`px-4 py-2 rounded-md ${
                isEditing
                  ? "bg-green-500 border text-white hover:border-white"
                  : "bg-[#FF9321] border border-[#FF9321] text-white hover:border-white"
              }`}
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:m-6 my-6">
            {displayFields.map(({ label, key }) => (
              <div
                key={key}
                className="p-4 border border-[#FF9321] rounded-lg flex flex-col"
              >
                <span className="text-lg font-bold text-center text-[#FF9321]">
                  {label}
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={vehicleInfo[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="text-xl font-semibold text-white text-center p-2 border rounded bg-[#322323] border-[#FF9321]"
                  />
                ) : (
                  <span className="text-xl font-semibold text-white text-center p-2">
                    {vehicleInfo[key]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional content like Trip History, Truck History, etc. */}
        {/* ... */}
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
