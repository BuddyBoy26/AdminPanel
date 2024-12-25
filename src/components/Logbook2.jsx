// src/components/Assets.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { jsPDF } from "jspdf";
import LogTable from "./LogTable";
import TheTable from "./TheTable";
import { AdminContext } from "../contexts/AdminContext.jsx";
import { toast } from "react-toastify";
import axios from "../api/axios"; // Ensure correct path
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Logbook = () => {
  const {admin, loading: contextLoading } = useContext(AdminContext); // Access admin data from context
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

  const logcol = ["Log", "Time", "Admin", "Action", "Date"];

  useEffect(() => {
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

    fetchLogs();
  }, []);

    const data=logs.map((log, index) => ({
    Log: log.logNo,
    Date: new Date(log.time).toLocaleDateString(),
    Time: new Date(log.time).toLocaleTimeString(),
    Admin: log.admin?.name || "N/A",
    Action: log.action,
  }))

  console.log("data", data)

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      <div className="flex justify-center items-center w-full px-10 py-2 relative mt-5">
        <h1 className="text-4xl font-bold text-[#FF9321]">Logbook</h1>
      </div>
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
                  lim={0}
                />
    </div>
  );
};

export default Logbook;