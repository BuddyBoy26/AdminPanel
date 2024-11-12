// src/components/RenderFieldValue.jsx

import React from "react";

const RenderFieldValue = ({ value, beautifyFieldKey }) => {
  if (typeof value === "object" && value !== null) {
    return (
      <div className="w-1/2 text-md font-semibold text-white text-center">
        {Object.entries(value).map(([subKey, subValue]) => (
          <div key={subKey} className="mb-1">
            <strong>{beautifyFieldKey(subKey)}:</strong> {subValue}
          </div>
        ))}
      </div>
    );
  }
  return (
    <span className="w-1/2 text-md font-semibold text-white text-center">
      {value || ""}
    </span>
  );
};

export default RenderFieldValue;
