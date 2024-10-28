import React from "react";
import { useNavigate } from "react-router-dom";
import AssetsTable from "./AssetsTable";
import { Search } from "lucide-react";

const Assets = () => {
  const navigate = useNavigate();

  const col = ["S.No", "Number Plate", "Type", "Brand", "Model"];
  const data = [
    { SNo: 1, NumberPlate: "ABC1234", Type: "Truck", Brand: "Volvo", Model: "FH16" },
    { SNo: 2, NumberPlate: "XYZ5678", Type: "Truck", Brand: "Mercedes", Model: "Arocs" },
    { SNo: 3, NumberPlate: "LMN9101", Type: "Truck", Brand: "Toyota", Model: "Dyna" },
    { SNo: 4, NumberPlate: "PQR2345", Type: "Truck", Brand: "MAN", Model: "TGS" },
    { SNo: 5, NumberPlate: "STU6789", Type: "Truck", Brand: "Nissan", Model: "UD Quon" },
    { SNo: 6, NumberPlate: "VWX1234", Type: "Truck", Brand: "Isuzu", Model: "FVR" },
    { SNo: 7, NumberPlate: "YZA9012", Type: "Truck", Brand: "Hino", Model: "500 Series" },
    { SNo: 8, NumberPlate: "BCD3456", Type: "Truck", Brand: "Freightliner", Model: "Cascadia" },
    { SNo: 9, NumberPlate: "EFG7890", Type: "Truck", Brand: "Kenworth", Model: "T680" },
    { SNo: 10, NumberPlate: "HIJ1234", Type: "Truck", Brand: "Peterbilt", Model: "579" },
    { SNo: 11, NumberPlate: "KLM5678", Type: "Truck", Brand: "Mack", Model: "Anthem" },
    { SNo: 12, NumberPlate: "NOP9101", Type: "Truck", Brand: "Scania", Model: "R Series" },
    { SNo: 13, NumberPlate: "QRS2345", Type: "Truck", Brand: "Iveco", Model: "Stralis" },
    { SNo: 14, NumberPlate: "TUV6789", Type: "Truck", Brand: "Hino", Model: "700 Series" },
    { SNo: 15, NumberPlate: "WXY1234", Type: "Truck", Brand: "Daf", Model: "XF" },
    { SNo: 16, NumberPlate: "ZAB5678", Type: "Truck", Brand: "Renault", Model: "Gamme T" },
    { SNo: 17, NumberPlate: "CDE9101", Type: "Truck", Brand: "Ford", Model: "F-Series" },
    { SNo: 18, NumberPlate: "FGH2345", Type: "Truck", Brand: "GMC", Model: "Sierra" },
    { SNo: 19, NumberPlate: "IJK6789", Type: "Truck", Brand: "Chevrolet", Model: "Silverado" },
    { SNo: 20, NumberPlate: "LMN9012", Type: "Truck", Brand: "Volkswagen", Model: "Crafter" },
  ];

  const handleCreateAssetClick = () => {
    navigate("/create/asset");
  };

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      <div className="flex justify-center items-center w-full px-10 py-2 relative mt-5">
        <h1 className="text-4xl font-bold text-[#FF9321]">Assets</h1>
      </div>
      <AssetsTable row={data} col={col} small={false} clickable={true} />
    </div>
  );
};

export default Assets;
