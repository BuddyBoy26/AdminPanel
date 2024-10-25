import React, { useState } from "react";

const Trip = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [tripInfo, setTripInfo] = useState({
    "Number Plate": "A12345",
    "To": "Jeddah, Saudi Arabia",
    "From": "Dubai, UAE",
    "Start Date": "22/10/2024",
    "End Date": "25/20/2024",
  });

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (section, field, value, index) => {
    if (tripInfo.Type == "Company") {
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
      <div className="flex justify-center w-full bg-gray-100 p-4 overflow-y-auto custom-scrollbar">
        <div className="w-3/5 bg-white rounded-lg shadow-md p-6 my-6 lg:m-6 ">
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="ml-10 text-3xl font-bold text-gray-800">
              Trip Information
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
          
          <div className="grid grid-cols-1 gap-0 mt-8 ml-4 w-1/2 border border-black rounded-lg pt-4">
            {Object.entries(tripInfo).map(([fieldKey, fieldValue]) => (
              <div key={fieldKey} className="mb-4">
                <div className="p-4 flex justify-around items-center w-full h-12">
                  <span className="w-2/5 text-md font-bold text-center">{fieldKey}</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={fieldValue} // Correctly use fieldValue here
                      onChange={(e) => handleChange(fieldKey, e.target.value)} // Correct the parameters
                      className="w-1/2 text-md font-semibold text-red-900 text-center border rounded-lg"
                    />
                  ) : (
                    <span className="w-1/2 text-md font-semibold text-red-900 text-center">
                      {fieldValue}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  

  // return (
  //   <div className="flex h-full">
  //     <div className=" flex justify-center w-full bg-gray-100 p-4 overflow-y-auto custom-scrollbar">
        
  //       <div className="w-4/5 bg-white rounded-lg shadow-md p-6 my-6 lg:m-6">
          
  //         <div className="flex justify-between items-center mb-4">
  //           <h2 className="ml-10 text-3xl font-bold text-gray-800">
  //             Trip Information
  //           </h2>
  //           <button
  //             onClick={isEditing ? handleSave : handleEdit}
  //             className={`px-4 py-2 rounded-md ${
  //               isEditing
  //                 ? "bg-green-500 hover:bg-green-600"
  //                 : "bg-blue-500 hover:bg-blue-600"
  //             } text-white`}
  //           >
  //             {isEditing ? "Save" : "Edit"}
  //           </button>
  //         </div>
  //         {
  //           <div className="grid grid-cols-2 gap-2 lg:m-6 my-6">
  //             {Object.entries(TripInfo).map(([key, value]) => (
  //               <div key={sectionKey} className="border border-black rounded-lg p-4 mb-4">
                  
  //                   <div key={key} className="p-4 flex  justify-around items-center w-full h-12">
  //                     <span className="w-2/5 text-md font-bold text-center">{fieldKey}</span>
  //                     {isEditing ? (
  //                       <input
  //                         type="text"
  //                         value={fieldValue}
  //                         onChange={(e) => handleChange(sectionKey, fieldKey, e.target.value)}
  //                         className="w-1/2 text-md font-semibold text-red-900 text-center border rounded-lg"
  //                       />
  //                     ) : (
  //                       <span className="w-1/2 text-md font-semibold text-red-900 text-center">
  //                         {fieldValue}
  //                       </span>
  //                     )
  //                   }
                    

  //                   </div>))
  //                 }
  //               </div> 
  //         }

                  

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
}
export default Trip;