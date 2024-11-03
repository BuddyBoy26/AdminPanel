// import React from "react";
// import UsersTable from "./UsersTable";
// import { Search } from "lucide-react";


// // Investor ID Name Email Agreed ROI


// const Users = () => {
  
//   const col = ["Investor ID", "Name", "Email", "Agreed ROI"];

//   const data = [
//     {
//       InvestorID: "I1",
//       Name: "Deepak Bhagchandani",
//       Email: "deepakpb@bhavya.ae",
//       AgreedROI: "100",
//     },
//     {
//       InvestorID: "I2",
//       Name: "Pritvik Premkumar Shanmuga",
//       Email: "pritvik@workspace.org",
//       AgreedROI: "25",
//     },
//     {
//       InvestorID: "I3",
//       Name: "Antariksh Jain",
//       Email: "antariksh@workspace.org",
//       AgreedROI: "25",
//     },
//     {
//       InvestorID: "I4",
//       Name: "Yashvardhan Das",
//       Email: "yashvardhan@workspace.org",
//       AgreedROI: "25",
//     },
//     {
//       InvestorID: "I5",
//       Name: "Sritoma Nandan",
//       Email: "sritoma@workspace.org",
//       AgreedROI: "25",
//     },
//   ];

//   return (
//     <div className="w-full flex flex-col bg-gray-100 min-h-[calc(100vh-64px)]">
//       <h1 className="w-full text-4xl text-center font-bold pb-4 pt-10">
//         Users
//       </h1>
//       <UsersTable row={data} col={col} small={false} clickable={true} />
//     </div>
//   );
// };

// export default Users;

import React from "react";
import { useNavigate } from "react-router-dom";
import TheTable from "./TheTable";
import { Search } from "lucide-react";

const Logbook = () => {
  const navigate = useNavigate();

  const col = ["Log No.", "Time", "Admin", "Action", "Unit"];
  const data = [
    {
      logNo: 1,
      time: "2023-10-31 08:30:00",
      admin: "Alice Johnson",
      action: "Create",
      unit: "Users",
    },
    {
      logNo: 2,
      time: "2023-10-31 09:00:00",
      admin: "Bob Williams",
      action: "Edit",
      unit: "Investments",
    },
    {
      logNo: 3,
      time: "2023-10-31 09:30:00",
      admin: "Charlie Davis",
      action: "Delete",
      unit: "Assets",
    },
    {
      logNo: 4,
      time: "2023-10-31 10:00:00",
      admin: "Diana Prince",
      action: "Create",
      unit: "Trips",
    },
    {
      logNo: 5,
      time: "2023-10-31 10:30:00",
      admin: "Ethan Hunt",
      action: "Edit",
      unit: "Users",
    },
    {
      logNo: 6,
      time: "2023-10-31 11:00:00",
      admin: "Fiona Gallagher",
      action: "Verify",
      unit: "Users",
    },
    {
      logNo: 7,
      time: "2023-10-31 11:30:00",
      admin: "George Miller",
      action: "Delete",
      unit: "Investments",
    },
    {
      logNo: 8,
      time: "2023-10-31 12:00:00",
      admin: "Hannah Lee",
      action: "Create",
      unit: "Assets",
    },
    {
      logNo: 9,
      time: "2023-10-31 12:30:00",
      admin: "Ian Wright",
      action: "Edit",
      unit: "Trips",
    },
    {
      logNo: 10,
      time: "2023-10-31 13:00:00",
      admin: "Julia Roberts",
      action: "Verify",
      unit: "Users",
    },
    {
      logNo: 11,
      time: "2023-10-31 13:30:00",
      admin: "Kevin Smith",
      action: "Create",
      unit: "Investments",
    },
    {
      logNo: 12,
      time: "2023-10-31 14:00:00",
      admin: "Laura Palmer",
      action: "Delete",
      unit: "Users",
    },
    {
      logNo: 13,
      time: "2023-10-31 14:30:00",
      admin: "Michael Scott",
      action: "Edit",
      unit: "Assets",
    },
    {
      logNo: 14,
      time: "2023-10-31 15:00:00",
      admin: "Nina Williams",
      action: "Verify",
      unit: "Users",
    },
    {
      logNo: 15,
      time: "2023-10-31 15:30:00",
      admin: "Oliver Queen",
      action: "Create",
      unit: "Trips",
    },
    {
      logNo: 16,
      time: "2023-10-31 16:00:00",
      admin: "Paula Abdul",
      action: "Edit",
      unit: "Investments",
    },
    {
      logNo: 17,
      time: "2023-10-31 16:30:00",
      admin: "Quentin Tarantino",
      action: "Delete",
      unit: "Trips",
    },
    {
      logNo: 18,
      time: "2023-10-31 17:00:00",
      admin: "Rachel Green",
      action: "Create",
      unit: "Assets",
    },
    {
      logNo: 19,
      time: "2023-10-31 17:30:00",
      admin: "Steve Rogers",
      action: "Verify",
      unit: "Users",
    },
    {
      logNo: 20,
      time: "2023-10-31 18:00:00",
      admin: "Tony Stark",
      action: "Edit",
      unit: "Users",  
    },
  ];
  

  const handleCreateUserClick = () => {
    navigate("/create/user");
  };

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      <div className="flex justify-center items-center w-full px-10 py-2 relative mt-5">
        <h1 className="text-4xl font-bold text-[#FF9321]">Logbook</h1>

      <button
          onClick={console.log("Downloaded Logbook")}
          className="absolute right-10 px-4 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white mr-48 font-bold inline-flex items-center"
      >
        <svg
          className="fill-current w-4 h-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
        </svg>
        <span>Download</span>
      </button>
  
      </div>
      <TheTable row={data} col={col} small={false} clickable={false} />
    </div>
  );
};

export default Logbook;
