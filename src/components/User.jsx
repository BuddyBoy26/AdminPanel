// src/components/User.jsx

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import { UserContext } from "../contexts/UserContext.jsx";
import { toast } from 'react-toastify';

const User = () => {
  const { id } = useParams(); // Get InvestorID from URL
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("/admins"); // Ensure your backend has this endpoint
        setAdmins(response.data.admins);
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast.error("Failed to fetch admins.");
      }
    };

    fetchAdmins();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/${id}`);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to fetch user details.");
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (section, field, value, index = null) => {
    if (userData.basicInfo.Type === "Company") {
      setUserData((prev) => {
        if (Array.isArray(prev.companyInfo[section])) {
          const updatedArray = [...prev.companyInfo[section]];
          updatedArray[index] = { ...prev.companyInfo[section][index], [field]: value };
          return {
            ...prev,
            companyInfo: {
              ...prev.companyInfo,
              [section]: updatedArray,
            },
          };
        } else {
          return {
            ...prev,
            companyInfo: {
              ...prev.companyInfo,
              [section]: {
                ...prev.companyInfo[section],
                [field]: value,
              },
            },
          };
        }
      });
    } else {
      setUserData((prev) => ({
        ...prev,
        individualInfo: {
          ...prev.individualInfo,
          [section]: {
            ...prev.individualInfo[section],
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
      const response = await axios.patch(`/users/${id}`, userData);
      if (response.status === 200) {
        toast.success("User information updated successfully!");
        setIsEditing(false);
        setUserData(response.data); // Update with latest data
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user information.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/users/${id}`);
        toast.success("User deletion requested and pending verification.");
        navigate("/users");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#322323] text-white">
        Loading user details...
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
    <div className="flex min-h-[calc(100vh-64px)] bg-[#322323]">
      <div className="flex justify-center w-full h-full bg-[#322323] p-4 overflow-y-auto custom-scrollbar">
        <div className="w-4/5 bg-[#493939] rounded-lg shadow-md p-6 my-6 lg:m-6">
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
          </div>

          {/* Individual or Company Information */}
          {userData.basicInfo.Type !== "Company" ? (
            <div className="grid grid-cols-2 gap-2 lg:m-6 my-6">
              {Object.entries(userData.individualInfo).map(([sectionKey, sectionData]) => (
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
                          value={fieldValue}
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
              {Object.entries(userData.companyInfo).map(([sectionKey, sectionData]) => (
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
                            value={item.Name || ""}
                            onChange={(e) =>
                              handleChange(sectionKey, "Name", e.target.value, index)
                            }
                            className="w-1/2 text-md font-semibold text-white text-center border rounded-lg border-[#FF9321] bg-[#322323]"
                          />
                        ) : (
                          <span className="w-1/2 text-md font-semibold text-white text-center">
                            {item.Name}
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
            {userData.assets.map((asset, index) => (
              <div
                key={index}
                className="p-4 flex justify-around items-center w-full h-12 cursor-pointer hover:bg-[#322323] rounded-md"
                onClick={() => navigate(asset.Link)}
              >
                <span className="w-full text-md font-semibold text-white text-center">
                  {asset.Name}
                </span>
              </div>
            ))}
          </div>

          {/* Investments Section */}
          <div className="border border-[#FF9321] rounded-lg p-4 mb-4 mx-6">
            <h3 className="text-lg font-bold mb-2 text-[#FF9321]">Investments</h3>
            {userData.investments.map((investment, index) => (
              <div
                key={index}
                className="p-4 flex justify-around items-center w-full h-12 cursor-pointer hover:bg-[#322323] rounded-md"
                onClick={() => navigate(investment.Link)}
              >
                <span className="w-full text-md font-semibold text-white text-center">
                  {investment.Name}
                </span>
              </div>
            ))}
          </div>

          {/* Verifier Section */}
          {isEditing && (
            <div className="border border-[#FF9321] rounded-lg p-4 mb-4 mx-6">
              <h3 className="text-lg font-bold mb-2 text-[#FF9321]">Verifier</h3>
              <div className="flex justify-around items-center w-full h-12">
                <span className="w-2/5 text-md font-bold text-center text-[#FF9321]">
                  Select Verifier
                </span>
                <select
                  value={userData.basicInfo.Verifier}
                  onChange={(e) => handleVerifierChange(e.target.value)}
                  className="w-1/2 p-2 text-md text-black rounded-lg"
                >
                  {admins.map((admin, index) => (
                    <option key={index} value={admin}>
                      {admin}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
