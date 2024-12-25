// src/components/Dashboard.jsx

import React, { useState, useEffect, useContext, useRef } from "react";
import { jsPDF } from "jspdf";
import LogTable from "./LogTable";
import TheTable from "./TheTable copy.jsx";
import { AdminContext } from "../contexts/AdminContext.jsx";
import { toast } from "react-toastify";
import axios from "../api/axios"; // Ensure correct path
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Dashboard = () => {
  const { admin, loading: contextLoading } = useContext(AdminContext); // Access admin data from context
  const navigate = useNavigate(); // Initialize navigate

  const [stats, setStats] = useState({
    totalUsers: 0,
    unverifiedUsers: 0,
    totalAssets: 0,
    totalTrips: 0,
    totalInvestments: 0,
    totalInvestmentValue: 0,
  });

  const [loading, setLoading] = useState(true); // Loading state for stats
  const [logs, setLogs] = useState([]); // State for logs

  const logcol = ["Log No.", "Date", "Time", "Admin", "Action"];
  const statscol = ["Time", "Truck", "Location", "Speed", "Trip Number"];

  // Sample log data (to be customized as per actual data)
  const logrow = [
    {
      logNo: "LOG-001",
      time: "08:00",
      admin: "Alice",
      action: "Created",
      unit: "Unit-1",
    },
    // ... Add more logs as needed
  ];

  const verifyCol = [
    { header: "Investor ID", accessor: "investorID" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
  ];

  const updateCol = [
    { header: "Model", accessor: "model" },
    { header: "Requested By", accessor: "requestedBy" },
    { header: "Update Details", accessor: "updateDetails" },
    { header: "Update Type", accessor: "updateType" },
    { header: "Status", accessor: "status" },
    { header: "Actions", accessor: "Actions" },
  ];

  const [pendingUpdates, setPendingUpdates] = useState([]);
  const [incompleteUsers, setIncompleteUsers] = useState([]);
  const [actionLoading, setActionLoading] = useState({}); // To track loading state per update

  // State for Rejection Modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentRejectUpdateId, setCurrentRejectUpdateId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // State for Details Modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentDetailUpdate, setCurrentDetailUpdate] = useState(null);

  const chartRef = useRef(null); // Reference to the chart for PDF generation

  useEffect(() => {
    // Fetch dashboard stats
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get("/dashboard/stats");
        console.log("Dashboard Stats:", response.data);
        setStats(response.data);
        console.log(stats.totalInvestmentValue);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Failed to fetch dashboard statistics.");
      }
    };

    const fetchLogs = async () => {
      try {
        const response = await axios.get("/logs");
        console.log("Logs:", response.data);
        setLogs(response.data);
      } catch (error) {
        console.error("Error fetching logs:", error);
        toast.error("Failed to fetch logs.");
      }
    };

    fetchDashboardStats();
    fetchLogs();
  }, []);

  useEffect(() => {
    // Function to fetch pending updates
    const fetchPendingUpdates = async () => {
      try {
        const response = await axios.get("/admin/pending-updates");
        console.log("Pending Updates:", response.data); // Debugging Line
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

        // Adjust based on the actual response structure
        if (Array.isArray(response.data)) {
          setIncompleteUsers(response.data);
        } else if (Array.isArray(response.data.users)) { // Adjust property name as needed
          setIncompleteUsers(response.data.users);
        } else {
          console.error("Unexpected data format for incomplete users:", response.data);
          setIncompleteUsers([]); // Fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching incomplete users:", error);
        toast.error("Failed to fetch users to be verified.");
        setIncompleteUsers([]); // Fallback to empty array on error
      }
    };

    fetchIncompleteUsers();
  }, []); // Runs once on mount

  // Approve a pending update
  const approvePendingUpdate = async (pendingUpdateId) => {
    setActionLoading((prev) => ({ ...prev, [pendingUpdateId]: true }));
    try {
      await axios.post(`/admin/pending-updates/${pendingUpdateId}/approve`);
      toast.success("Pending update approved successfully.");
      // Remove the approved update from the list
      setPendingUpdates((prevUpdates) =>
        prevUpdates.filter((update) => update._id !== pendingUpdateId)
      );
    } catch (error) {
      console.error("Error approving pending update:", error);
      toast.error("Failed to approve the pending update.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [pendingUpdateId]: false }));
    }
  };

  // Reject a pending update with a reason
  const rejectPendingUpdate = async (pendingUpdateId, reason) => {
    setActionLoading((prev) => ({ ...prev, [pendingUpdateId]: true }));
    try {
      await axios.post(`/admin/pending-updates/${pendingUpdateId}/reject`, {
        rejectionReason: reason.trim(), // Corrected key
      });
      toast.success("Pending update rejected successfully.");
      // Remove the rejected update from the list
      setPendingUpdates((prevUpdates) =>
        prevUpdates.filter((update) => update._id !== pendingUpdateId)
      );
    } catch (error) {
      console.error("Error rejecting pending update:", error);
      toast.error("Failed to reject the pending update.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [pendingUpdateId]: false }));
    }
  };

  // Open the Rejection Modal
  const openRejectModal = (updateId) => {
    setCurrentRejectUpdateId(updateId);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  // Handle Confirmation of Rejection
  const handleRejectConfirm = () => {
    if (currentRejectUpdateId && rejectionReason.trim()) {
      rejectPendingUpdate(currentRejectUpdateId, rejectionReason.trim());
      setShowRejectModal(false);
    } else {
      toast.error("Please provide a rejection reason.");
    }
  };

  // Function to open the details modal
  const openDetailsModal = (update) => {
    setCurrentDetailUpdate(update);
    setShowDetailsModal(true);
  };

  // Function to close the details modal
  const closeDetailsModal = () => {
    setCurrentDetailUpdate(null);
    setShowDetailsModal(false);
  };

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

  // Handle row click for "Users to be Created"
  const handleUserRowClick = (user) => {
    navigate(`/verify-user/${user._id}`, { state: { userData: user } });
  };

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
            <div className="w-full mb-8 lg:mb-0">
              {/* First row of cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card
                  title="No. of Users"
                  value={stats.totalUsers}
                  subtextColor="text-green-500"
                  textColor="text-white"
                />
                <Card
                  title="No. of Assets"
                  value={stats.totalAssets}
                  subtextColor="text-green-500"
                  textColor="text-white"
                />
                <Card
                  title="No. of Trips"
                  value={stats.totalTrips}
                  subtextColor="text-green-500"
                  textColor="text-white"
                />
                <Card
                  title="Download Report"
                  button={<DownloadButton onClick={downloadPDF} />}
                  textColor="text-white"
                />
                <Card
                  title="No. of Investments"
                  value={stats.totalInvestments}
                  subtextColor="text-green-500"
                  textColor="text-white"
                />
                <Card
                  title="Total Investment Value"
                  value={`AED ${stats.totalInvestmentValue}`}
                  subtextColor="text-green-500"
                  textColor="text-white"
                />
              </div>
            </div>
          </div>

          {/* Latest Logs */}
          <h1 className="text-4xl font-bold mt-8 mb-4 text-[#FF9321]">Latest Logs</h1>
          <LogTable
            row={
              logs
                ? logs.map((log) => ({
                    logNo: log.logNo,
                    date: new Date(log.time).toLocaleDateString(),
                    time: new Date(log.time).toLocaleTimeString(),
                    admin: log.admin?.name || "N/A",
                    action: log.action,
                  }))
                : []
            }
            col={logcol}
          />

          {/* Latest Updates */}
          <h1 className="text-4xl font-bold mt-8 mb-4 text-[#FF9321]">
            Latest Updates
          </h1>
          <TheTable row={logrow} col={statscol} />

          {/* Updates to be Verified */}
          <div className="mt-8">
            <h1 className="text-4xl font-bold mb-4 text-[#FF9321]">
              Updates to be Verified
            </h1>
            <TheTable
              row={pendingUpdates.map((update) => ({
                model: update.model || "N/A",
                requestedBy: update.requestedBy?.name || "N/A",
                updateDetails: update.update
                  ? JSON.stringify(update.update, null, 2)
                  : "N/A",
                updateType: update.updateType || "N/A",
                status: update.status || "N/A",
                Actions: (
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => approvePendingUpdate(update._id)}
                      disabled={actionLoading[update._id]}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        actionLoading[update._id]
                          ? "bg-green-300 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      {actionLoading[update._id] ? "Approving..." : "Approve"}
                    </button>
                    <button
                      onClick={() => openRejectModal(update._id)}
                      disabled={actionLoading[update._id]}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        actionLoading[update._id]
                          ? "bg-red-300 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      {actionLoading[update._id] ? "Rejecting..." : "Reject"}
                    </button>
                    <button
                      onClick={() => openDetailsModal(update)}
                      className="px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      View Details
                    </button>
                  </div>
                ),
              }))}
              col={updateCol} // Ensure 'Actions' is included in columns
              clickable={false} // Disable row click since actions are handled via buttons
            />
          </div>

          {/* Users to be Created */}
          <div className="mt-8">
            <h1 className="text-4xl font-bold mb-4 text-[#FF9321]">
              Users to be Created
            </h1>
            <TheTable
              row={
                Array.isArray(incompleteUsers)
                  ? incompleteUsers.map((user) => ({
                      investorID: user.userId, // Assuming userId corresponds to Investor ID
                      name: user.name,
                      email: user.email,
                      _id: user._id, // Include user ID for navigation
                    }))
                  : []
              }
              col={verifyCol} // Updated to include accessor
              clickable={true}
              onRowClick={handleUserRowClick} // Pass the click handler
            />
          </div>
        </main>
      </div>

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Reject Update</h2>
            <p className="mb-4">
              Please provide a reason for rejecting this update:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              placeholder="Enter rejection reason here..."
            ></textarea>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={!rejectionReason.trim()}
                className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ${
                  !rejectionReason.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {currentRejectUpdateId && actionLoading[currentRejectUpdateId]
                  ? "Rejecting..."
                  : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && currentDetailUpdate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-2/3 max-h-[80vh] overflow-y-auto">
            {currentDetailUpdate ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Update Details</h2>
                <div className="mb-4">
                  <strong>Model:</strong> {currentDetailUpdate.model || "N/A"}
                </div>
                <div className="mb-4">
                  <strong>Requested By:</strong>{" "}
                  {currentDetailUpdate.requestedBy?.name || "N/A"}
                </div>
                <div className="mb-4">
                  <strong>Update Type:</strong>{" "}
                  {currentDetailUpdate.updateType || "N/A"}
                </div>
                <div className="mb-4">
                  <strong>ID:</strong>{" "}
                  {currentDetailUpdate.documentId?.userId ||
                    currentDetailUpdate.documentId?.NumberPlate ||
                    "N/A"}
                </div>
                <div className="mb-4">
                  <strong>Update Details:</strong>
                  <pre className="bg-gray-100 p-2 rounded mt-2">
                    {currentDetailUpdate.update
                      ? JSON.stringify(currentDetailUpdate.update, null, 2)
                      : "N/A"}
                  </pre>
                </div>
                <div className="mb-4">
                  <strong>Current Value:</strong>
                  <pre className="bg-gray-100 p-2 rounded mt-2">
                    {currentDetailUpdate.currentValues
                      ? JSON.stringify(
                          currentDetailUpdate.currentValues,
                          null,
                          2
                        )
                      : "N/A"}
                  </pre>
                </div>
                {/* Add more fields as necessary, excluding id and _id */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={closeDetailsModal}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin h-8 w-8 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </div>
            )}
            {/* Close button */}
          </div>
        </div>
      )}
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
