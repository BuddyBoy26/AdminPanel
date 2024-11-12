// src/components/Assets.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AssetsTable from "./AssetsTable";
import axiosInstance from "../api/axios";

const Assets = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);

  const col = [
    "SNo",
    "Number Plate",
    "Investment ID",
    "Type",
    "Brand",
    "Model",
    "Investor",
  ];

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axiosInstance.get("/assets");
        setAssets(response.data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    fetchAssets();
  }, []);

  const handleCreateAssetClick = () => {
    navigate("/create/asset");
  };

  // Include the asset ID in the data but don't include it in the columns
  const data = assets.map((asset, index) => ({
    id: asset._id, // Ensure this matches your backend's ID field
    SNo: index + 1,
    InvestmentID: asset.investment.investmentId,
    NumberPlate: asset.NumberPlate,
    Type: asset.Type,
    Brand: asset.Brand,
    Model: asset.Model,
    Investor: asset.investment.investor.name,
  }));

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      <div className="flex justify-center items-center w-full px-10 py-2 relative mt-5">
        <h1 className="text-4xl font-bold text-[#FF9321]">Assets</h1>
        <button
          onClick={handleCreateAssetClick}
          className="absolute right-10 px-4 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white mr-48"
        >
          Create Asset
        </button>
      </div>
      <AssetsTable
        row={data}
        col={col}
        small={false}
        link="/asset/" // Base path for asset detail
        clickable={true}
      />
    </div>
  );
};

export default Assets;
