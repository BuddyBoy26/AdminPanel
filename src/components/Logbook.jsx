// src/components/Logbook.jsx

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TheTable from "./TheTable";
import { AdminContext } from "../contexts/AdminContext.jsx";
import axios from "../api/axios.js";
import { toast } from "react-toastify";

const Logbook = () => {
  const navigate = useNavigate();
  const { admin } = useContext(AdminContext); // Access admin data if necessary
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const col = ["Log No.", "Time", "Admin", "Action", "Unit", "Note"];

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("/logs"); // Replace with your actual endpoint
        setData(response.data.logs); // Adjust based on your API response structure
        setLoading(false);
      } catch (error) {
        console.error("Error fetching logs:", error);
        toast.error("Failed to fetch log data.");
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const handleDownloadLogbook = () => {
    // Implement logbook download functionality
    // For demonstration, we'll convert data to CSV and download
    if (data.length === 0) {
      toast.info("No logs available to download.");
      return;
    }

    const csvContent = [
      col.join(","),
      ...data.map((log) =>
        [
          log.logNo,
          log.time,
          log.admin,
          log.action,
          log.unit,
          `"${log.note.replace(/"/g, '""')}"`, // Escape quotes
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "logbook.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Logbook downloaded successfully.");
  };

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      <div className="flex justify-center items-center w-full px-10 py-2 relative mt-5">
        <h1 className="text-4xl font-bold text-[#FF9321]">Logbook</h1>

        <button
          onClick={handleDownloadLogbook}
          className="absolute right-10 px-4 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white mr-48 font-bold inline-flex items-center"
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
      </div>
      {loading ? (
        <div className="flex justify-center items-center text-white">
          Loading logs...
        </div>
      ) : (
        <TheTable row={data} col={col} link="/logbook/details" clickable={false} />
      )}
    </div>
  );
};

export default Logbook;
