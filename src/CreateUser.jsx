import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const [basicInfo, setBasicInfo] = useState({
    Type: "Company",
    ID: "",
    Name: "",
    Email: "",
    Phone: "",
    "Agreed ROI": "",
    "Initial Investment Value": "",
  });

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

  const navigate = useNavigate();

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

  const handleBasicInfoChange = (field, value) => {
    setBasicInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntryData =
      basicInfo.Type === "Company" ? companyInfo : individualInfo;
    console.log("Submitting new entry data:", { ...basicInfo, ...newEntryData });
    navigate("/users"); 
    // Send data to the backend or perform further actions
  };

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

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      <div className="flex justify-center w-full p-4 overflow-y-auto custom-scrollbar">
        <div className="w-4/5 bg-[#493939] rounded-lg shadow-md p-6 my-6 lg:m-6">
          <h2 className="text-4xl font-bold text-[#FF9321] mb-4">
            Create User
          </h2>
          <form onSubmit={handleSubmit}>
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
                    />
                  )}
                </div>
              ))}
            </div>

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
                          />
                        </div>
                      ))
                    ) : (
                      Object.entries(sectionData).map(
                        ([fieldKey, fieldValue]) => (
                          <div key={fieldKey} className="flex items-center mb-3">
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
                            />
                          </div>
                        )
                      )}
                    </div>
                  )
                )}
              </div>
            )}

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

export default CreateUser;
