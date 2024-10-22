import React from "react";
import AssetsTable from "./AssetsTable";
import { Search } from "lucide-react";

const Assets = () => {
  const col = ["S.No", "Number plate", "Type", "Brand", "Model", "Value added"];
  const data = [
    {
      SNo: 1,
      NumberPlate: "ABC1234",
      Type: "Truck",
      Brand: "Volvo",
      Model: "FH16",
      ValueAdded: 25000,
    },
    {
      SNo: 2,
      NumberPlate: "XYZ5678",
      Type: "Truck",
      Brand: "Mercedes",
      Model: "Arocs",
      ValueAdded: 30000,
    },
    {
      SNo: 3,
      NumberPlate: "LMN9101",
      Type: "Truck",
      Brand: "Toyota",
      Model: "Dyna",
      ValueAdded: 22000,
    },
    {
      SNo: 4,
      NumberPlate: "PQR2345",
      Type: "Truck",
      Brand: "MAN",
      Model: "TGS",
      ValueAdded: 35000,
    },
    {
      SNo: 5,
      NumberPlate: "STU6789",
      Type: "Truck",
      Brand: "Nissan",
      Model: "UD Quon",
      ValueAdded: 45000,
    },
    {
      SNo: 6,
      NumberPlate: "VWX1234",
      Type: "Truck",
      Brand: "Isuzu",
      Model: "FVR",
      ValueAdded: 28000,
    },
    {
      SNo: 7,
      NumberPlate: "YZA9012",
      Type: "Truck",
      Brand: "Hino",
      Model: "500 Series",
      ValueAdded: 36000,
    },
    {
      SNo: 8,
      NumberPlate: "BCD3456",
      Type: "Truck",
      Brand: "Freightliner",
      Model: "Cascadia",
      ValueAdded: 24000,
    },
    {
      SNo: 9,
      NumberPlate: "EFG7890",
      Type: "Truck",
      Brand: "Kenworth",
      Model: "T680",
      ValueAdded: 40000,
    },
    {
      SNo: 10,
      NumberPlate: "HIJ1234",
      Type: "Truck",
      Brand: "Peterbilt",
      Model: "579",
      ValueAdded: 29000,
    },
    {
      SNo: 11,
      NumberPlate: "KLM5678",
      Type: "Truck",
      Brand: "Mack",
      Model: "Anthem",
      ValueAdded: 25000,
    },
    {
      SNo: 12,
      NumberPlate: "NOP9101",
      Type: "Truck",
      Brand: "Scania",
      Model: "R Series",
      ValueAdded: 47000,
    },
    {
      SNo: 13,
      NumberPlate: "QRS2345",
      Type: "Truck",
      Brand: "Iveco",
      Model: "Stralis",
      ValueAdded: 32000,
    },
    {
      SNo: 14,
      NumberPlate: "TUV6789",
      Type: "Truck",
      Brand: "Hino",
      Model: "700 Series",
      ValueAdded: 37000,
    },
    {
      SNo: 15,
      NumberPlate: "WXY1234",
      Type: "Truck",
      Brand: "Daf",
      Model: "XF",
      ValueAdded: 43000,
    },
    {
      SNo: 16,
      NumberPlate: "ZAB5678",
      Type: "Truck",
      Brand: "Renault",
      Model: "Gamme T",
      ValueAdded: 39000,
    },
    {
      SNo: 17,
      NumberPlate: "CDE9101",
      Type: "Truck",
      Brand: "Ford",
      Model: "F-Series",
      ValueAdded: 26000,
    },
    {
      SNo: 18,
      NumberPlate: "FGH2345",
      Type: "Truck",
      Brand: "GMC",
      Model: "Sierra",
      ValueAdded: 28000,
    },
    {
      SNo: 19,
      NumberPlate: "IJK6789",
      Type: "Truck",
      Brand: "Chevrolet",
      Model: "Silverado",
      ValueAdded: 30000,
    },
    {
      SNo: 20,
      NumberPlate: "LMN9012",
      Type: "Truck",
      Brand: "Volkswagen",
      Model: "Crafter",
      ValueAdded: 44000,
    },
  ];
  return (
    <div className="w-full flex flex-col bg-gray-100 min-h-[calc(100vh-64px)]">
      <h1 className="w-full text-4xl text-center font-bold pb-4 pt-10">
        Assets
      </h1>
      <AssetsTable row={data} col={col} small={false} clickable={true} />
    </div>
  );
};

export default Assets;
