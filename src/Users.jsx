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
import UsersTable from "./UsersTable";
import { Search } from "lucide-react";

const Users = () => {
  const navigate = useNavigate();

  const col = ["Investor ID", "Name", "Email", "Agreed ROI"];
  const data = [
    {
      InvestorID: "I1",
      Name: "Deepak Bhagchandani",
      Email: "deepakpb@bhavya.ae",
      AgreedROI: "100",
    },
    {
      InvestorID: "I2",
      Name: "Pritvik Premkumar Shanmuga",
      Email: "pritvik@workspace.org",
      AgreedROI: "25",
    },
    {
      InvestorID: "I3",
      Name: "Antariksh Jain",
      Email: "antariksh@workspace.org",
      AgreedROI: "25",
    },
    {
      InvestorID: "I4",
      Name: "Yashvardhan Das",
      Email: "yashvardhan@workspace.org",
      AgreedROI: "25",
    },
    {
      InvestorID: "I5",
      Name: "Sritoma Nandan",
      Email: "sritoma@workspace.org",
      AgreedROI: "25",
    },
  ];

  const handleCreateUserClick = () => {
    navigate("/create/user");
  };

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      <div className="flex justify-center items-center w-full px-10 py-2 relative mt-5">
        <h1 className="text-4xl font-bold text-[#FF9321]">Users</h1>
        <button
          onClick={handleCreateUserClick}
          className="absolute right-10 px-4 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white mr-48"
        >
          Create User
        </button>
      </div>
      <UsersTable row={data} col={col} small={false} clickable={true} />
    </div>
  );
};

export default Users;
