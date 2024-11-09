import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const CreateAsset = () => {
  const [assetInfo, setAssetInfo] = useState({
    NumberPlate: "",
    Type: "",
    Brand: "",
    Model: "",
    investment: "",
  });

  const [investments, setInvestments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axiosInstance.get("/investments");
        setInvestments(response.data);
      } catch (error) {
        console.error("Error fetching investments:", error);
      }
    };
    fetchInvestments();
  }, []);

  const handleChange = (field, value) => {
    setAssetInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/assets", assetInfo);
      console.log("Asset created successfully");
      navigate("/assets");
    } catch (error) {
      console.error("Error creating asset:", error);
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      <div className="flex justify-center w-full p-4 overflow-y-auto custom-scrollbar">
        <div className="w-3/5 bg-[#493939] rounded-lg shadow-md p-6 my-6 lg:m-6">
          <h2 className="text-4xl font-bold text-[#FF9321] mb-4">
            Create Asset
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 mt-4 w-full">
              <div className="flex items-center mb-4">
                <label className="w-1/3 text-lg font-semibold text-white">
                  Number Plate
                </label>
                <input
                  type="text"
                  value={assetInfo.NumberPlate}
                  onChange={(e) => handleChange("NumberPlate", e.target.value)}
                  className="w-2/3 p-2 text-black rounded-md"
                  placeholder="Enter Number Plate"
                />
              </div>
              <div className="flex items-center mb-4">
                <label className="w-1/3 text-lg font-semibold text-white">
                  Type
                </label>
                <input
                  type="text"
                  value={assetInfo.Type}
                  onChange={(e) => handleChange("Type", e.target.value)}
                  className="w-2/3 p-2 text-black rounded-md"
                  placeholder="Enter Type"
                />
              </div>
              <div className="flex items-center mb-4">
                <label className="w-1/3 text-lg font-semibold text-white">
                  Brand
                </label>
                <input
                  type="text"
                  value={assetInfo.Brand}
                  onChange={(e) => handleChange("Brand", e.target.value)}
                  className="w-2/3 p-2 text-black rounded-md"
                  placeholder="Enter Brand"
                />
              </div>
              <div className="flex items-center mb-4">
                <label className="w-1/3 text-lg font-semibold text-white">
                  Model
                </label>
                <input
                  type="text"
                  value={assetInfo.Model}
                  onChange={(e) => handleChange("Model", e.target.value)}
                  className="w-2/3 p-2 text-black rounded-md"
                  placeholder="Enter Model"
                />
              </div>
              <div className="flex items-center mb-4">
                <label className="w-1/3 text-lg font-semibold text-white">
                  Investment
                </label>
                <select
                  value={assetInfo.investment}
                  onChange={(e) => handleChange("investment", e.target.value)}
                  className="w-2/3 p-2 text-black rounded-md"
                >
                  <option value="">Select Investment</option>
                  {investments.map((inv) => (
                    <option key={inv._id} value={inv._id}>
                      {inv._id} - {inv.investorName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white font-bold"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAsset;
