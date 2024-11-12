// src/components/VerifyUser.jsx

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import { AdminContext } from "../contexts/AdminContext.jsx";
import { toast } from "react-toastify";

const VerifyUser = () => {
  const { id } = useParams(); // Get User ID from URL
  const navigate = useNavigate();
  const { admin, token } = useContext(AdminContext); // Access authenticated admin user

  const [isEditing, setIsEditing] = useState(true); // Open in edit mode by default
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Additional state for admin actions (e.g., assigning verifier)
  const [adminsList, setAdminsList] = useState([]);

  useEffect(() => {
    // Function to fetch admins for assigning as verifier
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("/admins"); // Ensure backend has this endpoint
        setAdminsList(response.data.admins);
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast.error("Failed to fetch admins.");
      }
    };

    fetchAdmins();
  }, []);

  useEffect(() => {
    // Function to fetch user details
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/users/${id}`); // Ensure backend has this endpoint
        // Initialize nested objects if they are missing
        const fetchedData = response.data;
        if (
          fetchedData.userType === "Individual" &&
          !fetchedData.individualDetails
        ) {
          fetchedData.individualDetails = {
            // Removed dateOfBirth and gender from here
            bankDetails: {
              accountNumber: "",
              bankName: "",
              IBAN: "",
              swiftCode: "",
            },
            passportDetails: {
              passportNumber: "",
              placeOfIssue: "",
              dateOfIssue: "",
              dateOfExpiry: "",
              passportCopy: null, // Changed to store File object
            },
            emiratesID: {
              country: "",
              idNumber: "",
              dateOfIssue: "",
              nationality: "",
            },
            nominee: {
              name: "",
              relationship: "",
              contactDetails: {
                address: "",
                phoneNumber: "",
                email: "",
                poBox: "",
              },
            },
          };
        } else if (
          fetchedData.userType === "Company" &&
          !fetchedData.companyDetails
        ) {
          fetchedData.companyDetails = {
            companyName: "",
            tradeLicense: {
              number: "",
              issueDate: "",
              expiryDate: "",
              pdfCopyFile: null, // Changed to store File object
            },
            signingAuthorities: [
              {
                name: "",
                contactDetails: {
                  pointOfContact: "",
                  phoneNumber: "",
                  email: "",
                  address: "",
                  poBox: "",
                },
              },
            ],
            groupCompanies: {
              name: "",
              placeOfEstablishment: "",
            },
            bankDetails: {
              accountNumber: "",
              bankName: "",
              IBAN: "",
              swiftCode: "",
            },
            powerOfAttorney: {
              holderName: "",
              contactDetails: {
                address: "",
                phoneNumber: "",
                email: "",
                poBox: "",
              },
              pdfCopyFile: null, // Changed to store File object
            },
          };
        }

        // Ensure basic information includes dateOfBirth and gender
        if (fetchedData.userType === "Individual") {
          if (!fetchedData.dateOfBirth) fetchedData.dateOfBirth = "";
          if (!fetchedData.gender) fetchedData.gender = "";
        }

        setUserData(fetchedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to fetch user details.");
        setLoading(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, admin, token]);

  // Helper function to set nested state
  const setNestedState = (obj, path, value) => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const lastObj = keys.reduce((o, key) => {
      if (o[key] === undefined) o[key] = {};
      return o[key];
    }, obj);
    lastObj[lastKey] = value;
    return { ...obj };
  };

  const handleChange = (path, value) => {
    setUserData((prev) => setNestedState({ ...prev }, path, value));
  };

  const handleFileChange = (path, fieldKey, file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      toast.error("File size exceeds the 5MB limit.");
      return;
    }

    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF files are allowed.");
      return;
    }

    setUserData((prev) => {
      const updatedData = { ...prev };
      const keys = path.split(".");
      const lastKey = keys.pop();
      const nested = keys.reduce(
        (o, key) => (o[key] = o[key] || {}),
        updatedData
      );
      nested[lastKey] = {
        ...nested[lastKey],
        [`${fieldKey}File`]: file, // Store the File object
      };
      return updatedData;
    });
  };

  const handleSave = async () => {
    // Front-end validation
    if (userData.userType === "Individual") {
      if (!userData.dateOfBirth) {
        toast.error("Date of Birth is required for Individual users.");
        return;
      }
      // Add any other required validations here
    }

    console.log("User Data to be saved:", userData); // Debugging

    try {
      // Create a FormData object
      const formData = new FormData();

      // Append basic fields
      formData.append("name", userData.name || "");
      formData.append("email", userData.email || "");
      formData.append("phone", userData.phone || "");

      if (userData.userType === "Individual") {
        formData.append("dateOfBirth", userData.dateOfBirth || "");
        formData.append("gender", userData.gender || "");

        // Append Individual Details as JSON strings
        formData.append(
          "individualDetails.bankDetails",
          JSON.stringify(userData.individualDetails.bankDetails)
        );

        formData.append(
          "individualDetails.passportDetails",
          JSON.stringify({
            passportNumber:
              userData.individualDetails.passportDetails.passportNumber,
            placeOfIssue:
              userData.individualDetails.passportDetails.placeOfIssue,
            dateOfIssue: userData.individualDetails.passportDetails.dateOfIssue,
            dateOfExpiry:
              userData.individualDetails.passportDetails.dateOfExpiry,
          })
        );

        formData.append(
          "individualDetails.emiratesID",
          JSON.stringify(userData.individualDetails.emiratesID)
        );

        formData.append(
          "individualDetails.nominee",
          JSON.stringify({
            name: userData.individualDetails.nominee.name,
            relationship: userData.individualDetails.nominee.relationship,
            contactDetails: userData.individualDetails.nominee.contactDetails,
          })
        );

        // Append Files
        if (userData.individualDetails.passportDetails.passportCopy) {
          formData.append(
            "individualDetails.passportDetails.passportCopy",
            userData.individualDetails.passportDetails.passportCopy
          );
        }

        if (userData.individualDetails.nominee.passportCopy) {
          formData.append(
            "individualDetails.nominee.passportCopy",
            userData.individualDetails.nominee.passportCopy
          );
        }
      } else if (userData.userType === "Company") {
        // Append Company Details as JSON string
        formData.append(
          "companyDetails",
          JSON.stringify({
            companyName: userData.companyDetails.companyName,
            signingAuthorities: userData.companyDetails.signingAuthorities,
            groupCompanies: userData.companyDetails.groupCompanies,
            bankDetails: userData.companyDetails.bankDetails,
            powerOfAttorney: {
              holderName: userData.companyDetails.powerOfAttorney.holderName,
              contactDetails:
                userData.companyDetails.powerOfAttorney.contactDetails,
            },
          })
        );

        // Append Trade License File
        if (userData.companyDetails.tradeLicense.pdfCopyFile) {
          formData.append(
            "companyDetails.tradeLicense.pdfCopy",
            userData.companyDetails.tradeLicense.pdfCopyFile
          );
        }

        // Append Power of Attorney File
        if (userData.companyDetails.powerOfAttorney.pdfCopyFile) {
          formData.append(
            "companyDetails.powerOfAttorney.pdfCopy",
            userData.companyDetails.powerOfAttorney.pdfCopyFile
          );
        }

        console.log(formData);
      }

      // Append Authentication Token if required by backend
      // formData.append("token", token); // Uncomment if needed

      // Send PATCH request to update user data
      const response = await axios.patch(`/users/${id}/complete`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure token is available
          "Content-Type": "multipart/form-data", // Set to multipart/form-data
        },
      });
      if (response.status === 200) {
        toast.success("User information updated successfully!");
        setIsEditing(false);
        setUserData(response.data); // Update with latest data
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        error.response?.data?.error || "Failed to update user information."
      );
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is available
          },
        });
        toast.success("User deleted successfully.");
        navigate("/users");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error(error.response?.data?.error || "Failed to delete user.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#322323] text-white">
        <p className="text-xl">Loading user data...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#322323] text-white">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#322323]">
      <div className="flex justify-center w-full h-full bg-[#322323] p-4 overflow-y-auto">
        <div className="w-4/5 bg-[#493939] rounded-lg shadow-md p-6 my-6 lg:m-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="ml-10 text-3xl font-bold text-[#FF9321]">
              User Information
            </h2>
            <div>
              {/* Save and Delete Buttons */}
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-md mr-2 bg-green-500 border text-white hover:border-white"
              >
                Save
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-500 border border-red-500 text-white hover:border-white"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="border border-[#FF9321] rounded-lg p-4 mb-4 mx-6">
            <h3 className="text-lg font-bold mb-2 text-[#FF9321]">
              Basic Information
            </h3>
            {/* Name */}
            <div className="p-4 flex justify-between items-center w-full h-12">
              <label className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                Name
              </label>
              <input
                type="text"
                value={userData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-2/3 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
              />
            </div>

            {/* Email */}
            <div className="p-4 flex justify-between items-center w-full h-12">
              <label className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                Email
              </label>
              <input
                type="email"
                value={userData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-2/3 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
              />
            </div>

            {/* Phone */}
            <div className="p-4 flex justify-between items-center w-full h-12">
              <label className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                Phone
              </label>
              <input
                type="text"
                value={userData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-2/3 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
              />
            </div>

            {/* Date of Birth */}
            <div className="p-4 flex justify-between items-center w-full h-12">
              <label className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                Date of Birth
              </label>
              <input
                type="date"
                value={userData.dateOfBirth || ""}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                className="w-2/3 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
              />
            </div>

            {/* Gender */}
            <div className="p-4 flex justify-between items-center w-full h-12">
              <label className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                Gender
              </label>
              <select
                value={userData.gender || ""}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-2/3 p-2 text-md text-black rounded-lg"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Remove Verifier Selection */}
            {/* <div className="p-4 flex justify-between items-center w-full h-12">
              <label className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                Verifier
              </label>
              <select
                value={userData.verifier || ""}
                onChange={(e) => handleVerifierChange(e.target.value)}
                className="w-2/3 p-2 text-md text-black rounded-lg"
              >
                <option value="">Select Verifier</option>
                {adminsList.map((adminItem, index) => (
                  <option key={index} value={adminItem.name}>
                    {adminItem.name}
                  </option>
                ))}
              </select>
            </div> */}
          </div>

          {/* Individual Information Section */}
          {userData.userType === "Individual" && (
            <div className="border border-[#FF9321] rounded-lg p-4 mb-4 mx-6">
              <h3 className="text-lg font-bold mb-2 text-[#FF9321]">
                Individual Details
              </h3>

              {/* Bank Details */}
              <div className="p-4">
                <h4 className="text-md font-bold mb-2 text-[#FF9321]">
                  Bank Details
                </h4>
                {Object.entries(userData.individualDetails.bankDetails).map(
                  ([fieldKey, fieldValue]) => (
                    <div
                      key={fieldKey}
                      className="p-2 flex justify-between items-center w-full h-12"
                    >
                      <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                        {formatFieldName(fieldKey)}
                      </label>
                      <input
                        type="text"
                        value={fieldValue || ""}
                        onChange={(e) =>
                          handleChange(
                            `individualDetails.bankDetails.${fieldKey}`,
                            e.target.value
                          )
                        }
                        className="w-2/3 text-sm font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                      />
                    </div>
                  )
                )}
              </div>

              {/* Passport Details */}
              <div className="p-4">
                <h4 className="text-md font-bold mb-2 text-[#FF9321]">
                  Passport Details
                </h4>
                {Object.entries(userData.individualDetails.passportDetails).map(
                  ([fieldKey, fieldValue]) => (
                    <div
                      key={fieldKey}
                      className="p-2 flex justify-between items-center w-full h-12"
                    >
                      <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                        {formatFieldName(fieldKey)}
                      </label>
                      {fieldKey !== "passportCopy" ? (
                        <input
                          type="text"
                          value={fieldValue || ""}
                          onChange={(e) =>
                            handleChange(
                              `individualDetails.passportDetails.${fieldKey}`,
                              e.target.value
                            )
                          }
                          className="w-2/3 text-sm font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                        />
                      ) : (
                        isEditing && (
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                handleFileChange(
                                  "individualDetails.passportDetails",
                                  "passportCopy",
                                  file
                                );
                              }
                            }}
                            className="w-2/3 text-sm text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                          />
                        )
                      )}
                    </div>
                  )
                )}
                {/* Display Passport Copy Link */}
                {userData.individualDetails.passportDetails.passportCopy && (
                  <div className="p-2 flex justify-between items-center w-full h-12">
                    <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                      Passport Copy
                    </label>
                    <a
                      href={URL.createObjectURL(
                        userData.individualDetails.passportDetails.passportCopy
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-2/3 text-sm font-semibold text-blue-400 text-center"
                    >
                      View Passport Copy
                    </a>
                  </div>
                )}
              </div>

              {/* Emirates ID Details */}
              <div className="p-4">
                <h4 className="text-md font-bold mb-2 text-[#FF9321]">
                  Emirates ID Details
                </h4>
                {Object.entries(userData.individualDetails.emiratesID).map(
                  ([fieldKey, fieldValue]) => (
                    <div
                      key={fieldKey}
                      className="p-2 flex justify-between items-center w-full h-12"
                    >
                      <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                        {formatFieldName(fieldKey)}
                      </label>
                      <input
                        type="text"
                        value={fieldValue || ""}
                        onChange={(e) =>
                          handleChange(
                            `individualDetails.emiratesID.${fieldKey}`,
                            e.target.value
                          )
                        }
                        className="w-2/3 text-sm font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                      />
                    </div>
                  )
                )}
              </div>

              {/* Nominee Details */}
              <div className="p-4">
                <h4 className="text-md font-bold mb-2 text-[#FF9321]">
                  Nominee Details
                </h4>
                {/* Name */}
                <div className="p-2 flex justify-between items-center w-full h-12">
                  <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                    Name
                  </label>
                  <input
                    type="text"
                    value={userData.individualDetails.nominee.name || ""}
                    onChange={(e) =>
                      handleChange(
                        "individualDetails.nominee.name",
                        e.target.value
                      )
                    }
                    className="w-2/3 text-sm font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                  />
                </div>

                {/* Relationship */}
                <div className="p-2 flex justify-between items-center w-full h-12">
                  <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={
                      userData.individualDetails.nominee.relationship || ""
                    }
                    onChange={(e) =>
                      handleChange(
                        "individualDetails.nominee.relationship",
                        e.target.value
                      )
                    }
                    className="w-2/3 text-sm font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                  />
                </div>

                {/* Contact Details */}
                <div className="p-2">
                  <h5 className="text-sm font-bold mb-2 text-[#FF9321]">
                    Contact Details
                  </h5>
                  {/* Address */}
                  <div className="p-2 flex justify-between items-center w-full h-12">
                    <label className="w-2/5 text-xs font-bold text-center text-[#FF9321]">
                      Address
                    </label>
                    <input
                      type="text"
                      value={
                        userData.individualDetails.nominee.contactDetails
                          .address || ""
                      }
                      onChange={(e) =>
                        handleChange(
                          "individualDetails.nominee.contactDetails.address",
                          e.target.value
                        )
                      }
                      className="w-2/3 text-xs font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="p-2 flex justify-between items-center w-full h-12">
                    <label className="w-2/5 text-xs font-bold text-center text-[#FF9321]">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={
                        userData.individualDetails.nominee.contactDetails
                          .phoneNumber || ""
                      }
                      onChange={(e) =>
                        handleChange(
                          "individualDetails.nominee.contactDetails.phoneNumber",
                          e.target.value
                        )
                      }
                      className="w-2/3 text-xs font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                    />
                  </div>

                  {/* Email */}
                  <div className="p-2 flex justify-between items-center w-full h-12">
                    <label className="w-2/5 text-xs font-bold text-center text-[#FF9321]">
                      Email
                    </label>
                    <input
                      type="email"
                      value={
                        userData.individualDetails.nominee.contactDetails
                          .email || ""
                      }
                      onChange={(e) =>
                        handleChange(
                          "individualDetails.nominee.contactDetails.email",
                          e.target.value
                        )
                      }
                      className="w-2/3 text-xs font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                    />
                  </div>

                  {/* PO Box */}
                  <div className="p-2 flex justify-between items-center w-full h-12">
                    <label className="w-2/5 text-xs font-bold text-center text-[#FF9321]">
                      PO Box
                    </label>
                    <input
                      type="text"
                      value={
                        userData.individualDetails.nominee.contactDetails
                          .poBox || ""
                      }
                      onChange={(e) =>
                        handleChange(
                          "individualDetails.nominee.contactDetails.poBox",
                          e.target.value
                        )
                      }
                      className="w-2/3 text-xs font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                    />
                  </div>
                </div>

                {/* Nominee Passport Copy */}
                {userData.individualDetails.nominee.passportCopy && (
                  <div className="p-2 flex justify-between items-center w-full h-12">
                    <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                      Nominee Passport Copy
                    </label>
                    {isEditing ? (
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleFileChange(
                              "individualDetails.nominee",
                              "passportCopy",
                              file
                            );
                          }
                        }}
                        className="w-2/3 text-sm text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                      />
                    ) : (
                      <a
                        href={URL.createObjectURL(
                          userData.individualDetails.nominee.passportCopy
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-2/3 text-sm font-semibold text-blue-400 text-center"
                      >
                        View Passport Copy
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Company Information Section */}
          {userData.userType === "Company" && (
            <div className="border border-[#FF9321] rounded-lg p-4 mb-4 mx-6">
              <h3 className="text-lg font-bold mb-2 text-[#FF9321]">
                Company Details
              </h3>

              {/* Company Name */}
              <div className="p-4 flex justify-between items-center w-full h-12">
                <label className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                  Company Name
                </label>
                <input
                  type="text"
                  value={userData.companyDetails.companyName || ""}
                  onChange={(e) =>
                    handleChange("companyDetails.companyName", e.target.value)
                  }
                  className="w-2/3 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                />
              </div>

              {/* Trade License Details */}
              <div className="p-4">
                <h4 className="text-md font-bold mb-2 text-[#FF9321]">
                  Trade License Details
                </h4>
                {Object.entries(userData.companyDetails.tradeLicense).map(
                  ([fieldKey, fieldValue]) => (
                    <div
                      key={fieldKey}
                      className="p-2 flex justify-between items-center w-full h-12"
                    >
                      <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                        {formatFieldName(fieldKey)}
                      </label>
                      {fieldKey !== "pdfCopyFile" ? (
                        <input
                          type="text"
                          value={fieldValue || ""}
                          onChange={(e) =>
                            handleChange(
                              `companyDetails.tradeLicense.${fieldKey}`,
                              e.target.value
                            )
                          }
                          className="w-2/3 text-sm font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                        />
                      ) : isEditing ? (
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleFileChange(
                                "companyDetails.tradeLicense",
                                "pdfCopy",
                                file
                              );
                            }
                          }}
                          className="w-2/3 text-sm text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                        />
                      ) : (
                        <a
                          href={URL.createObjectURL(
                            userData.companyDetails.tradeLicense.pdfCopyFile
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-2/3 text-sm font-semibold text-blue-400 text-center"
                        >
                          View Trade License
                        </a>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Signing Authorities */}
              <div className="p-4">
                <h4 className="text-md font-bold mb-2 text-[#FF9321]">
                  Signing Authorities
                </h4>
                {userData.companyDetails.signingAuthorities.map(
                  (authority, index) => (
                    <div
                      key={index}
                      className="p-2 flex justify-between items-center w-full h-12"
                    >
                      <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                        Signatory {index + 1}
                      </label>
                      <input
                        type="text"
                        value={authority.name || ""}
                        onChange={(e) =>
                          handleChange(
                            `companyDetails.signingAuthorities.${index}.name`,
                            e.target.value
                          )
                        }
                        className="w-2/3 text-sm font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                      />
                    </div>
                  )
                )}
              </div>

              {/* Group Companies */}
              <div className="p-4">
                <h4 className="text-md font-bold mb-2 text-[#FF9321]">
                  Group Companies
                </h4>
                {/* Name */}
                <div className="p-2 flex justify-between items-center w-full h-12">
                  <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                    Name
                  </label>
                  <input
                    type="text"
                    value={userData.companyDetails.groupCompanies.name || ""}
                    onChange={(e) =>
                      handleChange(
                        "companyDetails.groupCompanies.name",
                        e.target.value
                      )
                    }
                    className="w-2/3 text-sm font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                  />
                </div>

                {/* Place of Establishment */}
                <div className="p-2 flex justify-between items-center w-full h-12">
                  <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                    Place of Establishment
                  </label>
                  <input
                    type="text"
                    value={
                      userData.companyDetails.groupCompanies
                        .placeOfEstablishment || ""
                    }
                    onChange={(e) =>
                      handleChange(
                        "companyDetails.groupCompanies.placeOfEstablishment",
                        e.target.value
                      )
                    }
                    className="w-2/3 text-sm font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                  />
                </div>
              </div>

              {/* Bank Details */}
              <div className="p-4">
                <h4 className="text-md font-bold mb-2 text-[#FF9321]">
                  Bank Details
                </h4>
                {Object.entries(userData.companyDetails.bankDetails).map(
                  ([fieldKey, fieldValue]) => (
                    <div
                      key={fieldKey}
                      className="p-2 flex justify-between items-center w-full h-12"
                    >
                      <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                        {formatFieldName(fieldKey)}
                      </label>
                      <input
                        type="text"
                        value={fieldValue || ""}
                        onChange={(e) =>
                          handleChange(
                            `companyDetails.bankDetails.${fieldKey}`,
                            e.target.value
                          )
                        }
                        className="w-2/3 text-sm font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                      />
                    </div>
                  )
                )}
              </div>

              {/* Power of Attorney */}
              <div className="p-4">
                <h4 className="text-md font-bold mb-2 text-[#FF9321]">
                  Power of Attorney
                </h4>
                {/* Holder Name */}
                <div className="p-2 flex justify-between items-center w-full h-12">
                  <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                    Holder Name
                  </label>
                  <input
                    type="text"
                    value={
                      userData.companyDetails.powerOfAttorney.holderName || ""
                    }
                    onChange={(e) =>
                      handleChange(
                        "companyDetails.powerOfAttorney.holderName",
                        e.target.value
                      )
                    }
                    className="w-2/3 text-sm font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                  />
                </div>

                {/* Contact Details */}
                <div className="p-2">
                  <h5 className="text-sm font-bold mb-2 text-[#FF9321]">
                    Contact Details
                  </h5>
                  {/* Address */}
                  <div className="p-2 flex justify-between items-center w-full h-12">
                    <label className="w-2/5 text-xs font-bold text-center text-[#FF9321]">
                      Address
                    </label>
                    <input
                      type="text"
                      value={
                        userData.companyDetails.powerOfAttorney.contactDetails
                          .address || ""
                      }
                      onChange={(e) =>
                        handleChange(
                          "companyDetails.powerOfAttorney.contactDetails.address",
                          e.target.value
                        )
                      }
                      className="w-2/3 text-xs font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="p-2 flex justify-between items-center w-full h-12">
                    <label className="w-2/5 text-xs font-bold text-center text-[#FF9321]">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={
                        userData.companyDetails.powerOfAttorney.contactDetails
                          .phoneNumber || ""
                      }
                      onChange={(e) =>
                        handleChange(
                          "companyDetails.powerOfAttorney.contactDetails.phoneNumber",
                          e.target.value
                        )
                      }
                      className="w-2/3 text-xs font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                    />
                  </div>

                  {/* Email */}
                  <div className="p-2 flex justify-between items-center w-full h-12">
                    <label className="w-2/5 text-xs font-bold text-center text-[#FF9321]">
                      Email
                    </label>
                    <input
                      type="email"
                      value={
                        userData.companyDetails.powerOfAttorney.contactDetails
                          .email || ""
                      }
                      onChange={(e) =>
                        handleChange(
                          "companyDetails.powerOfAttorney.contactDetails.email",
                          e.target.value
                        )
                      }
                      className="w-2/3 text-xs font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                    />
                  </div>

                  {/* PO Box */}
                  <div className="p-2 flex justify-between items-center w-full h-12">
                    <label className="w-2/5 text-xs font-bold text-center text-[#FF9321]">
                      PO Box
                    </label>
                    <input
                      type="text"
                      value={
                        userData.companyDetails.powerOfAttorney.contactDetails
                          .poBox || ""
                      }
                      onChange={(e) =>
                        handleChange(
                          "companyDetails.powerOfAttorney.contactDetails.poBox",
                          e.target.value
                        )
                      }
                      className="w-2/3 text-xs font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                    />
                  </div>
                </div>

                {/* Power of Attorney PDF Copy */}
                {userData.companyDetails.powerOfAttorney.pdfCopyFile && (
                  <div className="p-2 flex justify-between items-center w-full h-12">
                    <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                      Power of Attorney PDF
                    </label>
                    {isEditing ? (
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleFileChange(
                              "companyDetails.powerOfAttorney",
                              "pdfCopy",
                              file
                            );
                          }
                        }}
                        className="w-2/3 text-sm text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                      />
                    ) : (
                      <a
                        href={URL.createObjectURL(
                          userData.companyDetails.powerOfAttorney.pdfCopyFile
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-2/3 text-sm font-semibold text-blue-400 text-center"
                      >
                        View Power of Attorney
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Company Information Section */}
          {userData.userType === "Company" && (
            <div className="border border-[#FF9321] rounded-lg p-4 mb-4 mx-6">
              <h3 className="text-lg font-bold mb-2 text-[#FF9321]">
                Company Details
              </h3>

              {/* Company Name */}
              <div className="p-4 flex justify-between items-center w-full h-12">
                <label className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                  Company Name
                </label>
                <input
                  type="text"
                  value={userData.companyDetails.companyName || ""}
                  onChange={(e) =>
                    handleChange("companyDetails.companyName", e.target.value)
                  }
                  className="w-2/3 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                />
              </div>

              {/* Trade License Details */}
              <div className="p-4">
                <h4 className="text-md font-bold mb-2 text-[#FF9321]">
                  Trade License Details
                </h4>
                {Object.entries(userData.companyDetails.tradeLicense).map(
                  ([fieldKey, fieldValue]) => (
                    <div
                      key={fieldKey}
                      className="p-2 flex justify-between items-center w-full h-12"
                    >
                      <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                        {formatFieldName(fieldKey)}
                      </label>
                      {fieldKey !== "pdfCopyFile" ? (
                        <input
                          type="text"
                          value={fieldValue || ""}
                          onChange={(e) =>
                            handleChange(
                              `companyDetails.tradeLicense.${fieldKey}`,
                              e.target.value
                            )
                          }
                          className="w-2/3 text-sm font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                        />
                      ) : isEditing ? (
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleFileChange(
                                "companyDetails.tradeLicense",
                                "pdfCopy",
                                file
                              );
                            }
                          }}
                          className="w-2/3 text-sm text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                        />
                      ) : (
                        <a
                          href={URL.createObjectURL(
                            userData.companyDetails.tradeLicense.pdfCopyFile
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-2/3 text-sm font-semibold text-blue-400 text-center"
                        >
                          View Trade License
                        </a>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Signing Authorities */}
              <div className="p-4">
                <h4 className="text-md font-bold mb-2 text-[#FF9321]">
                  Signing Authorities
                </h4>
                {userData.companyDetails.signingAuthorities.map(
                  (authority, index) => (
                    <div
                      key={index}
                      className="p-2 flex justify-between items-center w-full h-12"
                    >
                      <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                        Signatory {index + 1}
                      </label>
                      <input
                        type="text"
                        value={authority.name || ""}
                        onChange={(e) =>
                          handleChange(
                            `companyDetails.signingAuthorities.${index}.name`,
                            e.target.value
                          )
                        }
                        className="w-2/3 text-sm font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                      />
                    </div>
                  )
                )}
              </div>

              {/* Group Companies */}
              <div className="p-4">
                <h4 className="text-md font-bold mb-2 text-[#FF9321]">
                  Group Companies
                </h4>
                {/* Name */}
                <div className="p-2 flex justify-between items-center w-full h-12">
                  <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                    Name
                  </label>
                  <input
                    type="text"
                    value={userData.companyDetails.groupCompanies.name || ""}
                    onChange={(e) =>
                      handleChange(
                        "companyDetails.groupCompanies.name",
                        e.target.value
                      )
                    }
                    className="w-2/3 text-sm font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                  />
                </div>

                {/* Place of Establishment */}
                <div className="p-2 flex justify-between items-center w-full h-12">
                  <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                    Place of Establishment
                  </label>
                  <input
                    type="text"
                    value={
                      userData.companyDetails.groupCompanies
                        .placeOfEstablishment || ""
                    }
                    onChange={(e) =>
                      handleChange(
                        "companyDetails.groupCompanies.placeOfEstablishment",
                        e.target.value
                      )
                    }
                    className="w-2/3 text-sm font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                  />
                </div>
              </div>

              {/* Bank Details */}
              <div className="p-4">
                <h4 className="text-md font-bold mb-2 text-[#FF9321]">
                  Bank Details
                </h4>
                {Object.entries(userData.companyDetails.bankDetails).map(
                  ([fieldKey, fieldValue]) => (
                    <div
                      key={fieldKey}
                      className="p-2 flex justify-between items-center w-full h-12"
                    >
                      <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                        {formatFieldName(fieldKey)}
                      </label>
                      <input
                        type="text"
                        value={fieldValue || ""}
                        onChange={(e) =>
                          handleChange(
                            `companyDetails.bankDetails.${fieldKey}`,
                            e.target.value
                          )
                        }
                        className="w-2/3 text-sm font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                      />
                    </div>
                  )
                )}
              </div>

              {/* Power of Attorney */}
              <div className="p-4">
                <h4 className="text-md font-bold mb-2 text-[#FF9321]">
                  Power of Attorney
                </h4>
                {/* Holder Name */}
                <div className="p-2 flex justify-between items-center w-full h-12">
                  <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                    Holder Name
                  </label>
                  <input
                    type="text"
                    value={
                      userData.companyDetails.powerOfAttorney.holderName || ""
                    }
                    onChange={(e) =>
                      handleChange(
                        "companyDetails.powerOfAttorney.holderName",
                        e.target.value
                      )
                    }
                    className="w-2/3 text-sm font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                  />
                </div>

                {/* Contact Details */}
                <div className="p-2">
                  <h5 className="text-sm font-bold mb-2 text-[#FF9321]">
                    Contact Details
                  </h5>
                  {/* Address */}
                  <div className="p-2 flex justify-between items-center w-full h-12">
                    <label className="w-2/5 text-xs font-bold text-center text-[#FF9321]">
                      Address
                    </label>
                    <input
                      type="text"
                      value={
                        userData.companyDetails.powerOfAttorney.contactDetails
                          .address || ""
                      }
                      onChange={(e) =>
                        handleChange(
                          "companyDetails.powerOfAttorney.contactDetails.address",
                          e.target.value
                        )
                      }
                      className="w-2/3 text-xs font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="p-2 flex justify-between items-center w-full h-12">
                    <label className="w-2/5 text-xs font-bold text-center text-[#FF9321]">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={
                        userData.companyDetails.powerOfAttorney.contactDetails
                          .phoneNumber || ""
                      }
                      onChange={(e) =>
                        handleChange(
                          "companyDetails.powerOfAttorney.contactDetails.phoneNumber",
                          e.target.value
                        )
                      }
                      className="w-2/3 text-xs font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                    />
                  </div>

                  {/* Email */}
                  <div className="p-2 flex justify-between items-center w-full h-12">
                    <label className="w-2/5 text-xs font-bold text-center text-[#FF9321]">
                      Email
                    </label>
                    <input
                      type="email"
                      value={
                        userData.companyDetails.powerOfAttorney.contactDetails
                          .email || ""
                      }
                      onChange={(e) =>
                        handleChange(
                          "companyDetails.powerOfAttorney.contactDetails.email",
                          e.target.value
                        )
                      }
                      className="w-2/3 text-xs font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                    />
                  </div>

                  {/* PO Box */}
                  <div className="p-2 flex justify-between items-center w-full h-12">
                    <label className="w-2/5 text-xs font-bold text-center text-[#FF9321]">
                      PO Box
                    </label>
                    <input
                      type="text"
                      value={
                        userData.companyDetails.powerOfAttorney.contactDetails
                          .poBox || ""
                      }
                      onChange={(e) =>
                        handleChange(
                          "companyDetails.powerOfAttorney.contactDetails.poBox",
                          e.target.value
                        )
                      }
                      className="w-2/3 text-xs font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                    />
                  </div>
                </div>

                {/* Power of Attorney PDF Copy */}
                {userData.companyDetails.powerOfAttorney.pdfCopyFile && (
                  <div className="p-2 flex justify-between items-center w-full h-12">
                    <label className="w-2/5 text-sm font-bold text-center text-[#FF9321]">
                      Power of Attorney PDF
                    </label>
                    {isEditing ? (
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleFileChange(
                              "companyDetails.powerOfAttorney",
                              "pdfCopy",
                              file
                            );
                          }
                        }}
                        className="w-2/3 text-sm text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                      />
                    ) : (
                      <a
                        href={URL.createObjectURL(
                          userData.companyDetails.powerOfAttorney.pdfCopyFile
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-2/3 text-sm font-semibold text-blue-400 text-center"
                      >
                        View Power of Attorney
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to format field names (e.g., camelCase to Title Case)
const formatFieldName = (fieldName) => {
  return fieldName
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
};

// Helper function to format Date objects
const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "short", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

// Helper function to convert ArrayBuffer to Base64 for PDF links
const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export default VerifyUser;
