import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { jsPDF } from 'jspdf';
import StatsTable from './StatsTable';
import LogTable from './LogTable';
import TheTable from './TheTable';

const Investment = () => {

  const logcol = ["Log No.", "Time", "Admin", "Action", "Unit"]
  const statscol = ["Time", "Truck", "Location", "Speed", "Trip Number"]

  const logrow = [
    { time: "08:00", truck: "T-001", location: "Warehouse A", speed: "45 mph", tripNumber: "TR-1001" },
    { time: "09:15", truck: "T-002", location: "Route 66", speed: "55 mph", tripNumber: "TR-1002" },
    { time: "10:30", truck: "T-003", location: "City Center", speed: "30 mph", tripNumber: "TR-1003" },
    { time: "11:45", truck: "T-004", location: "Highway 101", speed: "65 mph", tripNumber: "TR-1004" },
    { time: "13:00", truck: "T-005", location: "Warehouse B", speed: "0 mph", tripNumber: "TR-1005" },
    { time: "14:15", truck: "T-006", location: "Main Street", speed: "25 mph", tripNumber: "TR-1006" },
    { time: "15:30", truck: "T-007", location: "Industrial Park", speed: "35 mph", tripNumber: "TR-1007" },
    { time: "16:45", truck: "T-008", location: "Suburb Area", speed: "40 mph", tripNumber: "TR-1008" },
];

  const verifyCol = ["Investor ID", "Name", "Email"];
  const verifyRow = [
    { investorID: "INV-001", name: "Alice Johnson", email: "alice.johnson@example.com" },
    { investorID: "INV-002", name: "Bob Smith", email: "bob.smith@example.com" },
    { investorID: "INV-003", name: "Charlie Davis", email: "charlie.davis@example.com" },
    { investorID: "INV-004", name: "Diana Evans", email: "diana.evans@example.com" },
    { investorID: "INV-005", name: "Ethan Foster", email: "ethan.foster@example.com" },
    { investorID: "INV-006", name: "Fiona Green", email: "fiona.green@example.com" },
    { investorID: "INV-007", name: "George Harris", email: "george.harris@example.com" },
    { investorID: "INV-008", name: "Hannah Ingram", email: "hannah.ingram@example.com" },
    { investorID: "INV-009", name: "Ian Jackson", email: "ian.jackson@example.com" },
    { investorID: "INV-010", name: "Julia King", email: "julia.king@example.com" },
  ];


  const [data, setData] = useState([]);

  useEffect(() => {
    // Generate random data for the line chart
    const generateRandomData = () => {
      const currentDate = new Date();
      return [...Array(28)].map((_, i) => {
        const date = new Date(currentDate.getTime() - (27 - i) * 24 * 60 * 60 * 1000);
        const views = Math.floor(Math.random() * 1000000);
        return {
          date: `${date.getMonth() + 1}/${date.getDate()}`,
          views: views,
        };
      });
    };

    setData(generateRandomData());
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.addImage('/path-to-chart.png', 'PNG', 10, 10, 190, 120);
    doc.setFontSize(16);
    doc.text('Investment Dashboard', 20, 150);
    doc.setFontSize(12);
    doc.text('John Doe', 20, 170);
    doc.text('Investment ID', 20, 180);
    doc.save('investment-dashboard.pdf');
  };

  const Card = ({ title, value, subtext, subtextColor, button, textColor }) => (
    <div className="p-4 bg-[#493939] rounded-lg shadow-md">
      <h2 className={`text-lg font-bold mb-2 ${textColor}`}>{title}</h2>
      {value && (
        <p className={`text-2xl sm:text-3xl font-semibold ${textColor}`}>{value}</p>
      )}
      {subtext && <p className={`text-sm ${subtextColor}`}>{subtext}</p>}
      {button}
    </div>
  );

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-[#FF9321]">Hello, John Doe</h2>
          <p className="text-white text-base sm:text-lg">Investment ID</p>
        </div>

        <main>
          <div className="flex justify-between">
            <div className="w-1/2">
              {/* First row of cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
                <Card
                  title="No. of Users"
                  value="100"
                  subtext="+12 in 28 days"
                  subtextColor="text-green-500"
                  textColor="text-white"
                />
                <Card
                  title="No. of Assets"
                  value="180"
                  subtext="+33 in 28 days"
                  subtextColor="text-green-500"
                  textColor="text-white"
                />
                <Card
                  title="No. of Trips"
                  value="4,987"
                  subtext="+557 in 28 days"
                  subtextColor="text-green-500"
                  textColor="text-white"
                />
                <Card
                  title="No. of Investments"
                  value="136"
                  subtext="+26 in 28 Days"
                  subtextColor="text-green-500"
                  textColor="text-white"
                />
                <Card
                  title="Current Investment Value"
                  value="AED 2.11M"
                  subtext="+AED 311K in 28 Days"
                  subtextColor="text-green-500"
                  textColor="text-white"
                />
                <Card
                  title="Download Report"
                  button={<DownloadButton onClick={downloadPDF} />}
                  textColor="text-white"
                />
              </div>
            </div>

            <div className="pl-12 w-1/2">
              <h1 className="text-4xl font-bold text-[#FF9321]">Latest Logs</h1>
              <LogTable row={logrow} col={logcol} />
            </div>
          </div>

          <h1 className="text-4xl font-bold mt-3 mb-2 text-[#FF9321]">Latest Updates</h1>
          <LogTable row={logrow} col={statscol}/>

          <div className="mt-8">
            <h1 className="text-4xl font-bold mb-4 text-[#FF9321] w-">To be Verified</h1>
            <TheTable row={verifyRow} col={verifyCol} clickable={true} link={"verify/user/"}/>
          </div>
        </main>
      </div>
    </div>
  );
};



const DownloadButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white font-bold inline-flex items-center mt-2"
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
);

export default Investment;

