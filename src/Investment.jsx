import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
import StatsTable from './StatsTable';

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

  const downloadContract = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Contract Details', 20, 20);
    doc.setFontSize(12);
    doc.text('Contract ID: 12345', 20, 40);
    doc.text('Start Date: 01/01/2023', 20, 50);
    doc.text('End Date: 12/31/2023', 20, 60);
    doc.text('Investment Amount: $100,000', 20, 70);
    doc.save('investment-contract.pdf');
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
          {/* First row of cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card title="Investment Value" value="AED 1.80M" subtext="" subtextColor="text-green-500" />
            <Card title="No. of Assets" value="12" subtext="" subtextColor="text-gray-500" />
            <Card title="Ticket size" value="AED 150K" subtext="" subtextColor="text-green-500" />
            <Card title="Download Report" button={<DownloadButton onClick={downloadPDF} />} />
          </div>

          {/* Second row of cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card title="Current Investment Value" value="AED 2.11M" subtext="+AED 311K in 28 Days" subtextColor="text-green-500" />
            <Card title="Agreed ROI" value="10%" subtext="" subtextColor="text-gray-500" />
            <Card title="No. of Trips" value="108" subtext="+23 This Month" subtextColor="text-green-500" />
            <Card title="Download Contract" button={<DownloadButton onClick={downloadContract} />} />
          </div>

          <h1 className='text-2xl sm:text-3xl font-semibold mb-6'>Latest Updates</h1>
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