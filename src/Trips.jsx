import React from "react";
import { useNavigate } from "react-router-dom";
import TripsTable from "./TripsTable";
import TheTable from "./TheTable";

const Trips = () => {
  const navigate = useNavigate();

  const col = [
    "Trip No.",
    "Vehicle Number",
    "To",
    "From",
    "Start Date",
    "End Date",
  ];

  const data=[
    {"TripNumber": 1, "VehicleNumber": "ABC123", "To": "Riyadh, Saudi Arabia", "From": "Dubai, UAE", "StartDate": "2024-09-01", "EndDate": "2024-09-03"},
    {"TripNumber": 2, "VehicleNumber": "XYZ456", "To": "Muscat, Oman", "From": "Abu Dhabi, UAE", "StartDate": "2024-09-05", "EndDate": "2024-09-06"},
    {"TripNumber": 3, "VehicleNumber": "LMN789", "To": "Jeddah, Saudi Arabia", "From": "Doha, Qatar", "StartDate": "2024-09-10", "EndDate": "2024-09-12"},
    {"TripNumber": 4, "VehicleNumber": "PQR012", "To": "Cairo, Egypt", "From": "Riyadh, Saudi Arabia", "StartDate": "2024-09-15", "EndDate": "2024-09-18"},
    {"TripNumber": 5, "VehicleNumber": "STU345", "To": "Kuwait City, Kuwait", "From": "Manama, Bahrain", "StartDate": "2024-09-20", "EndDate": "2024-09-21"},
    {"TripNumber": 6, "VehicleNumber": "VWX678", "To": "Amman, Jordan", "From": "Beirut, Lebanon", "StartDate": "2024-09-22", "EndDate": "2024-09-23"},
    {"TripNumber": 7, "VehicleNumber": "YZA901", "To": "Damascus, Syria", "From": "Baghdad, Iraq", "StartDate": "2024-09-25", "EndDate": "2024-09-26"},
    {"TripNumber": 8, "VehicleNumber": "BCD234", "To": "Sanaa, Yemen", "From": "Muscat, Oman", "StartDate": "2024-09-27", "EndDate": "2024-09-29"},
    {"TripNumber": 9, "VehicleNumber": "EFG567", "To": "Tripoli, Libya", "From": "Tunis, Tunisia", "StartDate": "2024-09-30", "EndDate": "2024-10-01"},
    {"TripNumber": 10, "VehicleNumber": "HIJ890", "To": "Algiers, Algeria", "From": "Oran, Algeria", "StartDate": "2024-10-02", "EndDate": "2024-10-03"},
    {"TripNumber": 11, "VehicleNumber": "KLM123", "To": "Casablanca, Morocco", "From": "Marrakesh, Morocco", "StartDate": "2024-10-05", "EndDate": "2024-10-06"},
    {"TripNumber": 12, "VehicleNumber": "NOP456", "To": "Doha, Qatar", "From": "Manama, Bahrain", "StartDate": "2024-10-07", "EndDate": "2024-10-08"},
    {"TripNumber": 13, "VehicleNumber": "QRS789", "To": "Dubai, UAE", "From": "Muscat, Oman", "StartDate": "2024-10-09", "EndDate": "2024-10-10"},
    {"TripNumber": 14, "VehicleNumber": "TUV012", "To": "Jeddah, Saudi Arabia", "From": "Mecca, Saudi Arabia", "StartDate": "2024-10-12", "EndDate": "2024-10-12"},
    {"TripNumber": 15, "VehicleNumber": "WXY345", "To": "Riyadh, Saudi Arabia", "From": "Dammam, Saudi Arabia", "StartDate": "2024-10-13", "EndDate": "2024-10-14"},
    {"TripNumber": 16, "VehicleNumber": "ZAB678", "To": "Tunis, Tunisia", "From": "Algiers, Algeria", "StartDate": "2024-10-15", "EndDate": "2024-10-16"},
    {"TripNumber": 17, "VehicleNumber": "CDE901", "To": "Baghdad, Iraq", "From": "Tehran, Iran", "StartDate": "2024-10-17", "EndDate": "2024-10-18"},
    {"TripNumber": 18, "VehicleNumber": "FGH234", "To": "Khartoum, Sudan", "From": "Cairo, Egypt", "StartDate": "2024-10-19", "EndDate": "2024-10-21"},
    {"TripNumber": 19, "VehicleNumber": "IJK567", "To": "Beirut, Lebanon", "From": "Damascus, Syria", "StartDate": "2024-10-22", "EndDate": "2024-10-22"},
    {"TripNumber": 20, "VehicleNumber": "LMN890", "To": "Doha, Qatar", "From": "Dubai, UAE", "StartDate": "2024-10-23", "EndDate": "2024-10-24"}
];

  const handleCreateTripClick = () => {
    navigate("/create/trip");
  };

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      <div className="flex justify-center items-center w-full px-10 py-2 relative mt-5">
        <h1 className="text-4xl font-bold text-[#FF9321]">Trips</h1>
        <button
          onClick={handleCreateTripClick}
          className="absolute right-10 px-4 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white mr-48"
        >
          Create Trip
        </button>
      </div>
      <TheTable row={data} col={col} small={false} link={"../trip/"}clickable={true} />
    </div>
  );
};

export default Trips;
