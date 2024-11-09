// src/components/User.jsx

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import { AdminContext } from "../contexts/AdminContext.jsx";
import { toast } from "react-toastify";
import { CircularProgress } from "@material-ui/core";

const User = () => {
  const { id } = useParams(); // Get User ID from URL
  const navigate = useNavigate();
  const { admin, token } = useContext(AdminContext); // Access authenticated admin user

  const [isEditing, setIsEditing] = useState(false);
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
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to fetch user details.");
        setLoading(false);
      }
    };

    // Ensure only admins can access
    if (token && admin && ["admin", "superadmin", "manager"].includes(admin.role)) {
      fetchUser();
    } else {
      toast.error("Access denied.");
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, admin, token]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (section, field, value, index = null) => {
    // Admin editing is allowed, so handle changes accordingly
    if (userData.userType === "Company") {
      setUserData((prev) => {
        if (Array.isArray(prev.companyDetails[section])) {
          const updatedArray = [...prev.companyDetails[section]];
          updatedArray[index] = { ...prev.companyDetails[section][index], [field]: value };
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

  const handleVerifierChange = (value) => {
    setUserData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        Verifier: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      // Send PATCH request to update user data
      const response = await axios.patch(`/users/${id}`, userData);
      if (response.status === 200) {
        toast.success("User information updated successfully!");
        setIsEditing(false);
        setUserData(response.data); // Update with latest data
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.response?.data?.error || "Failed to update user information.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/users/${id}`);
        toast.success("User deleted successfully.");
        navigate("/users");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error(error.response?.data?.error || "Failed to delete user.");
      }
    }
  };

  const handleMarkProfileComplete = async () => {
    if (window.confirm("Mark this user's profile as complete?")) {
      try {
        const response = await axios.patch(`/users/${id}/complete`, {
          // Provide necessary fields to mark profile as complete
          isProfileComplete: true,
        });
        if (response.status === 200) {
          toast.success("User profile marked as complete.");
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error("Error marking profile complete:", error);
        toast.error(error.response?.data?.error || "Failed to mark profile as complete.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#322323] text-white">
        <CircularProgress />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#322323] text-white">
        User not found.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#322323]">
      <div className="flex justify-center w-full h-full bg-[#322323] p-4 overflow-y-auto">
        <div className="w-full bg-[#493939] rounded-lg shadow-md p-6 my-6 lg:m-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="ml-10 text-3xl font-bold text-[#FF9321]">User Information</h2>
            <div>
              <button
                onClick={isEditing ? handleSave : handleEdit}
                className={`px-4 py-2 rounded-md mr-2 ${
                  isEditing
                    ? "bg-green-500 border text-white hover:border-white"
                    : "bg-[#FF9321] border border-[#FF9321] text-white hover:border-white"
                }`}
              >
                {isEditing ? "Save" : "Edit"}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-500 border border-red-500 text-white hover:border-white"
              >
                Delete
              </button>
              {/* Optional: Button to mark profile as complete */}
              {!userData.isProfileComplete && (
                <button
                  onClick={handleMarkProfileComplete}
                  className="px-4 py-2 rounded-md bg-blue-500 border border-blue-500 text-white hover:border-white ml-2"
                >
                  Mark Profile Complete
                </button>
              )}
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="border border-[#FF9321] rounded-lg p-4 mb-4 mx-6">
            <h3 className="text-lg font-bold mb-2 text-[#FF9321]">Basic Information</h3>
            {Object.entries(userData.basicInfo).map(([fieldKey, fieldValue]) => (
              fieldKey !== "Verifier" && (
                <div
                  key={fieldKey}
                  className="p-4 flex justify-around items-center w-full h-12"
                >
                  <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                    {fieldKey}
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={fieldValue}
                      onChange={(e) => {
                        setUserData((prev) => ({
                          ...prev,
                          basicInfo: {
                            ...prev.basicInfo,
                            [fieldKey]: e.target.value,
                          },
                        }));
                      }}
                      className="w-1/2 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                    />
                  ) : (
                    <span className="w-1/2 text-md font-semibold text-white text-center">
                      {fieldValue}
                    </span>
                  )}
                </div>
              )
            ))}

            {/* Verifier Selection */}
            <div className="p-4 flex justify-around items-center w-full h-12">
              <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                Verifier
              </span>
              {isEditing ? (
                <select
                  value={userData.basicInfo.Verifier || ""}
                  onChange={(e) => handleVerifierChange(e.target.value)}
                  className="w-1/2 p-2 text-md text-black rounded-lg"
                >
                  <option value="">Select Verifier</option>
                  {adminsList.map((adminItem, index) => (
                    <option key={index} value={adminItem.name}>
                      {adminItem.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="w-1/2 text-md font-semibold text-white text-center">
                  {userData.basicInfo.Verifier || "N/A"}
                </span>
              )}
            </div>
          </div>

          {/* Individual or Company Information */}
          {userData.userType !== "Company" ? (
            <div className="grid grid-cols-2 gap-2 lg:m-6 my-6">
              {Object.entries(userData.individualDetails).map(([sectionKey, sectionData]) => (
                <div
                  key={sectionKey}
                  className="border border-[#FF9321] rounded-lg p-4 mb-4"
                >
                  <h3 className="text-lg font-bold mb-2 text-[#FF9321]">{sectionKey}</h3>
                  {Object.entries(sectionData).map(([fieldKey, fieldValue]) => (
                    <div
                      key={fieldKey}
                      className="p-4 flex justify-around items-center w-full h-12"
                    >
                      <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                        {fieldKey}
                      </span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={fieldValue || ""}
                          onChange={(e) => handleChange(sectionKey, fieldKey, e.target.value)}
                          className="w-1/2 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                        />
                      ) : (
                        <span className="w-1/2 text-md font-semibold text-white text-center">
                          {fieldValue}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 lg:m-6 my-6">
              {Object.entries(userData.companyDetails).map(([sectionKey, sectionData]) => (
                <div
                  key={sectionKey}
                  className="border border-[#FF9321] rounded-lg p-4 mb-4"
                >
                  <h3 className="text-lg font-bold mb-2 text-[#FF9321]">{sectionKey}</h3>

                  {Array.isArray(sectionData) ? (
                    sectionData.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-around items-center w-full h-12"
                      >
                        <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                          {sectionKey === "Signing Authorities"
                            ? `Signatory ${index + 1}`
                            : `Company ${index + 1}`}
                        </span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={item.name || ""}
                            onChange={(e) =>
                              handleChange(sectionKey, "name", e.target.value, index)
                            }
                            className="w-1/2 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                          />
                        ) : (
                          <span className="w-1/2 text-md font-semibold text-white text-center">
                            {item.name}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    Object.entries(sectionData).map(([fieldKey, fieldValue]) => (
                      <div
                        key={fieldKey}
                        className="p-4 flex justify-around items-center w-full h-12"
                      >
                        <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                          {fieldKey}
                        </span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={fieldValue || ""}
                            onChange={(e) => handleChange(sectionKey, fieldKey, e.target.value)}
                            className="w-1/2 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                          />
                        ) : (
                          <span className="w-1/2 text-md font-semibold text-white text-center">
                            {fieldValue}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Assets Section */}
          <div className="border border-[#FF9321] rounded-lg p-4 mb-4 mx-6">
            <h3 className="text-lg font-bold mb-2 text-[#FF9321]">Assets</h3>
            {userData.assets && userData.assets.length > 0 ? (
              userData.assets.map((asset, index) => (
                <div
                  key={index}
                  className="p-4 flex justify-around items-center w-full h-12 cursor-pointer hover:bg-[#634040] rounded-md"
                  onClick={() => navigate(`/assets/${asset._id}`)} // Ensure asset detail route exists
                >
                  <span className="w-full text-md font-semibold text-white text-center">
                    {asset.name}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-white">No assets found.</p>
            )}
          </div>

          {/* Investments Section */}
          <div className="border border-[#FF9321] rounded-lg p-4 mb-4 mx-6">
            <h3 className="text-lg font-bold mb-2 text-[#FF9321]">Investments</h3>
            {userData.investments && userData.investments.length > 0 ? (
              userData.investments.map((investment, index) => (
                <div
                  key={index}
                  className="p-4 flex justify-around items-center w-full h-12 cursor-pointer hover:bg-[#634040] rounded-md"
                  onClick={() => navigate(`/investments/${investment._id}`)} // Ensure investment detail route exists
                >
                  <span className="w-full text-md font-semibold text-white text-center">
                    {investment.name}
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
