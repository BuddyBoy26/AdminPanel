import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const LogTable1 = () => {
  const data = [
    {
      time: "08:00",
      truck: "T-001",
      location: "Warehouse A",
      speed: "45 mph",
      tripNumber: "TR-1001",
    },
    {
      time: "09:15",
      truck: "T-002",
      location: "Route 66",
      speed: "55 mph",
      tripNumber: "TR-1002",
    },
    {
      time: "10:30",
      truck: "T-003",
      location: "City Center",
      speed: "30 mph",
      tripNumber: "TR-1003",
    },
    {
      time: "11:45",
      truck: "T-004",
      location: "Highway 101",
      speed: "65 mph",
      tripNumber: "TR-1004",
    },
    {
      time: "13:00",
      truck: "T-005",
      location: "Warehouse B",
      speed: "0 mph",
      tripNumber: "TR-1005",
    },
    {
      time: "14:15",
      truck: "T-006",
      location: "Main Street",
      speed: "25 mph",
      tripNumber: "TR-1006",
    },
    {
      time: "15:30",
      truck: "T-007",
      location: "Industrial Park",
      speed: "35 mph",
      tripNumber: "TR-1007",
    },
    {
      time: "16:45",
      truck: "T-008",
      location: "Suburb Area",
      speed: "40 mph",
      tripNumber: "TR-1008",
    },

  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-white bg-custom-darkest">
          <thead>
            <tr className="bg-custom-darkest text-white">
            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Log No.</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Time</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Admin</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Action</th>
              {/* Action / Unit >> CEDV, User, Asset, Trip, Investment*/}
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Unit</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#656565]">
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-[#404040]' : 'bg-[#555555]'}>
                <td className="px-4 py-2 whitespace-nowrap">{item.time}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.truck}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.location}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.speed}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.tripNumber}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.tripNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const LogTable = ({row, col}) => {

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="shadow-2xl rounded-lg overflow-hidden border-b border-[#656565] w-full">
        <table className="w-full text-sm">
          <thead className="bg-[#201010] text-[#FF9321]">
            <tr>
              {col.map((item, index) => (
                <th
                  key={index}
                  className="font-medium text-left text-xs px-4 py-2"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {row.map((r, index) => (
              <tr
                key={index}
                className={`border-b border-[#6B5A5A] font-medium text-left text-s ${
                  index % 2 === 0 ? "bg-[#4B3F3F]" : "bg-[#5A4A4A]"
                }`}
              >
                {Object.values(r).map((value, idx) => (
                  <td
                    key={idx}
                    className="px-4 py-2 text-left text-white"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogTable;