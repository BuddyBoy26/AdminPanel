import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const User = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // Mocked list of admins. Replace this with a fetch call to your backend.
  const admins = ["Admin 0", "Admin 1", "Admin 2", "Admin 3"];

  const [basicInfo, setBasicInfo] = useState({
    Type: "Company",
    ID: "U12345",
    Name: "John Doe",
    Email: "john.doe@example.com",
    Phone: "+1 234 567 8901",
    "Agreed ROI": "5%",
    "Initial Investment Value": "$10,000",
    Verifier: "Admin 0", // Added Verifier field with default value
  });

  const [individualInfo, setIndividualInfo] = useState({
    "Personal Details": {
      Gender: "Male",
      DOB: "1990-01-01",
      Address: "123 Main St, Cityville",
      "PO Box": "12345",
    },
    "Bank Details": {
      "Bank Name": "Bank of America",
      "Account Name": "John Doe",
      IBAN: "US00BOA0000000000123456",
      "Swift Code": "BOFAUS3N",
    },
    "Passport Details": {
      "Passport Number": "123456789",
      "Place of Issue": "Cityville",
      "Date of Issue": "2015-01-01",
      "Date of Expiry": "2025-01-01",
      "Soft Copy": "passport.pdf",
    },
    "UID Details": {
      Country: "USA",
      Number: "987654321",
      "Date of Issue": "2015-01-01",
    },
    "Nominee Details": {
      Name: "Jane Doe",
      Relationship: "Spouse",
      Email: "jane.doe@example.com",
      Phone: "+1 234 567 8902",
      Address: "123 Main St, Cityville",
      "PO Box": "12345",
    },
  });

  const [companyInfo, setCompanyInfo] = useState({
    "Trade License Details": {
      Number: "TL12345",
      "Issue Date": "2020-01-01",
      "Expiry Date": "2025-01-01",
      "Place of Establishment": "Cityville",
      "Soft Copy": "trade_license.pdf",
    },
    "Signing Authorities": [
      { Name: "Alice Smith" },
      { Name: "Bob Johnson" },
    ],
    "Contact Details": {
      "Point Of Contact": "Charlie Brown",
      Email: "charlie.brown@example.com",
      "Phone Number": "+1 234 567 8903",
      Address: "456 Elm St, Townsville",
      "PO Box": "67890",
    },
    "Group Companies": [
      { Name: "Subsidiary A" },
      { Name: "Subsidiary B" },
    ],
    "Bank Details": {
      "Bank Name": "Citibank",
      "Account Name": "Company XYZ",
      IBAN: "US00CITI0000000000987654",
      "Swift Code": "CITIUS33",
    },
    "Power of Attorney Details": {
      Binary: "Yes",
      Name: "David Lee",
      Email: "david.lee@example.com",
      "Phone Number": "+1 234 567 8904",
      Address: "789 Oak St, Villageville",
      "PO Box": "13579",
      "Soft Copy": "power_of_attorney.pdf",
    },
  });

  // Added Assets and Investments arrays
  const [assets, setAssets] = useState([
    { Name: "Asset 1", Link: "/asset/1" },
    { Name: "Asset 2", Link: "/asset/2" },
    { Name: "Asset 3", Link: "/asset/3" },
  ]);

  const [investments, setInvestments] = useState([
    { Name: "Investment 1", Link: "/investment/1" },
    { Name: "Investment 2", Link: "/investment/2" },
    { Name: "Investment 3", Link: "/investment/3" },
  ]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (section, field, value, index = null) => {
    if (basicInfo.Type === "Company") {
      setCompanyInfo((prev) => {
        if (Array.isArray(prev[section])) {
          const updatedArray = [...prev[section]];
          updatedArray[index] = { ...updatedArray[index], [field]: value };
          return {
            ...prev,
            [section]: updatedArray,
          };
        } else {
          return {
            ...prev,
            [section]: {
              ...prev[section],
              [field]: value,
            },
          };
        }
      });
    } else {
      setIndividualInfo((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }
  };

  const handleVerifierChange = (value) => {
    setBasicInfo((prev) => ({
      ...prev,
      Verifier: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send the updated information to a backend
    console.log("Saving updated user info:", basicInfo, companyInfo, individualInfo);
  };

  const handleAssetClick = (link) => {
    navigate(link);
  };

  const handleInvestmentClick = (link) => {
    navigate(link);
  };

  return (
    <div className="flex h-full bg-[#322323]">
      <div className="flex justify-center w-full bg-[#322323] p-4 overflow-y-auto custom-scrollbar">
        <div className="w-4/5 bg-[#493939] rounded-lg shadow-md p-6 my-6 lg:m-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="ml-10 text-3xl font-bold text-[#FF9321]">
              User Information
            </h2>
            <button
              onClick={isEditing ? handleSave : handleEdit}
              className={`px-4 py-2 rounded-md ${
                isEditing
                  ? "bg-green-500 border text-white hover:border-white"
                  : "bg-[#FF9321] border border-[#FF9321] text-white hover:border-white"
              }`}
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>

          {/* Basic Information Section */}
          <div className="border border-[#FF9321] rounded-lg p-4 mb-4 mx-6">
            <h3 className="text-lg font-bold mb-2 text-[#FF9321]">Basic Information</h3>
            {Object.entries(basicInfo).map(([fieldKey, fieldValue]) => (
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
                        setBasicInfo((prev) => ({
                          ...prev,
                          [fieldKey]: e.target.value,
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
          {basicInfo.Type !== "Company" ? (
            <div className="grid grid-cols-2 gap-2 lg:m-6 my-6">
              {Object.entries(individualInfo).map(([sectionKey, sectionData]) => (
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
              {Object.entries(companyInfo).map(([sectionKey, sectionData]) => (
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
            {assets.map((asset, index) => (
              <div
                key={index}
                className="p-4 flex justify-around items-center w-full h-12 cursor-pointer hover:bg-[#322323] rounded-md"
                onClick={() => handleAssetClick(asset.Link)}
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
            {investments.map((investment, index) => (
              <div
                key={index}
                className="p-4 flex justify-around items-center w-full h-12 cursor-pointer hover:bg-[#322323] rounded-md"
                onClick={() => handleInvestmentClick(investment.Link)}
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
                  value={basicInfo.Verifier}
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
