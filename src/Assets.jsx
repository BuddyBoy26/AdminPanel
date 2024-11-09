import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TheTable from "./TheTable";
import axiosInstance from "../utils/axiosInstance";

const Assets = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);

  const col = [
    "S.No",
    "Number Plate",
    "Type",
    "Brand",
    "Model",
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

  const data = assets.map((asset, index) => ({
    SNo: index + 1,
    NumberPlate: asset.NumberPlate,
    Type: asset.Type,
    Brand: asset.Brand,
    Model: asset.Model,
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
      <TheTable
        row={data}
        col={col}
        small={false}
        link={"../asset/"}
        clickable={true}
      />
    </div>
  );
};

export default Assets;
