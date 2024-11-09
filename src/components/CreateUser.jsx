// src/components/CreateUser.jsx

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios"; // Ensure axios is correctly configured
import { AdminContext } from "../contexts/AdminContext.jsx";
import { toast } from "react-toastify";

const CreateUser = () => {
  const { user } = useContext(AdminContext); // Access current user
  const navigate = useNavigate();

  // State for loading indicator
  const [loading, setLoading] = useState(true);

  // State for Basic Information
  const [basicInfo, setBasicInfo] = useState({
    Type: "Company",
    ID: "",
    Name: "",
    Email: "",
    Phone: "",
    "Agreed ROI": "",
    "Initial Investment Value": "",
  });

  // State for Individual Information
  const [individualInfo, setIndividualInfo] = useState({
    "Personal Details": {
      Gender: "",
      DOB: "",
      Address: "",
      "PO Box": "",
    },
    "Bank Details": {
      "Bank Name": "",
      "Account Name": "",
      IBAN: "",
      "Swift Code": "",
    },
    "Passport Details": {
      "Passport Number": "",
      "Place of Issue": "",
      "Date of Issue": "",
      "Date of Expiry": "",
      "Soft Copy": "",
    },
    "UID Details": {
      Country: "",
      Number: "",
      "Date of Issue": "",
    },
    "Nominee Details": {
      Name: "",
      Relationship: "",
      Email: "",
      Phone: "",
      Address: "",
      "PO Box": "",
    },
  });

  // State for Company Information
  const [companyInfo, setCompanyInfo] = useState({
    "Trade License Details": {
      Number: "",
      "Issue Date": "",
      "Expiry Date": "",
      "Place of Establishment": "",
      "Soft Copy": "",
    },
    "Signing Authorities": [{ Name: "" }],
    "Contact Details": {
      "Point Of Contact": "",
      Email: "",
      "Phone Number": "",
      Address: "",
      "PO Box": "",
    },
    "Group Companies": [{ Name: "" }],
    "Bank Details": {
      "Bank Name": "",
      "Account Name": "",
      IBAN: "",
      "Swift Code": "",
    },
    "Power of Attorney Details": {
      Binary: "",
      Name: "",
      Email: "",
      "Phone Number": "",
      Address: "",
      "PO Box": "",
      "Soft Copy": "",
    },
  });

  useEffect(() => {
    // Simulate API call with setTimeout
    // Replace this with actual API call if necessary
    setTimeout(() => {
      // Dummy data fetched from "database"
      const fetchedBasicInfo = {
        Type: "Company",
        ID: "C-12345",
        Name: "Tech Innovators Ltd.",
        Email: "contact@techinnovators.com",
        Phone: "+1 234 567 8900",
        "Agreed ROI": "8%",
        "Initial Investment Value": "$50,000",
      };

      const fetchedCompanyInfo = {
        "Trade License Details": {
          Number: "TL-98765",
          "Issue Date": "2023-01-15",
          "Expiry Date": "2028-01-15",
          "Place of Establishment": "Silicon Valley",
          "Soft Copy": "trade_license.pdf",
        },
        "Signing Authorities": [
          { Name: "Alice Johnson" },
          { Name: "Bob Smith" },
        ],
        "Contact Details": {
          "Point Of Contact": "Charlie Brown",
          Email: "charlie.brown@techinnovators.com",
          "Phone Number": "+1 234 567 8901",
          Address: "123 Innovation Drive, Silicon Valley",
          "PO Box": "54321",
        },
        "Group Companies": [
          { Name: "InnovateX" },
          { Name: "FutureTech" },
        ],
        "Bank Details": {
          "Bank Name": "Bank of Innovation",
          "Account Name": "Tech Innovators Ltd.",
          IBAN: "US00BOI1234567890",
          "Swift Code": "BOIUS3N",
        },
        "Power of Attorney Details": {
          Binary: "Yes",
          Name: "Diana Prince",
          Email: "diana.prince@techinnovators.com",
          "Phone Number": "+1 234 567 8902",
          Address: "456 Enterprise Road, Silicon Valley",
          "PO Box": "67890",
          "Soft Copy": "power_of_attorney.pdf",
        },
      };

      const fetchedIndividualInfo = {
        "Personal Details": {
          Gender: "Female",
          DOB: "1985-06-25",
          Address: "789 Maple Street, Springfield",
          "PO Box": "11223",
        },
        "Bank Details": {
          "Bank Name": "National Bank",
          "Account Name": "Jane Doe",
          IBAN: "US00NAT1234567890",
          "Swift Code": "NATUS33",
        },
        "Passport Details": {
          "Passport Number": "P1234567",
          "Place of Issue": "Springfield",
          "Date of Issue": "2015-05-20",
          "Date of Expiry": "2025-05-20",
          "Soft Copy": "passport.pdf",
        },
        "UID Details": {
          Country: "USA",
          Number: "U123456789",
          "Date of Issue": "2016-07-15",
        },
        "Nominee Details": {
          Name: "John Doe",
          Relationship: "Spouse",
          Email: "john.doe@example.com",
          Phone: "+1 234 567 8903",
          Address: "789 Maple Street, Springfield",
          "PO Box": "11223",
        },
      };

      // Update states with fetched data
      setBasicInfo(fetchedBasicInfo);
      setCompanyInfo(fetchedCompanyInfo);
      setIndividualInfo(fetchedIndividualInfo);
      setLoading(false);
    }, 2000); // Simulate 2 seconds delay
  }, []);

  // Handler for changing basic information fields
  const handleBasicInfoChange = (field, value) => {
    setBasicInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Handler for changing nested information fields
  const handleChange = (section, field, value, index = null) => {
    if (basicInfo.Type === "Company") {
      setCompanyInfo((prev) => {
        if (Array.isArray(prev[section])) {
          const updatedArray = [...prev[section]];
          updatedArray[index] = { ...updatedArray[index], [field]: value };
          return { ...prev, [section]: updatedArray };
        } else {
          return { ...prev, [section]: { ...prev[section], [field]: value } };
        }
      });
    } else {
      setIndividualInfo((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    }
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEntryData =
      basicInfo.Type === "Company" ? companyInfo : individualInfo;
    const submissionData = { ...basicInfo, ...newEntryData };

    try {
      // Replace with your actual API endpoint
      const response = await axios.post("/api/create-user", submissionData);

      if (response.status === 201) {
        toast.success("User created successfully!");
        navigate("/users", { state: { showAlert: true } });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(
        error.response?.data?.message || "Failed to create user. Please try again."
      );
    }
  };

  // Handlers for adding new Signatory and Group Company
  const addSignatory = () => {
    setCompanyInfo((prev) => ({
      ...prev,
      "Signing Authorities": [...prev["Signing Authorities"], { Name: "" }],
    }));
  };

  const addGroupCompany = () => {
    setCompanyInfo((prev) => ({
      ...prev,
      "Group Companies": [...prev["Group Companies"], { Name: "" }],
    }));
  };

  // If data is still loading, show a loading indicator
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center bg-[#322323] min-h-[calc(100vh-64px)]">
        <p className="text-white text-xl">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      <div className="flex justify-center w-full p-4 overflow-y-auto custom-scrollbar">
        <div className="w-4/5 bg-[#493939] rounded-lg shadow-md p-6 my-6 lg:m-6">
          <h2 className="text-4xl font-bold text-[#FF9321] mb-4">Create User</h2>
          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Basic Information
              </h3>

              {Object.keys(basicInfo).map((key) => (
                <div key={key} className="flex items-center mb-4">
                  <label className="w-1/3 text-lg font-semibold text-white">
                    {key}
                  </label>
                  {key === "Type" ? (
                    <select
                      value={basicInfo.Type}
                      onChange={(e) =>
                        handleBasicInfoChange("Type", e.target.value)
                      }
                      className="w-2/3 p-2 rounded-md text-black"
                      required
                    >
                      <option value="Company">Company</option>
                      <option value="Individual">Individual</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={basicInfo[key]}
                      onChange={(e) =>
                        handleBasicInfoChange(key, e.target.value)
                      }
                      className="w-2/3 p-2 text-black rounded-md"
                      required
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Conditional Rendering Based on Type */}
            {basicInfo.Type === "Company" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(companyInfo).map(([sectionKey, sectionData]) => (
                  <div
                    key={sectionKey}
                    className="bg-[#493939] p-4 rounded-lg border border-[#FF9321]"
                  >
                    <h4 className="text-xl font-semibold text-[#FF9321] mb-3">
                      {sectionKey}
                    </h4>
                    {sectionKey === "Signing Authorities" ? (
                      <>
                        {sectionData.map((item, index) => (
                          <div key={index} className="flex items-center mb-3">
                            <label className="w-1/3 text-white font-semibold">
                              Signatory {index + 1}
                            </label>
                            <input
                              type="text"
                              value={item.Name || ""}
                              onChange={(e) =>
                                handleChange(
                                  sectionKey,
                                  "Name",
                                  e.target.value,
                                  index
                                )
                              }
                              className="w-2/3 p-2 text-black rounded-md"
                              required
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addSignatory}
                          className="mt-2 px-4 py-2 bg-[#FF9321] text-white rounded-md hover:bg-[#e6821e]"
                        >
                          Add Signatory
                        </button>
                      </>
                    ) : sectionKey === "Group Companies" ? (
                      <>
                        {sectionData.map((item, index) => (
                          <div key={index} className="flex items-center mb-3">
                            <label className="w-1/3 text-white font-semibold">
                              Company {index + 1}
                            </label>
                            <input
                              type="text"
                              value={item.Name || ""}
                              onChange={(e) =>
                                handleChange(
                                  sectionKey,
                                  "Name",
                                  e.target.value,
                                  index
                                )
                              }
                              className="w-2/3 p-2 text-black rounded-md"
                              required
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addGroupCompany}
                          className="mt-2 px-4 py-2 bg-[#FF9321] text-white rounded-md hover:bg-[#e6821e]"
                        >
                          Add Group Company
                        </button>
                      </>
                    ) : Array.isArray(sectionData) ? (
                      sectionData.map((item, index) => (
                        <div key={index} className="flex items-center mb-3">
                          <label className="w-1/3 text-white font-semibold">
                            Item {index + 1}
                          </label>
                          <input
                            type="text"
                            value={item.Name || ""}
                            onChange={(e) =>
                              handleChange(
                                sectionKey,
                                "Name",
                                e.target.value,
                                index
                              )
                            }
                            className="w-2/3 p-2 text-black rounded-md"
                            required
                          />
                        </div>
                      ))
                    ) : (
                      Object.entries(sectionData).map(
                        ([fieldKey, fieldValue]) => (
                          <div
                            key={fieldKey}
                            className="flex items-center mb-3"
                          >
                            <label className="w-1/3 text-white font-semibold">
                              {fieldKey}
                            </label>
                            <input
                              type="text"
                              value={fieldValue || ""}
                              onChange={(e) =>
                                handleChange(
                                  sectionKey,
                                  fieldKey,
                                  e.target.value
                                )
                              }
                              className="w-2/3 p-2 text-black rounded-md"
                              required
                            />
                          </div>
                        )
                      )
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(individualInfo).map(
                  ([sectionKey, sectionData]) => (
                    <div
                      key={sectionKey}
                      className="bg-[#493939] p-4 rounded-lg border border-[#FF9321]"
                    >
                      <h4 className="text-xl font-semibold text-[#FF9321] mb-3">
                        {sectionKey}
                      </h4>
                      {Object.entries(sectionData).map(
                        ([fieldKey, fieldValue]) => (
                          <div
                            key={fieldKey}
                            className="flex items-center mb-3"
                          >
                            <label className="w-1/3 text-white font-semibold">
                              {fieldKey}
                            </label>
                            <input
                              type="text"
                              value={fieldValue || ""}
                              onChange={(e) =>
                                handleChange(
                                  sectionKey,
                                  fieldKey,
                                  e.target.value
                                )
                              }
                              className="w-2/3 p-2 text-black rounded-md"
                              required
                            />
                          </div>
                        )
                      )}
                    </div>
                  )
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white font-bold"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Separate component for Download Button (if needed in future)
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

export default CreateUser;
