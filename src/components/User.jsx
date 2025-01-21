// src/components/User.jsx

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import { AdminContext } from "../contexts/AdminContext.jsx";
import { toast } from "react-toastify";
import RenderFieldValue from "./RenderFieldValue.jsx"; // Import the helper component
import userReport from "../ui/userReport.js";

const User = () => {
  const { id } = useParams(); // Get User ID from URL
  const navigate = useNavigate();
  const { admin, token } = useContext(AdminContext); // Access authenticated admin user

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [modifiedFields, setModifiedFields] = useState({});
  const [selectedVerifier, setSelectedVerifier] = useState(""); // State for selected verifier
  const [selectedDeleteVerifier, setSelectedDeleteVerifier] = useState(""); // State for delete verifier

  // Additional state for admin actions (e.g., assigning verifier)
  const [adminsList, setAdminsList] = useState([]);

  useEffect(() => {
    // Function to fetch admins for assigning as verifier
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("/admins"); // Ensure backend has this endpoint
        // Exclude the current admin from the list
        const otherAdmins = response.data.admins.filter(
          (adminItem) => adminItem._id !== admin._id
        );
        setAdminsList(otherAdmins);
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast.error("Failed to fetch admins.");
      }
    };

    fetchAdmins();
  }, [admin]);

  useEffect(() => {
    // Function to fetch user details
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/${id}`); // Ensure backend has this endpoint
        setUserData(response.data);
        setOriginalUserData(response.data); // Keep a copy of the original data
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to fetch user details.");
      }
    };

    // Ensure only admins can access
    if (
      token &&
      admin &&
      ["admin", "superadmin", "manager"].includes(admin.role)
    ) {
      fetchUser();
    } else {
      toast.error("Access denied.");
      navigate("/login");
    }
  }, [id, admin, token, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setModifiedFields({});
  };

  const handleDiscard = () => {
    setUserData(originalUserData);
    setModifiedFields({});
    setIsEditing(false);
    toast.info("Changes have been discarded.");
  };

  const handleChange = (section, field, value, index = null) => {
    let prefix =
      userData.userType === "Company" ? "companyDetails" : "individualDetails";
    const key =
      index !== null
        ? `${prefix}.${section}.${index}.${field}`
        : `${prefix}.${section}.${field}`;

    setModifiedFields((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Update userData accordingly
    if (userData.userType === "Company") {
      setUserData((prev) => {
        if (Array.isArray(prev.companyDetails[section])) {
          const updatedArray = [...prev.companyDetails[section]];
          updatedArray[index] = {
            ...prev.companyDetails[section][index],
            [field]: value,
          };
          return {
            ...prev,
            companyDetails: {
              ...prev.companyDetails,
              [section]: updatedArray,
            },
          };
        } else {
          return {
            ...prev,
            companyDetails: {
              ...prev.companyDetails,
              [section]: {
                ...prev.companyDetails[section],
                [field]: value,
              },
            },
          };
        }
      });
    } else {
      setUserData((prev) => ({
        ...prev,
        individualDetails: {
          ...prev.individualDetails,
          [section]: {
            ...prev.individualDetails[section],
            [field]: value,
          },
        },
      }));
    }
  };

  const handleBasicInfoChange = (field, value) => {
    // Update modified fields with dot notation
    setModifiedFields((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update userData
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Check if verifier is selected
      if (!selectedVerifier) {
        toast.error("Please select a verifier.");
        return;
      }

      // Construct payload with only modified fields
      const payload = {
        update: modifiedFields,
        verifier: selectedVerifier,
      };

      console.log("Submitting update payload:", payload); // Debug log

      // Send POST request to update user data
      const response = await axios.post(`/users/admin/update/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure token is sent for authentication
        },
      });

      if (response.status === 201) {
        toast.success("Update request submitted and is pending approval.");
        setIsEditing(false);
        setModifiedFields({}); // Reset modified fields
        setSelectedVerifier(""); // Reset verifier selection

        // Optionally, notify the user or refresh data if immediate changes are visible
      }
    } catch (error) {
      console.error("Error updating user:", error);
      const errorMessage =
        error.response?.data?.error ||
        "Failed to submit update request. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to request deletion of this user?")
    ) {
      try {
        if (!selectedDeleteVerifier) {
          toast.error("Please select a verifier for deletion.");
          return;
        }

        const payload = {
          verifier: selectedDeleteVerifier,
        };

        console.log("Submitting delete payload:", payload); // Debug log

        const response = await axios.post(
          `/users/admin/delete/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Ensure token is sent for authentication
            },
          }
        );

        if (response.status === 201) {
          toast.success("Delete request submitted and is pending approval.");
          navigate("/users"); // Redirect or update the UI as needed
        }
      } catch (error) {
        console.error("Error submitting delete request:", error);
        const errorMessage =
          error.response?.data?.error ||
          "Failed to submit delete request. Please try again.";
        toast.error(errorMessage);
      }
    }
  };

    const handleReport = async () => {
      userReport(userData)
    };

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#322323] text-white w-full">
        Loading user data...
      </div>
    );
  }

  // Fields to display in Basic Information
  const basicInfoFields = [
    "userId",
    "userType",
    "name",
    "email",
    "phone",
    "DOB",
    "address", // Changed to lowercase for consistency
    // "NoofTrips", // Remove if not present in the model
    "createdAt",
  ];

  // Fields that should not be editable
  const nonEditableFields = ["userId", "email", "createdAt", "phone"];

  // Mapping field keys to display labels
  const fieldLabels = {
    userId: "Investor ID",
    userType: "User Type",
    name: "Name",
    email: "Email",
    phone: "Phone",
    DOB: "Date of Birth",
    address: "Address",
    // NoofTrips: "No. of Trips", // Remove if not present
    createdAt: "Created At",
    gender: "Gender",
    bankDetails: "Bank Details",
    accountNumber: "Account Number",
    bankName: "Bank Name",
    IBAN: "IBAN",
    swiftCode: "SWIFT Code",
    passportDetails: "Passport Details",
    passportNumber: "Passport Number",
    placeOfIssue: "Place of Issue",
    dateOfIssue: "Date of Issue",
    dateOfExpiry: "Date of Expiry",
    passportCopy: "Passport Copy",
    emiratesID: "Emirates ID",
    country: "Country",
    idNumber: "ID Number",
    nationality: "Nationality",
    nominee: "Nominee",
    relationship: "Relationship",
    contactDetails: "Contact Details",
    phoneNumber: "Phone Number",
    poBox: "P.O. Box",
    signingAuthorities: "Signing Authorities",
    groupCompanies: "Group Companies",
    powerOfAttorney: "Power of Attorney",
    holderName: "Holder Name",
    pdfCopy: "PDF Copy",
    companyName: "Company Name",
    tradeLicense: "Trade License",
    number: "Number",
    expiryDate: "Expiry Date",
    // Add more field mappings as needed
  };

  // Function to beautify field keys
  const beautifyFieldKey = (key) => {
    return fieldLabels[key] || key;
  };

  return (
    <div className="flex min-h-screen bg-[#322323] w-full">
      <div className="flex justify-center w-full h-full bg-[#322323] p-4 overflow-y-auto">
        <div className="w-3/5 bg-[#493939] rounded-lg shadow-md p-6 my-6 lg:m-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="ml-10 text-3xl font-bold text-[#FF9321]">
              User Information
            </h2>
            <div>
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-md mr-2 bg-green-500 border text-white hover:border-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleDiscard}
                    className="px-4 py-2 rounded-md mr-2 bg-gray-500 border text-white hover:border-white"
                  >
                    Discard Changes
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 rounded-md mr-2 bg-[#FF9321] border border-[#FF9321] text-white hover:border-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-md bg-red-500 border border-red-500 text-white hover:border-white"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
            <div>
            <button
                onClick={handleReport}
                className="px-4 py-2 rounded-md bg-r-500 bg-[#FF9321] border border-[#FF9321] text-white hover:border-white"
              >
                Report
              </button>
            </div>
          </div>

          {/* Verifier Selection */}
          {isEditing && (
            <div className="border border-[#FF9321] rounded-lg p-4 mb-4 mx-6">
              <h3 className="text-lg font-bold mb-2 text-[#FF9321]">
                Select Verifier
              </h3>
              <div className="p-4 flex justify-around items-center w-full h-12">
                <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                  Verifier
                </span>
                <select
                  value={selectedVerifier}
                  onChange={(e) => setSelectedVerifier(e.target.value)}
                  className="w-1/2 p-2 text-md text-black rounded-lg"
                >
                  <option value="">Select Verifier</option>
                  {adminsList.map((adminItem) => (
                    <option key={adminItem._id} value={adminItem._id}>
                      {adminItem.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Verifier Selection for Delete */}
          {!isEditing && (
            <div className="border border-[#FF9321] rounded-lg p-4 mb-4 mx-6">
              <h3 className="text-lg font-bold mb-2 text-[#FF9321]">
                Select Verifier for Deletion
              </h3>
              <div className="p-4 flex justify-around items-center w-full h-12">
                <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                  Verifier
                </span>
                <select
                  value={selectedDeleteVerifier}
                  onChange={(e) => setSelectedDeleteVerifier(e.target.value)}
                  className="w-1/2 p-2 text-md text-black rounded-lg"
                >
                  <option value="">Select Verifier</option>
                  {adminsList.map((adminItem) => (
                    <option key={adminItem._id} value={adminItem._id}>
                      {adminItem.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="border border-[#FF9321] rounded-lg p-4 mb-4 mx-6">
            <h3 className="text-lg font-bold mb-2 text-[#FF9321]">
              Basic Information
            </h3>
            {basicInfoFields.map((fieldKey) => (
              <div
                key={fieldKey}
                className="p-4 flex justify-around items-center w-full h-12"
              >
                <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                  {beautifyFieldKey(fieldKey)}
                </span>
                {isEditing && !nonEditableFields.includes(fieldKey) ? (
                  <input
                    type={
                      fieldKey.toLowerCase().includes("date") ? "date" : "text"
                    }
                    value={
                      userData[fieldKey] !== null &&
                      userData[fieldKey] !== undefined
                        ? userData[fieldKey]
                        : ""
                    }
                    onChange={(e) =>
                      handleBasicInfoChange(fieldKey, e.target.value)
                    }
                    className="w-1/2 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                  />
                ) : (
                  <span className="w-1/2 text-md font-semibold text-white text-center">
                    {userData[fieldKey] || "N/A"}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Individual or Company Information */}
          {userData.userType === "Individual" && userData.individualDetails ? (
            <div className="grid grid-cols-2 gap-2 lg:m-6 my-6">
              {Object.entries(userData.individualDetails).map(
                ([sectionKey, sectionData]) => (
                  <div
                    key={sectionKey}
                    className="border border-[#FF9321] rounded-lg p-4 mb-4"
                  >
                    <h3 className="text-lg font-bold mb-2 text-[#FF9321]">
                      {beautifyFieldKey(sectionKey)}
                    </h3>
                    {typeof sectionData === "object" ? (
                      Object.entries(sectionData).map(
                        ([fieldKey, fieldValue]) => (
                          <div
                            key={fieldKey}
                            className="p-4 flex justify-around items-center w-full h-auto"
                          >
                            <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                              {beautifyFieldKey(fieldKey)}
                            </span>
                            {isEditing ? (
                              typeof fieldValue === "object" ? (
                                <div className="w-1/2 text-md font-semibold text-white text-center">
                                  {Object.entries(fieldValue).map(
                                    ([subKey, subValue]) => (
                                      <div key={subKey} className="mb-1">
                                        <strong>
                                          {beautifyFieldKey(subKey)}:
                                        </strong>{" "}
                                        {subValue}
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <input
                                  type={
                                    fieldKey.toLowerCase().includes("date")
                                      ? "date"
                                      : "text"
                                  }
                                  value={
                                    fieldValue !== null &&
                                    fieldValue !== undefined
                                      ? fieldValue
                                      : ""
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      sectionKey,
                                      fieldKey,
                                      e.target.value
                                    )
                                  }
                                  className="w-1/2 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                                />
                              )
                            ) : (
                              <RenderFieldValue
                                value={fieldValue}
                                beautifyFieldKey={beautifyFieldKey}
                              />
                            )}
                          </div>
                        )
                      )
                    ) : (
                      <div className="p-4 text-white">{sectionData || ""}</div>
                    )}
                  </div>
                )
              )}
            </div>
          ) : userData.userType === "Company" && userData.companyDetails ? (
            <div className="grid grid-cols-2 gap-2 lg:m-6 my-6">
              {Object.entries(userData.companyDetails).map(
                ([sectionKey, sectionData]) => (
                  <div
                    key={sectionKey}
                    className="border border-[#FF9321] rounded-lg p-4 mb-4"
                  >
                    <h3 className="text-lg font-bold mb-2 text-[#FF9321]">
                      {beautifyFieldKey(sectionKey)}
                    </h3>
                    {Array.isArray(sectionData) ? (
                      sectionData.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col p-2 border-b border-[#FF9321]"
                        >
                          {Object.entries(item).map(
                            ([fieldKey, fieldValue]) => (
                              <div
                                key={fieldKey}
                                className="p-2 flex justify-between items-center w-full"
                              >
                                <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                                  {beautifyFieldKey(fieldKey)}
                                </span>
                                {isEditing ? (
                                  typeof fieldValue === "object" ? (
                                    <div className="w-1/2 text-md font-semibold text-white text-center">
                                      {Object.entries(fieldValue).map(
                                        ([subKey, subValue]) => (
                                          <div key={subKey} className="mb-1">
                                            <strong>
                                              {beautifyFieldKey(subKey)}:
                                            </strong>{" "}
                                            {subValue}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    <input
                                      type={
                                        fieldKey.toLowerCase().includes("date")
                                          ? "date"
                                          : "text"
                                      }
                                      value={
                                        fieldValue !== null &&
                                        fieldValue !== undefined
                                          ? fieldValue
                                          : ""
                                      }
                                      onChange={(e) =>
                                        handleChange(
                                          sectionKey,
                                          fieldKey,
                                          e.target.value,
                                          index
                                        )
                                      }
                                      className="w-1/2 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                                    />
                                  )
                                ) : (
                                  <RenderFieldValue
                                    value={fieldValue}
                                    beautifyFieldKey={beautifyFieldKey}
                                  />
                                )}
                              </div>
                            )
                          )}
                        </div>
                      ))
                    ) : typeof sectionData === "object" ? (
                      Object.entries(sectionData).map(
                        ([fieldKey, fieldValue]) => (
                          <div
                            key={fieldKey}
                            className="p-4 flex justify-around items-center w-full h-12"
                          >
                            <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                              {beautifyFieldKey(fieldKey)}
                            </span>
                            {isEditing ? (
                              typeof fieldValue === "object" ? (
                                <div className="w-1/2 text-md font-semibold text-white text-center">
                                  {Object.entries(fieldValue).map(
                                    ([subKey, subValue]) => (
                                      <div key={subKey} className="mb-1">
                                        <strong>
                                          {beautifyFieldKey(subKey)}:
                                        </strong>{" "}
                                        {subValue}
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <input
                                  type={
                                    fieldKey.toLowerCase().includes("date")
                                      ? "date"
                                      : "text"
                                  }
                                  value={
                                    fieldValue !== null &&
                                    fieldValue !== undefined
                                      ? fieldValue
                                      : ""
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      sectionKey,
                                      fieldKey,
                                      e.target.value
                                    )
                                  }
                                  className="w-1/2 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                                />
                              )
                            ) : (
                              <RenderFieldValue
                                value={fieldValue}
                                beautifyFieldKey={beautifyFieldKey}
                              />
                            )}
                          </div>
                        )
                      )
                    ) : (
                      <div className="p-4 text-white">{sectionData || ""}</div>
                    )}
                  </div>
                )
              )}
            </div>
          ) : null}

          {/* Assets Section */}
          <div className="border border-[#FF9321] rounded-lg p-4 mb-4 mx-6">
            <h3 className="text-lg font-bold mb-2 text-[#FF9321]">Assets</h3>
            {userData.assets && userData.assets.length > 0 ? (
              userData.assets.map((asset) => (
                <div
                  key={asset._id}
                  className="p-4 flex justify-around items-center w-full h-12 cursor-pointer hover:bg-[#634040] rounded-md"
                  onClick={() => navigate(`/asset/${asset._id}`)}
                >
                  <span className="w-full text-md font-semibold text-white text-center">
                    {asset.NumberPlate || "No Number Plate"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-white">No assets found.</p>
            )}
          </div>

          {/* Investments Section */}
          <div className="border border-[#FF9321] rounded-lg p-4 mb-4 mx-6">
            <h3 className="text-lg font-bold mb-2 text-[#FF9321]">
              Investments
            </h3>
            {userData.investments && userData.investments.length > 0 ? (
              userData.investments.map((investment, index) => (
                <div
                  key={investment._id}
                  className="p-4 flex justify-around items-center w-full h-12 cursor-pointer hover:bg-[#634040] rounded-md"
                  onClick={() => navigate(`/investment/${investment._id}`)} // Ensure investment detail route exists
                >
                  <span className="w-full text-md font-semibold text-white text-center">
                    {investment.investmentId || "No Investment ID"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-white">No investments found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
