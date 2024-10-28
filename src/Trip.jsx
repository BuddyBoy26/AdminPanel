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
    <div className="flex h-full">
      <div className="flex justify-center w-full h-full bg-gray-100 p-4 overflow-y-auto custom-scrollbar">
        <div className="w-3/5 bg-white rounded-lg shadow-md p-6 my-6 lg:m-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="ml-10 text-3xl font-bold text-gray-800">Trip Information</h2>
            <button
              onClick={isEditing ? handleSave : handleEdit}
              className={`px-4 py-2 rounded-md ${
                isEditing ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-0 mt-8 ml-4 w-1/2 border border-black rounded-lg pt-4">
            {Object.entries(tripInfo).map(([fieldKey, fieldValue]) => (
              <div key={fieldKey} className="mb-4">
                <div className="p-4 flex justify-around items-center w-full h-12">
                  <span className="w-2/5 text-md font-bold text-center">{fieldKey}</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={fieldValue}
                      onChange={(e) => handleChange(fieldKey, e.target.value)}
                      className="w-1/2 text-md font-semibold text-red-900 text-center border rounded-lg"
                    />
                  ) : (
                    <span className="w-1/2 text-md font-semibold text-red-900 text-center">
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
  );
};

export default Trip;
