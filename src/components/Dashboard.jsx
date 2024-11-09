// src/components/Dashboard.jsx

import React, { useState, useEffect, useContext, useRef } from "react";

import { jsPDF } from "jspdf";
import LogTable from "./LogTable";
import TheTable from "./TheTable";
import { AdminContext } from "../contexts/AdminContext.jsx";
import { toast } from "react-toastify";
import axios from "../api/axios"; // Ensure correct path

const Dashboard = () => {
  const { admin, loading: contextLoading } = useContext(AdminContext); // Access admin data from context

  const [stats, setStats] = useState({
    totalUsers: 0,
    unverifiedUsers: 0,
    totalAssets: 0,
    totalTrips: 0,
    totalInvestments: 0,
    totalInvestmentValue: 0,
  });

  const [loading, setLoading] = useState(true); // Loading state for stats

  const logcol = ["Log No.", "Time", "Admin", "Action", "Unit"];
  const statscol = ["Time", "Truck", "Location", "Speed", "Trip Number"];

  // Sample log data (to be left as is)
  const logrow = [
    {
      logNo: "LOG-001",
      time: "08:00",
      admin: "Alice",
      action: "Created",
      unit: "Unit-1",
    },
    {
      logNo: "LOG-002",
      time: "09:15",
      admin: "Bob",
      action: "Updated",
      unit: "Unit-2",
    },
    {
      logNo: "LOG-003",
      time: "10:30",
      admin: "Charlie",
      action: "Deleted",
      unit: "Unit-3",
    },
    {
      logNo: "LOG-004",
      time: "11:45",
      admin: "Diana",
      action: "Created",
      unit: "Unit-4",
    },
    {
      logNo: "LOG-005",
      time: "13:00",
      admin: "Ethan",
      action: "Updated",
      unit: "Unit-5",
    },
    {
      logNo: "LOG-006",
      time: "14:15",
      admin: "Fiona",
      action: "Deleted",
      unit: "Unit-6",
    },
    {
      logNo: "LOG-007",
      time: "15:30",
      admin: "George",
      action: "Created",
      unit: "Unit-7",
    },
    {
      logNo: "LOG-008",
      time: "16:45",
      admin: "Hannah",
      action: "Updated",
      unit: "Unit-8",
    },
  ];

  const verifyCol = ["Investor ID", "Name", "Email"];

  const chartRef = useRef(null); // Reference to the chart for PDF generation
  const [incompleteUsers, setIncompleteUsers] = useState([]);
  const updateCol = [
    "Model",
    "Document ID",
    "Requested By",
    "Update Details",
    "Status",
    "Actions",
  ];
  const [pendingUpdates, setPendingUpdates] = useState([]);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get("/dashboard/stats");
        console.log("Dashboard Stats:", response.data);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Failed to fetch dashboard statistics.");
      }
    };

    fetchDashboardStats();
  }, []); // Runs once on mount

  useEffect(() => {
    // Function to fetch pending updates
    const fetchPendingUpdates = async () => {
      try {
        const response = await axios.get("/admin/pending-updates");
        console.log("Pending Updates:", response.data);
        setPendingUpdates(response.data);
      } catch (error) {
        console.error("Error fetching pending updates:", error);
        toast.error("Failed to fetch pending updates.");
      }
    };

    fetchPendingUpdates();
  }, []); // Runs once on mount

  useEffect(() => {
    // Fetch incomplete users
    const fetchIncompleteUsers = async () => {
      try {
        const response = await axios.get("/incomplete/users");
        console.log("Incomplete Users:", response.data);
        setIncompleteUsers(response.data);
      } catch (error) {
        console.error("Error fetching incomplete users:", error);
        toast.error("Failed to fetch users to be verified.");
      }
    };

    fetchIncompleteUsers();
  }, []); // Runs once on mount

  const downloadPDF = () => {
    if (!chartRef.current) {
      toast.error("Chart is not available for download.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Investment Dashboard", 20, 10);

    // Capture the chart as an image
    const canvas = chartRef.current.querySelector("canvas");
    if (canvas) {
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 10, 20, 190, 100);
    } else {
      toast.error("Failed to capture the chart.");
      return;
    }

    doc.setFontSize(16);
    doc.text("Investment Summary", 20, 130);
    doc.setFontSize(12);
    doc.text(`Name: ${admin.name}`, 20, 140);
    doc.text(`Admin ID: ${admin.adminId}`, 20, 150);
    doc.text(`Total Users: ${stats.totalUsers}`, 20, 160);
    doc.text(`Total Assets: ${stats.totalAssets}`, 20, 170);
    doc.text(`Total Trips: ${stats.totalTrips}`, 20, 180);
    doc.text(`Total Investments: ${stats.totalInvestments}`, 20, 190);
    doc.text(
      `Total Investment Value: AED ${stats.totalInvestmentValue}`,
      20,
      200
    );
    doc.save("investment-dashboard.pdf");
  };

  const Card = ({ title, value, subtext, subtextColor, button, textColor }) => (
    <div className="p-4 bg-[#493939] rounded-lg shadow-md">
      <h2 className={`text-lg font-bold mb-2 ${textColor}`}>{title}</h2>
      {value !== undefined && (
        <p className={`text-2xl sm:text-3xl font-semibold ${textColor}`}>
          {value}
        </p>
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
          <h2 className="text-4xl font-bold text-[#FF9321]">
            Hello, {admin.name}
          </h2>
          <p className="text-white text-base sm:text-lg">
            Admin ID: {admin.adminId}
          </p>
        </div>

        <main>
          <div className="flex flex-col lg:flex-row justify-between">
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
              {/* First row of cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <Card
                  title="No. of Users"
                  value={stats.totalUsers}
                  // Adjust based on backend data
                  subtextColor="text-green-500"
                  textColor="text-white"
                />
                <Card
                  title="No. of Assets"
                  value={stats.totalAssets}
                  // Adjust based on backend data
                  subtextColor="text-green-500"
                  textColor="text-white"
                />
                <Card
                  title="No. of Trips"
                  value={stats.totalTrips}
                  // Adjust based on backend data
                  subtextColor="text-green-500"
                  textColor="text-white"
                />
                <Card
                  title="No. of Investments"
                  value={stats.totalInvestments}
                  // Adjust based on backend data
                  subtextColor="text-green-500"
                  textColor="text-white"
                />
                <Card
                  title="Total Investment Value"
                  value={`AED ${stats.totalInvestmentValue}`}
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

            <div className="w-full lg:w-1/2 pl-0 lg:pl-12">
              <h1 className="text-4xl font-bold text-[#FF9321]">Latest Logs</h1>
              <LogTable row={logrow} col={logcol} />
            </div>
          </div>

          {/* Latest Updates and Logs - Left as is */}
          <h1 className="text-4xl font-bold mt-8 mb-4 text-[#FF9321]">
            Latest Updates
          </h1>
          <LogTable row={logrow} col={statscol} />

          <div className="mt-8">
            <h1 className="text-4xl font-bold mb-4 text-[#FF9321]">
              Updates to be Verified
            </h1>
            <TheTable
              row={pendingUpdates.map((update) => ({
                _id: update._id,
                model: update.model,
                documentId: update.documentId._id, // Assuming documentId is populated
                requestedBy: `${update.requestedBy.name} (${update.requestedBy.email})`,
                updateDetails: JSON.stringify(update.update, null, 2), // Formatting update object
                status: update.status,
              }))}
              col={updateCol}
              clickable={true}
              link={"verify/user/"}
            />
          </div>

          <div className="mt-8">
            <h1 className="text-4xl font-bold mb-4 text-[#FF9321]">
              Users to be Created
            </h1>
            <TheTable
              row={incompleteUsers.map((user) => ({
                investorID: user.userId, // Assuming userId corresponds to Investor ID
                name: user.name,
                email: user.email,
              }))}
              col={verifyCol}
              clickable={true}
              link={"verify/user"}
            />
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

export default Dashboard;
