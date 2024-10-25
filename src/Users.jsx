import React from "react";
import UsersTable from "./UsersTable";
import { Search } from "lucide-react";


// Investor ID Name Email Agreed ROI


const Users = () => {
  
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

  return (
    <div className="w-full flex flex-col bg-gray-100 min-h-[calc(100vh-64px)]">
      <h1 className="w-full text-4xl text-center font-bold pb-4 pt-10">
        Users
      </h1>
      <UsersTable row={data} col={col} small={false} clickable={true} />
    </div>
  );
};

export default Users;
