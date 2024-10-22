import React from "react";

const StatsTable = () => {
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
    {
      time: "18:00",
      truck: "T-009",
      location: "Downtown",
      speed: "20 mph",
      tripNumber: "TR-1009",
    },
    {
      time: "19:15",
      truck: "T-010",
      location: "Port Area",
      speed: "30 mph",
      tripNumber: "TR-1010",
    },
    {
      time: "20:30",
      truck: "T-011",
      location: "Warehouse C",
      speed: "0 mph",
      tripNumber: "TR-1011",
    },
    {
      time: "21:45",
      truck: "T-012",
      location: "Night Route",
      speed: "50 mph",
      tripNumber: "TR-1012",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm bg-white">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Time</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Truck</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Location</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Speed</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">Trip Number</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-2 whitespace-nowrap">{item.time}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.truck}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.location}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.speed}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.tripNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsTable;