import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
import StatsTable from './StatsTable';
import LogTable from './LogTable'

const Investment = () => {
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
          views: views
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


  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">Hello, John Doe</h2>
          <p className="text-gray-500 text-base sm:text-lg">Investment ID</p>
        </div>

        <main>

          <div className="flex justify-between">
          <div className='w-1/2'>
            {/* First row of cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
              <Card title="No. of Users" value="100" subtext="+12 in 28 days" subtextColor="text-green-500" />
              <Card title="No. of Assets" value="180" subtext="+33 in 28 days" subtextColor="text-green-500" />
              <Card title="No. of Trips" value="4987" subtext="+557 in 28 days" subtextColor="text-green-500" />
              <Card title="No. of Investments" value="136" subtext="+26 in 28 Days" subtextColor="text-green-500" />
              <Card title="Current Investment Value" value="AED 2.11M" subtext="+AED 311K in 28 Days" subtextColor="text-green-500" />
              <Card title="Download Report" button={<DownloadButton onClick={downloadPDF} />} />
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-semibold pl-12 w-1/2">

          <h1 className='text-2xl sm:text-3xl font-semibold '>Latest Logs</h1>
          <LogTable />
          </div>

          </div>

          <h1 className='text-2xl sm:text-3xl font-semibold mt-3 mb-2'>Latest Updates</h1>
          <StatsTable />
        </main>
      </div>
    </div>
  );
};

const Card = ({ title, value, subtext, subtextColor, button }) => (
  <div className="p-4 bg-white rounded-lg shadow-md">
    <h2 className="text-lg font-bold mb-2">{title}</h2>
    {value && <p className="text-2xl sm:text-3xl font-semibold">{value}</p>}
    {subtext && <p className={`text-sm ${subtextColor}`}>{subtext}</p>}
    {button}
  </div>
);

const DownloadButton = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mt-2"
  >
    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
    </svg>
    <span>Download</span>
  </button>
);

export default Investment;