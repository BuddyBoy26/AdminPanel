// src/components/PrivateRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * PrivateRoute Component
 * A higher-order component that wraps protected routes.
 * It checks if the user is authenticated before rendering the child component.
 * If not authenticated, redirects to the login page.
 *
 * @param {object} props - The component's props.
 * @param {boolean} props.isUser - Indicates if the user is authenticated.
 * @param {object} props.adminData - Contains authenticated admin's data.
 * @param {React.ReactElement} props.children - The child component to render.
 * @returns {React.ReactElement} - The rendered child component or a redirect.
 */
const PrivateRoute = ({ children, isUser, adminData }) => {
  if (!isUser) {
    // If the user is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Optional: Check for specific roles if adminData is provided
  if (adminData && adminData.role !== 'admin' && adminData.role !== 'superadmin') {
    // If the user does not have the required role, redirect to an unauthorized page or homepage
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and authorized, render the child component
  return children;
};

// Define prop types for better type checking
PrivateRoute.propTypes = {
  children: PropTypes.element.isRequired,
  isUser: PropTypes.bool.isRequired,
  adminData: PropTypes.shape({
    role: PropTypes.string,
  }),
};

// Define default props
PrivateRoute.defaultProps = {
  adminData: null,
};

export default PrivateRoute;
