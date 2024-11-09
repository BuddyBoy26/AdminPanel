// src/components/PrivateRoute.jsx

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "../contexts/AdminContext.jsx";
import { CircularProgress } from "@material-ui/core";

const PrivateRoute = ({ children, requiredRoles = [] }) => {
  const { admin, token } = useContext(AdminContext);

  if (!token || !admin) {
    // Admin is not authenticated
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(admin.role)) {
    // Admin does not have the required role
    return <Navigate to="/unauthorized" replace />;
  }

  // Admin is authenticated and has the required role
  return children;
};

export default PrivateRoute;
