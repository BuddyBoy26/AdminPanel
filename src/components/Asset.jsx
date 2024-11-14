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

  // Define columns with header and accessor keys
  const columns = [
    { header: "To", accessor: "to" },
    { header: "From", accessor: "from" },
    { header: "Start Date", accessor: "startDate" },
    { header: "End Date", accessor: "endDate" },
  ];

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

  // ... (rest of your useEffect hooks and functions remain the same)

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
          {/* ... (rest of your asset information card) */}

          {/* Trips Table */}
          <TripsTable
            data={asset.trips || []} // Ensure data is an array
            columns={columns}
            small={false}
            clickable={true}
          />

          {/* ... (additional content) */}
        </div>
      </div>

      {/* Right section: Map */}
      {/* ... (your map code remains the same) */}
    </div>
  );
};

export default Asset;
