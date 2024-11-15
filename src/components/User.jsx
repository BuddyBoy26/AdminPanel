const handleChange = (section, field, value, index = null) => {
  // Update modified fields
  const key =
    index !== null ? `${section}.${index}.${field}` : `${section}.${field}`;
  setModifiedFields((prev) => ({
    ...prev,
    [key]: value,
  }));

  // Update userData
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
    // Assuming a flat structure for individualDetails
    setUserData((prev) => ({
      ...prev,
      individualDetails: {
        ...prev.individualDetails,
        [field]: value, // Directly update the field without section
      },
    }));
  }
};
