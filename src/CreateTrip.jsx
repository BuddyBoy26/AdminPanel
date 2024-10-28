import React, { useState } from "react";

const CreateTrip = () => {
  const [tripInfo, setTripInfo] = useState({
    "Number Plate": "",
    "To": "",
    "From": "",
    "Start Date": "",
    "End Date": "",
  });

  const handleChange = (field, value) => {
    setTripInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting new trip info:", tripInfo);
    // Send tripInfo data to the backend or perform further actions
  };

  return (
    <div className="flex h-full">
      <div className="flex justify-center w-full h-full bg-gray-100 p-4 overflow-y-auto custom-scrollbar">
        <div className="w-3/5 bg-white rounded-lg shadow-md p-6 my-6 lg:m-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Create Trip</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 mt-4 ml-4 w-4/5 border border-black rounded-lg p-4">
              {Object.entries(tripInfo).map(([fieldKey, fieldValue]) => (
                <div key={fieldKey} className="mb-4">
                  <div className="p-4 flex justify-around items-center w-full h-12">
                    <label className="w-2/5 text-md font-bold text-center">{fieldKey}</label>
                    <input
                      type="text"
                      value={fieldValue}
                      onChange={(e) => handleChange(fieldKey, e.target.value)}
                      className="w-1/2 text-md font-semibold text-red-900 text-center border rounded-lg"
                      placeholder={`Enter ${fieldKey}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
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

export default CreateTrip;