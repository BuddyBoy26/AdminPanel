import React, { useState, useEffect, useContext } from "react";
import { generatePdf } from "../ui/generatePdf";
import axios from "../api/axios.js";
import { AdminContext } from "../contexts/AdminContext.jsx";
import { toast } from "react-toastify";

const Reports = () => {
  const today = new Date();
  const priorDate = new Date();
  priorDate.setMonth(priorDate.getMonth() - 1);
  const { admin, token } = useContext(AdminContext);

  const getFormattedDate = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  const formattedToday = getFormattedDate(today);
  const formattedPriorDate = getFormattedDate(priorDate);

  const [reportInfo, setReportInfo] = useState({
    "Start Date": formattedPriorDate,
    "End Date": formattedToday,
    "Report Type": "Overview",
  });

  const [unitType, setUnitType] = useState("");
  const [unitName, setUnitName] = useState("");
  const [unitNames, setUnitNames] = useState([]);
  const [trackersReportType, setTrackersReportType] = useState("");

  const [assets, setAssets] = useState([]);
  const [asset, setAsset] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [invesment, setInvestment] = useState(null);
  const [trips, setTrips] = useState([]);
  const [trip, setTrip] = useState(null);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [trackers, setTrackers] = useState([]);
  const [tracker, setTracker] = useState(null);
  const [logs, setLogs] = useState([]);

  const [errors, setErrors] = useState({});

  const fetchData = async (metaData) => {
    // Handle Unitwise reports by downloading PDF directly from backend
    if (metaData["Report Type"] === "Unitwise") {
      try {
        // Dynamically construct the endpoint using unit type
        const endpoint = `/${metaData.UnitType.toLowerCase()}/report/pdf`;

        const response = await axios.get(endpoint, {
          responseType: "blob", // Expecting a PDF blob
          params: {
            startDate: metaData["Start Date"],
            endDate: metaData["End Date"],
            // Include additional params if necessary, e.g., unitName
          },
        });

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${metaData.UnitType}_Report_${metaData["Start Date"]}_${metaData["End Date"]}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading Unitwise PDF:", error);
        toast.error("Failed to download the Unitwise report.");
      }
      return; // Exit since Unitwise case has been handled
    }

    // Existing logic for other report types
    // Logbook
    if (metaData["Report Type"] === "Logbook") {
      const columns = ["Log", "Date", "Time", "Admin", "Action"];

      const fetchLogs = async () => {
        try {
          const response = await axios.get("/logs");
          setLogs(response.data);
        } catch (error) {
          console.error("Error fetching logs:", error);
          toast.error("Failed to fetch logs.");
        }
      };

      await fetchLogs();

      const data = logs.map((log) => ({
        Log: log.logNo,
        Date: new Date(log.time).toLocaleDateString(),
        Time: new Date(log.time).toLocaleTimeString(),
        Admin: log.admin?.name || "N/A",
        Action: log.action,
      }));

      const rows = data.map((item) => Object.values(item));

      const logbook = {
        columns: columns,
        rows: rows,
        title: "Logbook",
      };

      generatePdf(
        [logbook],
        `Logbook_${reportInfo["Start Date"]}_${reportInfo["End Date"]}`,
        reportInfo["Start Date"],
        reportInfo["End Date"]
      );
    }

    console.log("Unit Type:", unitType);

    // The following blocks for Users, Trips, Assets, and Investments remain unchanged...
    // ...
  };

  const handleChange = (field, value) => {
    setReportInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUnitTypeChange = async (value) => {
    setUnitType(value);
    setUnitName("");

    if (value) {
      let names = [];
      if (value === "Users") {
        const fetchUsers = async () => {
          try {
            const response = await axios.get("/users", {
              headers: { Authorization: `Bearer ${token}` },
              params: { page: 1, search: "" },
            });
            setUsers(response.data.users);
          } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users.");
            if (error.response && error.response.status === 401) {
              window.location.href = "/login";
            }
          }
        };

        await fetchUsers();
        const data = users.map((user) => ({ Name: user.name }));
        names = data.map((item) => item.Name);
      } else if (value === "Assets") {
        names = ["Asset1", "Asset2", "Asset3"];
      } else if (value === "Trips") {
        names = ["Trip1", "Trip2", "Trip3"];
      } else if (value === "Investments") {
        names = ["Investment1", "Investment2", "Investment3"];
      }
      setUnitNames(names);
    } else {
      setUnitNames([]);
    }
  };

  const handleTrackersReportTypeChange = (value) => {
    setTrackersReportType(value);
    setUnitName("");

    if (value) {
      let names = ["Asset1", "Asset2", "Asset3"];
      setUnitNames(names);
    } else {
      setUnitNames([]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!reportInfo["Start Date"]) {
      newErrors.startDate = "Start Date is required";
    }
    if (!reportInfo["End Date"]) {
      newErrors.endDate = "End Date is required";
    }
    if (
      reportInfo["Report Type"] === "Unitwise" ||
      reportInfo["Report Type"] === "Unit Report"
    ) {
      if (!unitType) {
        newErrors.unitType = "Unit Type is required";
      }
    }
    if (reportInfo["Report Type"] === "Unit Report") {
      if (!unitName) {
        newErrors.unitName = "Unit Name is required";
      }
    }
    if (reportInfo["Report Type"] === "Tracker") {
      if (!trackersReportType) {
        newErrors.trackersReportType = "Trackers Report Type is required";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const metaData = {
      ...reportInfo,
      UnitType: unitType,
      UnitName: unitName,
      TrackersReportType: trackersReportType,
    };
    if (validateForm()) {
      console.log("Downloading report with metaData:", metaData);
      fetchData(metaData);
    } else {
      console.log("Form validation failed");
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      <div className="flex justify-center w-full h-full p-4 overflow-y-auto custom-scrollbar">
        <div className="w-3/5 bg-[#493939] rounded-lg shadow-md p-6 my-6 lg:m-6">
          <h2 className="text-4xl font-bold text-[#FF9321] mb-4">
            Download Reports
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 mt-4 w-full">
              {/* Start Date */}
              <div className="flex items-center">
                <label className="w-1/3 text-lg font-semibold text-white">
                  Start Date
                </label>
                <div className="w-2/3">
                  <input
                    type="date"
                    value={reportInfo["Start Date"]}
                    max={formattedToday}
                    onChange={(e) => {
                      handleChange("Start Date", e.target.value);
                      if (reportInfo["End Date"] < e.target.value) {
                        handleChange("End Date", e.target.value);
                      }
                      setErrors((prev) => ({ ...prev, startDate: "" }));
                    }}
                    className="w-full p-2 text-md text-black rounded-lg"
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>
              </div>
              {/* End Date */}
              <div className="flex items-center">
                <label className="w-1/3 text-lg font-semibold text-white">
                  End Date
                </label>
                <div className="w-2/3">
                  <input
                    type="date"
                    value={reportInfo["End Date"]}
                    min={reportInfo["Start Date"]}
                    max={formattedToday}
                    onChange={(e) => {
                      handleChange("End Date", e.target.value);
                      setErrors((prev) => ({ ...prev, endDate: "" }));
                    }}
                    className="w-full p-2 text-md text-black rounded-lg"
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
              {/* Report Type */}
              <div className="flex items-center">
                <label className="w-1/3 text-lg font-semibold text-white">
                  Report Type
                </label>
                <div className="w-2/3">
                  <select
                    value={reportInfo["Report Type"]}
                    onChange={(e) => {
                      handleChange("Report Type", e.target.value);
                      setErrors({});
                      setUnitType("");
                      setUnitName("");
                      setUnitNames([]);
                    }}
                    className="w-full p-2 text-md text-black rounded-lg"
                  >
                    <option value="Overview">Overview</option>
                    <option value="Unitwise">Unitwise</option>
                    <option value="Unit Report">Unit Report</option>
                    <option value="Logbook">Logbook</option>
                    <option value="Tracker">Tracker</option>
                  </select>
                </div>
              </div>
              {/* Conditional Fields */}
              {reportInfo["Report Type"] === "Unitwise" && (
                <div className="flex items-center">
                  <label className="w-1/3 text-lg font-semibold text-white">
                    Unit Type
                  </label>
                  <div className="w-2/3">
                    <select
                      value={unitType}
                      onChange={(e) => handleUnitTypeChange(e.target.value)}
                      className="w-full p-2 text-md text-black rounded-lg"
                    >
                      <option value="">Select Unit Type</option>
                      <option value="Users">Users</option>
                      <option value="Assets">Assets</option>
                      <option value="Trips">Trips</option>
                      <option value="Investments">Investments</option>
                    </select>
                    {errors.unitType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.unitType}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {reportInfo["Report Type"] === "Tracker" && (
                <>
                  <div className="flex items-center">
                    <label className="w-1/3 text-lg font-semibold text-white">
                      Tracker Report Type
                    </label>
                    <div className="w-2/3">
                      <select
                        value={trackersReportType}
                        onChange={(e) =>
                          handleTrackersReportTypeChange(e.target.value)
                        }
                        className="w-full p-2 text-md text-black rounded-lg"
                      >
                        <option value="">Select Trackers Report Type</option>
                        <option value="Cumulative">Cumulative</option>
                        <option value="TrackerwiseConcise">
                          Tracker-wise Concise
                        </option>
                        <option value="Specific">Specific</option>
                      </select>
                      {errors.trackersReportType && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.trackersReportType}
                        </p>
                      )}
                    </div>
                  </div>
                  {trackersReportType === "Specific" && (
                    <div className="flex items-center">
                      <label className="w-1/3 text-lg font-semibold text-white">
                        Tracker Name
                      </label>
                      <div className="w-2/3">
                        <select
                          value={unitName}
                          onChange={(e) => setUnitName(e.target.value)}
                          className="w-full p-2 text-md text-black rounded-lg"
                        >
                          <option value="">Select Tracker Name</option>
                          {unitNames.map((name, index) => (
                            <option key={index} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                        {errors.unitName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.unitName}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {reportInfo["Report Type"] === "Unit Report" && (
                <>
                  <div className="flex items-center">
                    <label className="w-1/3 text-lg font-semibold text-white">
                      Unit Type
                    </label>
                    <div className="w-2/3">
                      <select
                        value={unitType}
                        onChange={(e) => handleUnitTypeChange(e.target.value)}
                        className="w-full p-2 text-md text-black rounded-lg"
                      >
                        <option value="">Select Unit Type</option>
                        <option value="Users">Users</option>
                        <option value="Assets">Assets</option>
                        <option value="Trips">Trips</option>
                        <option value="Investments">Investments</option>
                      </select>
                      {errors.unitType && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.unitType}
                        </p>
                      )}
                    </div>
                  </div>
                  {unitType && (
                    <div className="flex items-center">
                      <label className="w-1/3 text-lg font-semibold text-white">
                        Unit Name
                      </label>
                      <div className="w-2/3">
                        <select
                          value={unitName}
                          onChange={(e) => setUnitName(e.target.value)}
                          className="w-full p-2 text-md text-black rounded-lg"
                        >
                          <option value="">Select Unit Name</option>
                          {unitNames.map((name, index) => (
                            <option key={index} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                        {errors.unitName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.unitName}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {Object.keys(errors).length > 0 && (
              <p className="text-red-500 text-center mt-4">
                Please correct the above errors before submitting.
              </p>
            )}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white font-bold inline-flex items-center"
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reports;
