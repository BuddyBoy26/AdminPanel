import React from "react";
import { useNavigate } from "react-router-dom";
import TheTable from "./TheTable";

const Assets = () => {
  const navigate = useNavigate();

  // Updated column headers with Investor Name and Investment ID
  const col = [
    "S.No",
    "Number Plate",
    "Type",
    "Brand",
    "Model",
    "Investor Name",
    "Investment ID",
  ];

  // Updated data with Investor Name and Investment ID
  const data = [
    {
      SNo: 1,
      NumberPlate: "ABC1234",
      Type: "Truck",
      Brand: "Volvo",
      Model: "FH16",
      InvestorName: "Alice Johnson",
      InvestmentID: "INV1001",
    },
    {
      SNo: 2,
      NumberPlate: "XYZ5678",
      Type: "Truck",
      Brand: "Mercedes",
      Model: "Arocs",
      InvestorName: "Bob Smith",
      InvestmentID: "INV1002",
    },
    {
      SNo: 3,
      NumberPlate: "LMN9101",
      Type: "Truck",
      Brand: "Toyota",
      Model: "Dyna",
      InvestorName: "Charlie Davis",
      InvestmentID: "INV1003",
    },
    {
      SNo: 4,
      NumberPlate: "PQR2345",
      Type: "Truck",
      Brand: "MAN",
      Model: "TGS",
      InvestorName: "Diana Evans",
      InvestmentID: "INV1004",
    },
    {
      SNo: 5,
      NumberPlate: "STU6789",
      Type: "Truck",
      Brand: "Nissan",
      Model: "UD Quon",
      InvestorName: "Ethan Foster",
      InvestmentID: "INV1005",
    },
    {
      SNo: 6,
      NumberPlate: "VWX1234",
      Type: "Truck",
      Brand: "Isuzu",
      Model: "FVR",
      InvestorName: "Fiona Green",
      InvestmentID: "INV1006",
    },
    {
      SNo: 7,
      NumberPlate: "YZA9012",
      Type: "Truck",
      Brand: "Hino",
      Model: "500 Series",
      InvestorName: "George Harris",
      InvestmentID: "INV1007",
    },
    {
      SNo: 8,
      NumberPlate: "BCD3456",
      Type: "Truck",
      Brand: "Freightliner",
      Model: "Cascadia",
      InvestorName: "Hannah Ingram",
      InvestmentID: "INV1008",
    },
    {
      SNo: 9,
      NumberPlate: "EFG7890",
      Type: "Truck",
      Brand: "Kenworth",
      Model: "T680",
      InvestorName: "Ian Jackson",
      InvestmentID: "INV1009",
    },
    {
      SNo: 10,
      NumberPlate: "HIJ1234",
      Type: "Truck",
      Brand: "Peterbilt",
      Model: "579",
      InvestorName: "Julia King",
      InvestmentID: "INV1010",
    },
    {
      SNo: 11,
      NumberPlate: "KLM5678",
      Type: "Truck",
      Brand: "Mack",
      Model: "Anthem",
      InvestorName: "Kevin Lee",
      InvestmentID: "INV1011",
    },
    {
      SNo: 12,
      NumberPlate: "NOP9101",
      Type: "Truck",
      Brand: "Scania",
      Model: "R Series",
      InvestorName: "Laura Martinez",
      InvestmentID: "INV1012",
    },
    {
      SNo: 13,
      NumberPlate: "QRS2345",
      Type: "Truck",
      Brand: "Iveco",
      Model: "Stralis",
      InvestorName: "Michael Nelson",
      InvestmentID: "INV1013",
    },
    {
      SNo: 14,
      NumberPlate: "TUV6789",
      Type: "Truck",
      Brand: "Hino",
      Model: "700 Series",
      InvestorName: "Nina Owens",
      InvestmentID: "INV1014",
    },
    {
      SNo: 15,
      NumberPlate: "WXY1234",
      Type: "Truck",
      Brand: "Daf",
      Model: "XF",
      InvestorName: "Oliver Perez",
      InvestmentID: "INV1015",
    },
    {
      SNo: 16,
      NumberPlate: "ZAB5678",
      Type: "Truck",
      Brand: "Renault",
      Model: "Gamme T",
      InvestorName: "Paula Quinn",
      InvestmentID: "INV1016",
    },
    {
      SNo: 17,
      NumberPlate: "CDE9101",
      Type: "Truck",
      Brand: "Ford",
      Model: "F-Series",
      InvestorName: "Quentin Ross",
      InvestmentID: "INV1017",
    },
    {
      SNo: 18,
      NumberPlate: "FGH2345",
      Type: "Truck",
      Brand: "GMC",
      Model: "Sierra",
      InvestorName: "Rachel Scott",
      InvestmentID: "INV1018",
    },
    {
      SNo: 19,
      NumberPlate: "IJK6789",
      Type: "Truck",
      Brand: "Chevrolet",
      Model: "Silverado",
      InvestorName: "Samuel Thompson",
      InvestmentID: "INV1019",
    },
    {
      SNo: 20,
      NumberPlate: "LMN9012",
      Type: "Truck",
      Brand: "Volkswagen",
      Model: "Crafter",
      InvestorName: "Tina Underwood",
      InvestmentID: "INV1020",
    },
  ];

  const handleCreateAssetClick = () => {
    navigate("/create/asset");
  };

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      <div className="flex justify-center items-center w-full px-10 py-2 relative mt-5">
        <h1 className="text-4xl font-bold text-[#FF9321]">Assets</h1>
        <button
          onClick={handleCreateAssetClick}
          className="absolute right-10 px-4 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white mr-48"
        >
          Create Asset
        </button>
      </div>
      <TheTable
        row={data}
        col={col}
        small={false}
        link={"../asset/"}
        clickable={true}
      />
    </div>
  );
};

export default Assets;
