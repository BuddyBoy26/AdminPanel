import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAsset = () => {
  const [assetInfo, setAssetInfo] = useState({
    "Number Plate": "",
    Type: "",
    Brand: "",
    Model: "",
  });

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setAssetInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting new asset info:", assetInfo);
    navigate("/assets");
    // Send assetInfo data to the backend or perform further actions
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
              {Object.entries(assetInfo).map(([fieldKey, fieldValue]) => (
                <div key={fieldKey} className="flex items-center mb-4">
                  <label className="w-1/3 text-lg font-semibold text-white">
                    {fieldKey}
                  </label>
                  <input
                    type="text"
                    value={fieldValue}
                    onChange={(e) => handleChange(fieldKey, e.target.value)}
                    className="w-2/3 p-2 text-black rounded-md"
                    placeholder={`Enter ${fieldKey}`}
                  />
                </div>
              ))}
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
