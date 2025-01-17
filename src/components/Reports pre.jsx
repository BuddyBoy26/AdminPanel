import React, { useState, useEffect, useContext } from "react";
import { generatePdf } from "../ui/generatePdf";
import userReport from "../ui/userReport.js";
import { assetReport } from "../ui/assetReport.js";
import axios from "../api/axios.js"; // Ensure correct path
import { AdminContext } from "../contexts/AdminContext.jsx";
import { investmentReport } from "../ui/investmentReport.js";

const Reports = () => {
  const today = new Date();
  const priorDate = new Date();
  priorDate.setMonth(priorDate.getMonth() - 1);
  const { admin, token } = useContext(AdminContext); // Access authenticated admin user

  const getFormattedDate = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split('T')[0];
  };

  const formattedToday = getFormattedDate(today);
  const formattedPriorDate = getFormattedDate(priorDate);

  const [reportInfo, setReportInfo] = useState({
    "Start Date": formattedPriorDate,
    "End Date": formattedToday,
    "Report Type": "Overview",
  });

  useEffect (() => {
          const fetchUsers = async () => {
            // Fetch users with pagination and filter
          try {
            const response = await axios.get("/users", {
              headers: { Authorization: `Bearer ${token}` },
              params: { page: 1, search: ""}, // Adjust based on API
            });
  
            setUsers(response.data.users)
  
          } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users to be verified.");
    
            // Redirect to login if authentication fails
            if (error.response && error.response.status === 401) {
              navigate("/login");
            }
          }};
    
          fetchUsers();
  
          const fetchAssets = async () => {
            // Fetch assets with pagination and filter
          try {
            const response = await axios.get("/assets", {
              headers: { Authorization: `Bearer ${token}` },
              params: { page: 1, search: ""}, // Adjust based on API
            });
  
            setAssets(response.data.assets)
  
          } catch (error) {
            console.error("Error fetching assets:", error);
            toast.error("Failed to fetch assets to be verified.");
    
            // Redirect to login if authentication fails
            if (error.response && error.response.status === 401) {
              navigate("/login");
            }
          }};
    
          fetchAssets();
  
          const fetchTrips = async () => {
            // Fetch trips with pagination and filter
          try {
            const response = await axios.get("/trips", {
              headers: { Authorization: `Bearer ${token}` },
              params: { page: 1, search: ""}, // Adjust based on API
            });
  
            setTrips(response.data.trips)
            console.log(trips)
  
          } catch (error) {
            console.error("Error fetching trips:", error);
            toast.error("Failed to fetch trips to be verified.");
    
            // Redirect to login if authentication fails
            if (error.response && error.response.status === 401) {
              navigate("/login");
            }
          }};
    
          fetchTrips();
          
          const fetchInvestments = async () => {
            // Fetch investments with pagination and filter
          try {
            const response = await axios.get("/investments", {
              headers: { Authorization: `Bearer ${token}` },
              params: { page: 1, search: ""}, // Adjust based on API
            });
  
            setInvestments(response.data.investments)
            console.log(investment)
  
          } catch (error) {
            console.error("Error fetching investments:", error);
            toast.error("Failed to fetch investments to be verified.");
    
            // Redirect to login if authentication fails
            if (error.response && error.response.status === 401) {
              navigate("/login");
            }
          }};
    
          fetchInvestments();

          const fetchTracker = async () => {
            // Fetch users with pagination and filter
          try {
            const response = await axios.get("/assets/wialon", {
              headers: { Authorization: `Bearer ${token}` },
              params: { page: 1, search: ""}, // Adjust based on API
            });
  
            setUsers(response.data.users)
  
          } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users to be verified.");
    
            // Redirect to login if authentication fails
            if (error.response && error.response.status === 401) {
              navigate("/login");
            }
          }};
    
          fetchUsers();

  }, [])

  const [unitType, setUnitType] = useState("");
  const [unitName, setUnitName] = useState("");
  const [unitNames, setUnitNames] = useState([]);
  const [trackersReportType, setTrackersReportType] = useState("");

  const [assets, setAssets] = useState([]);
  const [asset, setAsset] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [investment, setInvestment] = useState(null);
  const [trips, setTrips] = useState([]);
  const [trip, setTrip] = useState(null);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [trackers, setTrackers] = useState([]);
  const [tracker, setTracker] = useState(null);
  const [logs, setLogs] = useState([])

  const [errors, setErrors] = useState({});

  const fetchData = async (metaData) => {

    //Logbook
    if (metaData["Report Type"] == "Logbook") {
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

      const data=logs.map((log, index) => ({
        Log: log.logNo,
        Date: new Date(log.time).toLocaleDateString(),
        Time: new Date(log.time).toLocaleTimeString(),
        Admin: log.admin?.name || "N/A",
        Action: log.action,
      }))

      console.log(data)
      console.log(columns)
      const rows = data.map(item => 
        Object.values(item)
      );

      console.log(rows)
      const logbook = {
        columns: columns,
        rows: rows,
        title: "Logbook",
      }
      
      generatePdf([logbook], `Logbook_${reportInfo["Start Date"]}_${reportInfo["End Date"]}`, reportInfo["Start Date"], reportInfo["End Date"])
    }
    console.log("Unit Type:", unitType)

    // Users
    if (metaData["Report Type"] == "Unitwise" && unitType == "Users") {
      const columns = ["Investor ID", "Name", "Email", "Status"];

      const fetchUsers = async () => {
          // Fetch users with pagination and filter
        try {
          const response = await axios.get("/users", {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: 1, search: ""}, // Adjust based on API
          });

          setUsers(response.data.users)

        } catch (error) {
          console.error("Error fetching users:", error);
          toast.error("Failed to fetch users to be verified.");
  
          // Redirect to login if authentication fails
          if (error.response && error.response.status === 401) {
            navigate("/login");
          }
        }
      };
  
      await fetchUsers();

      console.log(users)

      const data=users.map((user, index) => ({
        UserId: user.userId,
        Name: user.name,
        Email: user.email,
        Status: user.isProfileComplete ? "Active" : "Inactive",
      }))

      const rows = data.map(item => 
        Object.values(item)
      );

      console.log(rows)
      const table = {
        columns: columns,
        rows: rows,
        title: "Users"
      }
      
      generatePdf([table], `Users_${reportInfo["Start Date"]}_${reportInfo["End Date"]}`, reportInfo["Start Date"], reportInfo["End Date"])
    }

    //Trips
    if (metaData["Report Type"] == "Unitwise" && unitType == "Trips") {
      const columns = ["Number Plate", "To", "From", "Start Date", "End Date"];

      const fetchTrips = async () => {
          // Fetch trips with pagination and filter
        try {
          const response = await axios.get("/trips", {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: 1, search: "" }, // Adjust based on API
          });

          setTrips(response.data.trips)
          console.log(response)

        } catch (error) {
          console.error("Error fetching trips:", error);
          // toast.error("Failed to fetch users to be verified.")
          // Redirect to login if authentication fails
          if (error.response && error.response.status === 401) {
            navigate("/login");
          }
        }
      };
  
      await fetchTrips();

      const data=trips.map((trip, index) => ({
        NumberPlate: trip.NumberPlate,
        To: trip.to,
        From: trip.from,
        StartDate: trip.startDate,
        EndDate: trip.endDate,

      }))

      const rows = data.map(item => 
        Object.values(item)
      );

      console.log(rows)
      console.log(data)
      const table = {
        columns: columns,
        rows: rows,
        title: "Trips"
      }
      
      generatePdf([table], `Trips_${reportInfo["Start Date"]}_${reportInfo["End Date"]}`, reportInfo["Start Date"], reportInfo["End Date"])
    }

    //Assets
    if (metaData["Report Type"] == "Unitwise" && unitType == "Assets") {
      const columns = ["Investment ID", "Investor", "Number Plate", "Type", "Brand", "Model"];

      const fetchAssets = async () => {
          // Fetch assets with pagination and filter
        try {
          const response = await axios.get("/assets", {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: 1, search: "" }, // Adjust based on API
          });

          setAssets(response.data.assets)
          console.log(response)

        } catch (error) {
          console.error("Error fetching assets:", error);
          // toast.error("Failed to fetch users to be verified.")
          // Redirect to login if authentication fails
          if (error.response && error.response.status === 401) {
            navigate("/login");
          }
        }
      };
  
      await fetchAssets();

      const data=assets.map((asset, index) => ({
        investmentId: asset.investment.investmentId,
        numberPlate: asset.NumberPlate,
        type: asset.Type,
        brand: asset.Brand,
        model: asset.Model,
        investor: asset.investment.investor.name,
      }))

      const rows = data.map(item => 
        Object.values(item)
      );

      console.log(rows)
      console.log(data)
      const table = {
        columns: columns,
        rows: rows,
        title: "Assets"
      }
      
      generatePdf([table], `Assets_${reportInfo["Start Date"]}_${reportInfo["End Date"]}`, reportInfo["Start Date"], reportInfo["End Date"])
    }

    //Investments
    if (metaData["Report Type"] == "Unitwise" && unitType == "Investments") {
      const columns = ["Investment ID", "Investor Name", "Investor ID", "Amount (AED)", "ROI %", "Deposit Date", "Maturity Date"];

      const fetchInvestments = async () => {
          // Fetch investments with pagination and filter
        try {
          const response = await axios.get("/investments", {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: 1, search: "" }, // Adjust based on API
          });

          setInvestments(response.data.investments)
          console.log(response)

        } catch (error) {
          console.error("Error fetching investments:", error);
          // toast.error("Failed to fetch users to be verified.")
          // Redirect to login if authentication fails
          if (error.response && error.response.status === 401) {
            navigate("/login");
          }
        }
      };
  
      await fetchInvestments();

      const data=investments.map((investment, index) => ({
        investmentId: investment.investmentId,
        investorName: investment.investor.name,
        investorId: investment.investor.userId,
        amount: `${Number(investment.amount).toLocaleString()}`,
        ROI: investment.ROI,
        investmentDate: investment.investmentDate
          ? new Date(investment.investmentDate).toLocaleDateString()
          : "N/A",
        maturityDate: investment.maturityDate
          ? new Date(investment.maturityDate).toLocaleDateString()
          : "N/A",
      }))

      const rows = data.map(item => 
        Object.values(item)
      );

      console.log(rows)
      console.log(data)
      const table = {
        columns: columns,
        rows: rows,
        title: "Investments"
      }
      
      generatePdf([table], `Investments_${reportInfo["Start Date"]}_${reportInfo["End Date"]}`, reportInfo["Start Date"], reportInfo["End Date"])
    }

    // Unit Report

    // Users
    if (metaData["Report Type"] == "Unit Report" && unitType == "Users") {
      console.log(users)
      console.log(metaData)

      for (const u of users) {
        if (u.name == metaData["UnitName"]){
          setUser(u)
          break;          
        }
      };
      
      userReport(user)
    }

    // Assets
    if (metaData["Report Type"] == "Unit Report" && unitType == "Assets") {
      console.log(assets)
      console.log(metaData)

      for (const a of assets) {
        if (a["NumberPlate"] == metaData["UnitName"]){
          setAsset(a)
          break;          
        }
      };
      x``
      assetReport(asset)
    }

    // Trips
    if (metaData["Report Type"] == "Unit Report" && unitType == "Trips") {
      console.log(trips)
      console.log(metaData)

      for (const t of trips) {
        if (t["NumberPlate"] == metaData["UnitName"]){
          setTrip(t) 
          break;          
        }
      };
      
      assetReport(asset)
    }

    // Investments
    if (metaData["Report Type"] == "Unit Report" && unitType == "Investments") {
      console.log(investments)
      console.log(metaData)

      for (const i of investments) {
        if (i["investmentId"] == metaData["UnitName"]){
          console.log(i)
          setInvestment(i)
          break;          
        }
      };
      investmentReport(investment)
    }

    if (metaData["Report Type"] == "Tracker") {

      console.log(trackers)
      console.log(metaData)

      for (const i of investments) {
        if (i["investmentId"] == metaData["UnitName"]){
          console.log(i)
          setInvestment(i)
          break;          
        }
      };
      investmentReport(investment)
    }

  }

  const handleChange = (field, value) => {
    setReportInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUnitTypeChange = async (value) => {
    setUnitType(value);
    setUnitName("");
    // setErrors((prev) => ({ ...prev, unitType: "", unitName: ""}));

    // Simulate fetching unit names from database
    if (value) {
      let names = [];
      if (value === "Users") {
        const data=users.map((user, index) => ({
          Name: user.name,
        }))

        console.log(data)
  
        names = data.map(item => 
          Object.values(item)[0]
        );

        console.log(names)

      } else if (value === "Assets") {
        const data=assets.map((asset, index) => ({
          Name: asset["NumberPlate"],
        }))

        console.log(data)
  
        names = data.map(item => 
          Object.values(item)[0]
        );

        console.log(names)

      } else if (value === "Trips") {
        console.log(trips)
        const data=trips.map((trip, index) => ({
          Name: `${trip.NumberPlate}, ${new Date(trip.startDate).toLocaleDateString()}`,
        }))

        console.log(data)
  
        names = data.map(item => 
          Object.values(item)[0]
        );

        console.log(names)

      } else if (value === "Investments") {
        const data=investments.map((investment, index) => ({
          Name: investment.investmentId,
        }))

        console.log(data)
  
        names = data.map(item => 
          Object.values(item)[0]
        );

        console.log(names)

      }
      setUnitNames(names);
      console.log(unitNames)
      console.log("hi")
    } else {
      setUnitNames([]);
    }
  };

  const handleTrackersReportTypeChange = (value) => {
    setTrackersReportType(value);

    setUnitName("");
    // setErrors((prev) => ({ ...prev, unitType: "", unitName: ""}));

    // Simulate fetching unit names from database
    if (value) {

      let names = ["Asset1qq", "Asset2", "Asset3"];
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
    if (reportInfo["Report Type"] === "Unitwise" || reportInfo["Report Type"] === "Unit Report") {
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
    }
    if (validateForm()) {
      console.log("Downloading report with metaData:", metaData);
      fetchData(metaData)
      // Generate and download the report based on the provided information
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
                    <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
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
                    <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
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
                      <p className="text-red-500 text-sm mt-1">{errors.unitType}</p>
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
                      onChange={(e) => handleTrackersReportTypeChange(e.target.value)}
                      className="w-full p-2 text-md text-black rounded-lg"
                    >
                      <option value="">Select Trackers Report Type</option>
                      <option value="Cumulative">Cumulative</option>
                      <option value="TrackerwiseConcise">Tracker-wise Concise</option>
                      <option value="Specific">Specific</option>
                    </select>
                    {errors.trackersReportType && (
                      <p className="text-red-500 text-sm mt-1">{errors.trackersReportType}</p>
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
                          onChange={(e) => {
                            setUnitName(e.target.value);
                            // setErrors((prev) => ({ ...prev, unitName: "" }));
                          }}
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
                          <p className="text-red-500 text-sm mt-1">{errors.unitName}</p>
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
                        <p className="text-red-500 text-sm mt-1">{errors.unitType}</p>
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
                          onChange={(e) => {
                            setUnitName(e.target.value);
                            // setErrors((prev) => ({ ...prev, unitName: "" }));
                          }}
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
                          <p className="text-red-500 text-sm mt-1">{errors.unitName}</p>
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
                {console.log(Object)}
                {console.log(Object.keys(errors))}
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