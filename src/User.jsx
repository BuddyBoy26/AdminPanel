import React, { useState } from "react";

const User = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [basicInfo, setBasicInfo] = useState({
    Type: "Company",
    ID: "Flatbed",
    Name: "Volvo",
    Email: "FMX2019",
    Phone: "FMX2019",
    "Agreed ROI": "",
    "Initial Investment Value": "",
    "Agreed ROI": "",

  });
  const [individualInfo, setIndividualInfo] = useState({
    "Personal Details":{
    "Gender": "A12345",
    "DOB": "Flatbed",
    "Address": "Volvo",
    "PO Box": "FMX2019",
    },
    "Bank Details": {
    "Bank Name": "FMX2019",
    "Account Name": "FMX2019",
    "IBAN": "FMX2019",
    "Swift Code": "FMX2019",
    },
    "Passport Details": {
    "Passport Number": "FMX2019",
    "Place of Issue": "FMX2019",
    "Date of Issue": "FMX2019",
    "Date of Expiry": "FMX2019",
    "Soft Copy": "FMX2019",
    },
    "UID Details": {
    "Country": "FMX2019",
    "Number": "FMX2019",
    "Date of Issue": "FMX2019",
    },
    "Nominee Details": {
    "Name": "FMX2019",
    "Relationship": "FMX2019",
    "Email": "FMX2019",
    "Phone": "FMX2019",
    "Address": "FMX2019",
    "PO Box": "FMX2019",
    },
  });
  const [companyInfo, setCompanyInfo] = useState({
    "Trade License Details": {
      "Number": "",
      "Issue Date": "",
      "Expiry Date": "",
      "Place of Establishment": "",
      "Soft Copy": "",
    },
    "Signing Authorities": [
      {
        "Name":"A"
      },
      {
        "Name":"B"
      }
    ],
    "Contact Details": {
      "Point Of Contact": "",
      "Email": "",
      "Phone Number": "",
      "Address": "",
      "PO Box": "",
    },
    "Group Companies": [
      {
        "Name":""
      }
    ],
    "Bank Details": {
      "Bank Name": "FMX2019",
      "Account Name": "FMX2019",
      "IBAN": "FMX2019",
      "Swift Code": "FMX2019",
    },
    "Power of Attorney Details": {
      "Binary": "",
      "Name": "",
      "Email": "",
      "Phone Number": "",
      "Address": "",
      "PO Box": "",
      "Soft Copy": ""
    }
  });

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (section, field, value, index) => {
    if (basicInfo.Type == "Company") {
      setCompanyInfo((prev) => {
        if (Array.isArray(prev[section])) {
          // For array sections like SigningAuthorities or GroupCompanies
          const updatedArray = [...prev[section]];
          updatedArray[index] = { ...updatedArray[index], [field]: value };
          return {
            ...prev,
            [section]: updatedArray,
          };
        } else {
          // For object sections like TradeLicenseDetails or ContactDetails
          return {
            ...prev,
            [section]: {
              ...prev[section],
              [field]: value,
            },
          };
        }
      });
    }
    else {
      setIndividualInfo((prev) => {
          // For object sections like TradeLicenseDetails or ContactDetails
          return {
            ...prev,
            [section]: {
              ...prev[section],
              [field]: value,
            },
          };
      })
    };
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send the updated information to a backend
    console.log("Saving updated vehicle info:", vehicleInfo);
  };

  return (
    <div className="flex h-full">
      <div className=" flex justify-center w-full bg-gray-100 p-4 overflow-y-auto custom-scrollbar">
        
        <div className="w-4/5 bg-white rounded-lg shadow-md p-6 my-6 lg:m-6">
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="ml-10 text-3xl font-bold text-gray-800">
              User Information
            </h2>
            <button
              onClick={isEditing ? handleSave : handleEdit}
              className={`px-4 py-2 rounded-md ${
                isEditing
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
          {basicInfo.Type != "Company" && 
            <div className="grid grid-cols-2 gap-2 lg:m-6 my-6">
              {Object.entries(individualInfo).map(([sectionKey, sectionData]) => (
                <div key={sectionKey} className="border border-black rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-bold mb-2">{sectionKey}</h3>
                  {Object.entries(sectionData).map(([fieldKey, fieldValue]) => (
                    <div key={fieldKey} className="p-4 flex  justify-around items-center w-full h-12">
                      <span className="w-2/5 text-md font-bold text-center">{fieldKey}</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={fieldValue}
                          onChange={(e) => handleChange(sectionKey, fieldKey, e.target.value)}
                          className="w-1/2 text-md font-semibold text-red-900 text-center border rounded-lg"
                        />
                      ) : (
                        <span className="w-1/2 text-md font-semibold text-red-900 text-center">
                          {fieldValue}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          }

          {basicInfo.Type === "Company" && (
            <div className="grid grid-cols-2 gap-2 lg:m-6 my-6">
              {Object.entries(companyInfo).map(([sectionKey, sectionData]) => (
                <div key={sectionKey} className="border border-black rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-bold mb-2">{sectionKey}</h3>

                  {/* Handling Signing Authorities */}
                  {Array.isArray(sectionData) && sectionKey === "Signing Authorities" && (
                    sectionData.map((item, index) => (
                      <div key={index} className="flex justify-around items-center w-full h-12">
                        <span className="w-2/5 text-md font-bold text-center">Signatory {index + 1}</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={item.Name || ""} // Ensure value is a string
                            onChange={(e) => handleChange(sectionKey, "Name", e.target.value, index)}
                            className="w-1/2 text-md font-semibold text-red-900 text-center border rounded-lg"
                          />
                        ) : (
                          <span className="w-1/2 text-md font-semibold text-red-900 text-center">
                            {item.Name}
                          </span>
                        )}
                      </div>
                    ))
                  )}

                  {/* Handling Group Companies */}
                  {Array.isArray(sectionData) && sectionKey === "Group Companies" && (
                    sectionData.map((item, index) => (
                      <div key={index} className="flex justify-around items-center w-full h-12">
                        <span className="w-2/5 text-md font-bold text-center">Company {index + 1}</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={item.Name || ""} // Ensure value is a string
                            onChange={(e) => handleChange(sectionKey, "Name", e.target.value, index)}
                            className="w-1/2 text-md font-semibold text-red-900 text-center border rounded-lg"
                          />
                        ) : (
                          <span className="w-1/2 text-md font-semibold text-red-900 text-center">
                            {item.Name}
                          </span>
                        )}
                      </div>
                    ))
                  )}

                  {/* Handling Non-array sections */}
                  {!Array.isArray(sectionData) && (
                    Object.entries(sectionData).map(([fieldKey, fieldValue]) => (
                      <div key={fieldKey} className="p-4 flex justify-around items-center w-full h-12">
                        <span className="w-2/5 text-md font-bold text-center">{fieldKey}</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={fieldValue || ""} // Ensure value is a string
                            onChange={(e) => handleChange(sectionKey, fieldKey, e.target.value)}
                            className="w-1/2 text-md font-semibold text-red-900 text-center border rounded-lg"
                          />
                        ) : (
                          <span className="w-1/2 text-md font-semibold text-red-900 text-center">
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


          {/* {basicInfo.Type === "Company" && (
            <div className="grid grid-cols-2 gap-2 lg:m-6 my-6">
              {Object.entries(companyInfo).map(([sectionKey, sectionData]) => (
                <div key={sectionKey} className="border border-black rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-bold mb-2">{sectionKey}</h3>
                  {Array.isArray(sectionData) && sectionKey == "Signing Authorities" && (  // Check if the sectionData is an array
                    sectionData.map((item, index) => (
                      <div key={index} className="flex justify-around items-center w-full h-12">
                        <span className="w-2/5 text-md font-bold text-center"> Signatory {index + 1}</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={item.Name}
                            onChange={(e) => handleChange(sectionKey, "Name", e.target.value, index)}
                            className="w-1/2 text-md font-semibold text-red-900 text-center border rounded-lg"
                          />
                        ) : (
                          <span className="w-1/2 text-md font-semibold text-red-900 text-center">
                            {item.Name}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                  {Array.isArray(sectionData) && sectionKey == "Group Companies" ? (
                    sectionData.map((item, index) => (
                      <div key={index} className="flex justify-around items-center w-full h-12">
                        <span className="w-2/5 text-md font-bold text-center"> Company {index + 1}</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={item.Name}
                            onChange={(e) => handleChange(sectionKey, "Name", e.target.value, index)}
                            className="w-1/2 text-md font-semibold text-red-900 text-center border rounded-lg"
                          />
                        ) : (
                          <span className="w-1/2 text-md font-semibold text-red-900 text-center">
                            {item.Name}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                  Object.entries(sectionData).map(([fieldKey, fieldValue]) => (
                    <div key={fieldKey} className="p-4 flex justify-around items-center w-full h-12">
                      <span className="w-2/5 text-md font-bold text-center">{fieldKey}</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={fieldValue}
                          onChange={(e) => handleChange(sectionKey, fieldKey, e.target.value)}
                          className="w-1/2 text-md font-semibold text-red-900 text-center border rounded-lg"
                        />
                      ) : (
                        <span className="w-1/2 text-md font-semibold text-red-900 text-center">
                          {fieldValue}
                        </span>
                      )}
                    </div>
                  ))
                
                )
                  
                  }
                </div>
              ))}
            </div>
          )} */}



          {/* <div className="grid grid-cols-2 gap-2 lg:m-6 my-6">
            {Object.entries(vehicleInfo).map(([key, value]) => (
              <div key={key} className="p-4 flex border justify-around items-center w-1/2 h-12">
                <span className="w-2/5 text-md font-bold text-center">{key}</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-1/2 text-md font-semibold text-red-900 text-center border rounded-lg"
                  />
                ) : (
                  <span className="w-1/2 text-md font-semibold text-red-900 text-center">
                    {value}
                  </span>
                )}
              </div>
            ))}
          </div> */}
        
        </div>
      
      </div>
    </div>
  );
};

export default User;