import React, { useState } from "react";

const Trip = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [tripInfo, setTripInfo] = useState({
    "Number Plate": "A12345",
    "To": "Jeddah, Saudi Arabia",
    "From": "Dubai, UAE",
    "Start Date": "22/10/2024",
    "End Date": "25/10/2024",
  });

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (field, value) => {
    setTripInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send the updated information to a backend
    console.log("Saving updated trip info:", tripInfo);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#322323]">
      <div className="flex justify-center w-full h-full bg-[#322323] p-4 overflow-y-auto custom-scrollbar">
        <div className="w-3/5 bg-[#493939] rounded-lg shadow-md p-5 my-6 lg:m-6 pr-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="ml-10 text-3xl font-bold text-[#FF9321]">Trip Information</h2>
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

          <div className="grid grid-cols-1 gap-0 mt-8 ml-4 w-full">
            <div className="border border-[#FF9321] rounded-lg p-4 mb-4">
              {Object.entries(tripInfo).map(([fieldKey, fieldValue]) => (
                <div key={fieldKey} className="mb-4">
                  <div className="p-4 flex justify-around items-center w-full h-12">
                    <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                      {fieldKey}
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={fieldValue}
                        onChange={(e) => handleChange(fieldKey, e.target.value)}
                        className="w-1/2 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                      />
                    ) : (
                      <span className="w-1/2 text-md font-semibold text-white text-center">
                        {fieldValue}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Trip;
