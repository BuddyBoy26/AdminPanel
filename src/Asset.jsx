import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TheTable from "./TheTable";
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
  const [isEditing, setIsEditing] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState({
    "Number Plate": "A12345",
    Type: "Flatbed",
    Brand: "Volvo",
    Model: "FMX2019",
    "Investor Name": "Alice Johnson", // New Field
    "Investment ID": "INV1001",        // New Field
  });

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (key, value) => {
    setVehicleInfo((prevInfo) => ({
      ...prevInfo,
      [key]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send the updated information to a backend
    console.log("Saving updated vehicle info:", vehicleInfo);
  };

  const TripsColumn = ["Trip Number", "To", "From", "Start Date", "End Date"];
  const TripsRow = [
    {
      TripNumber: 1,
      To: "Riyadh, Saudi Arabia",
      From: "Dubai, UAE",
      StartDate: "2024-09-01",
      EndDate: "2024-09-03",
    },
    // ... (other trip data remains unchanged)
    {
      TripNumber: 20,
      To: "Doha, Qatar",
      From: "Dubai, UAE",
      StartDate: "2024-10-23",
      EndDate: "2024-10-24",
    },
  ];

  const TruckHistoryRow = [
    {
      Time: "2024-09-01 08:00",
      Speed: 65,
      Location: "Dubai, UAE",
      Ignition: "ON",
      Fuel: 300,
    },
    // ... (other truck history data remains unchanged)
    {
      Time: "2024-10-07 04:30",
      Speed: 65,
      Location: "Manama, Bahrain",
      Ignition: "ON",
      Fuel: 125,
    },
  ];

  const TruckHistoryColumn = ["Time", "Speed", "Location", "Ignition", "Fuel"];

  const fuelData = [
    { date: "2024-09-01", fuel: 300 },
    { date: "2024-09-02", fuel: 200 },
    { date: "2024-09-03", fuel: 250 },
    { date: "2024-09-04", fuel: 220 },
    { date: "2024-09-05", fuel: 190 },
    { date: "2024-09-06", fuel: 160 },
    { date: "2024-09-07", fuel: 130 },
  ];

  return (
//     <div className="flex flex-col min-h-screen bg-[#322323]">
//       <div className="flex flex-col lg:flex-row flex-grow">
//         {/* Left Section */}
//         <div className="w-full lg:w-3/5 bg-[#322323] p-4 overflow-y-auto custom-scrollbar">
//           {/* Vehicle Information Card */}
//           <div className="bg-[#493939] rounded-lg shadow-md p-6 my-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-3xl font-bold text-[#FF9321] ml-10">
//                 Vehicle Information
//               </h2>
//               <button
//                 onClick={isEditing ? handleSave : handleEdit}
//                 className={`px-4 py-2 rounded-md ${
//                   isEditing
//                     ? "bg-green-500 border text-white hover:border-white"
//                     : "bg-[#FF9321] border border-[#FF9321] text-white hover:border-white"
//                 }`}
//               >
//                 {isEditing ? "Save" : "Edit"}
//               </button>
//             </div>
//             <div className="grid grid-cols-2 gap-6 lg:m-6 my-6">
//               {Object.entries(vehicleInfo).map(([key, value]) => (
//                 <div
//                   key={key}
//                   className="p-4 border border-[#FF9321] rounded-lg flex flex-col"
//                 >
//                   <span className="text-lg font-bold text-center text-[#FF9321]">
//                     {key}
//                   </span>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       value={value}
//                       onChange={(e) => handleChange(key, e.target.value)}
//                       className="text-xl font-semibold text-white text-center p-2 border rounded bg-[#322323] border-[#FF9321]"
//                     />
//                   ) : (
//                     <span className="text-xl font-semibold text-white text-center p-2">
//                       {value}
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Truck History Table */}
//           <div className="bg-[#493939] rounded-lg shadow-md py-6 my-6">
//             <h2 className="text-3xl font-bold mb-4 text-[#FF9321] text-center">
//               Truck History
//             </h2>
//             <TheTable
//               col={TruckHistoryColumn}
//               row={TruckHistoryRow}
//             />
//           </div>

//           {/* Trip History Table */}
//           <div className="bg-[#493939] rounded-lg shadow-md py-6 my-6">
//             <div className="flex justify-between items-center mb-4 px-6">
//               <h2 className="text-3xl font-bold text-[#FF9321]">Trip History</h2>
//               <button
//                 onClick={() => console.log("Create Trip clicked")}
//                 className="bg-[#FF9321] hover:bg-[#e6811e] text-white px-4 py-2 rounded-md border border-[#FF9321]"
//               >
//                 Create Trip
//               </button>
//             </div>
//             <TheTable col={TripsColumn} row={TripsRow} />
//           </div>

//           {/* Fuel Chart */}
//           <div className="bg-[#493939] rounded-lg shadow-md p-6 my-6">
//             <h2 className="text-3xl font-bold mb-4 text-[#FF9321] text-center">
//               Fuel Chart
//             </h2>
//             <div style={{ width: "100%", height: 300 }}>
//               <ResponsiveContainer>
//                 <LineChart data={fuelData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line dataKey="fuel" stroke="#FF9321" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* Right Section: Map */}
//         <div className="w-full lg:w-2/5 bg-[#493939] p-4">
//           <div className="h-full w-full p-6 flex flex-col">
//             <h2 className="text-3xl font-bold mb-4 text-[#FF9321] text-center">
//               Current Location
//             </h2>
//             <div className="h-[calc(100%-80px)] w-full">
//               <iframe
//                 className="w-full h-full rounded-md mt-4 mb-8 shadow-2xl"
//                 title="Map"
//                 src="https://maps.google.com/maps?q=51.5074,0.1278&z=10&output=embed"
//               ></iframe>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Asset;

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
              {Object.entries(vehicleInfo).map(([key, value]) => (
                <div
                  key={key}
                  className="p-4 border border-[#FF9321] rounded-lg flex flex-col"
                >
                  <span className="text-lg font-bold text-center text-[#FF9321]">
                    {key}
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="text-xl font-semibold text-white text-center p-2 border rounded bg-[#322323] border-[#FF9321]"
                    />
                  ) : (
                    <span className="text-xl font-semibold text-white text-center p-2">
                      {value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

      <div className="bg-[#493939] rounded-lg p-6 my-6 lg:m-6 lg:hidden md:hidden">
        <h2 className="text-2xl font-bold mb-4 text-[#FF9321] text-center bg-[#493939]">
          Current Location
        </h2>
        <div className="w-full h-[300px] ">
          <iframe
            className="w-full h-full rounded-lg"
            title="Map"
            src="https://maps.google.com/maps?q=51.5074,0.1278&z=10&output=embed"
          ></iframe>
        </div>
      </div>
      {/* Truck History Table */}
      <div className="bg-[#493939] rounded-lg shadow-md py-6 my-6 lg:m-6">
        <h2 className="text-2xl font-bold lg:mb-4 text-[#FF9321] text-center">
          Truck History
        </h2>
        <TheTable
          col={TruckHistoryColumn}
          row={TruckHistoryRow}
          small={true}
        />
      </div>

      {/* Trip History Table */}
         <div className="bg-[#493939] rounded-lg shadow-md py-6 m-6">
             <div className="flex justify-between items-center mb-4 px-6">
               <h2 className="text-3xl font-bold text-[#FF9321]">Trip History</h2>
               <button
                onClick={() => console.log("Create Trip clicked")}
                className="bg-[#FF9321]  text-white px-4 py-2 rounded-md border border-[#FF9321] hover:border-white"
              >
                Create Trip
              </button>
            </div>
            <TheTable col={TripsColumn} row={TripsRow} />
          </div>

      {/* New Fuel Chart Card */}
      <div className="bg-[#493939] rounded-lg shadow-md p-6 my-6 lg:m-6">
        <h2 className="text-2xl font-bold mb-4 text-[#FF9321] text-center">
          Fuel Chart
        </h2>
        <div className="text-white" style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={fuelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="fuel" stroke="#FF9321" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* Right section: Map (visible only on large screens) */}
    <div
      className="hidden lg:block lg:w-2/5 md:block md:w-2/5 bg-[#493939]"
    >
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

