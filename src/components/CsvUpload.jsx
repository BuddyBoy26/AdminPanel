// src/components/CsvUploader.jsx

import React, { useState } from "react";
import Papa from "papaparse";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TheTable from "./TheTable.jsx"; // Ensure the path is correct

const CsvUploader = () => {
  const [csvData, setCsvData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unitType, setUnitType] = useState(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      toast.error("Please select a CSV file.");
      return;
    }

    // Validate file type and extension
    const isCsv =
      file.type === "text/csv" ||
      file.type === "application/vnd.ms-excel" ||
      file.name.endsWith(".csv");

    if (!isCsv) {
      toast.error("Please upload a valid CSV file.");
      return;
    }

    setLoading(true);

    Papa.parse(file, {
      header: true, // Treat the first row as headers
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data;
        const parsedColumns = results.meta.fields;

        setCsvData(parsedData);
        setColumns(parsedColumns);
        setLoading(false);
        toast.success("CSV file uploaded and parsed successfully.");
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setLoading(false);
        toast.error("Error parsing CSV file.");
      },
    });
  };

  return (
    <div className="w-full flex flex-col bg-[#322323] p-6 rounded-md shadow-md min-h-screen">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* CSV Uploader Header */}
      <h1 className="text-3xl sm:text-4xl font-bold text-[#FF9321] mb-7">
          Upload CSV
        </h1>

      {/* File Input */}
      <label className="flex flex-col items-center px-4 py-6 bg-[#FF9321] text-white rounded-md border border-[#FF9321] hover:border-white transition duration-300 ease-in-out transform shadow-lg hover:shadow-xl max-w-screen-md mb-4">
        <span className="mb-2 text-2xl">Click to upload CSV</span>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      <div className="w-2/3">
                      <select
                        value={unitType}
                        // onChange={(e) => handleUnitTypeChange(e.target.value)}
                        className="w-full p-2 text-md text-black rounded-lg"
                      >
                        <option value="">Select Unit Type</option>
                        <option value="Users">Users</option>
                        <option value="Assets">Assets</option>
                        <option value="Trips">Trips</option>
                        <option value="Investments">Investments</option>
                      </select>
                    </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center mt-4 text-white">
          Parsing CSV...
        </div>
      )}

      {/* Display CSV Data */}
      {csvData.length > 0 && !loading && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-[#FF9321] mb-4">CSV Data</h3>
          <TheTable
            data={csvData}
            columns={columns.map((col) => ({ header: col, accessor: col }))}
            link="#" // Set to "#" or appropriate link if needed
            clickable={false} // Set to true if rows should be clickable
          />
<div class="flex items-center justify-center ">
        <button
          // onClick={handleCreateAssetClick}
          className="mt-4 mx- sm:mt-0 sm:relative sm:right-10 px-5 py-2 bg-green-500 border border-green-500 text-white rounded-md hover:border-white transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
          aria-label="Save"
        >
          Create Unit
        </button>
        </div>
        </div>
      )}

      
    </div>
  );
};

export default CsvUploader;