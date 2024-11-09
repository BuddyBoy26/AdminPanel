// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Context Providers
import { AdminProvider } from "./contexts/AdminContext.jsx";

// Import Components
import NavBar from "./components/NavBar.jsx";
import Login from "./userAuth/Login.jsx";
import Signup from "./userAuth/Signup.jsx";
import Signedup from "./userAuth/Signedup.jsx";
import CreateUser from "./components/CreateUser.jsx";
import Trips from "./components/Trips.jsx";
import Trip from "./components/Trip.jsx";
import CreateTrip from "./components/CreateTrip.jsx";
import Investments from "./components/Investments.jsx";
import Investment from "./components/Investment.jsx";
import CreateInvestment from "./components/CreateInvestment.jsx";
import Profile from "./components/Profile.jsx";
import Logbook from "./components/Logbook.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Users from "./components/Users.jsx";
import User from "./components/User.jsx";
import Unauthorized from "./components/Unauthorized.jsx";
import Assets from "./components/Assets.jsx"; // Import Assets component
import Asset from "./components/Asset.jsx";   // Import Asset component
import CreateAsset from "./components/CreateAsset.jsx"; // Import CreateAsset component

// Import Private Routes
import PrivateRoute from "./components/PrivateRoute.jsx";

function App() {
  return (
    <Router>
      <AdminProvider>
        <NavBar />
        <ToastContainer />
        <div className="flex">
          {/* Optionally, include a sidebar for admin navigation */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signedup" element={<Signedup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes - Admin Only */}
            <Route
              path="/create/user"
              element={
                <PrivateRoute requiredRoles={["admin", "superadmin", "manager"]}>
                  <CreateUser />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute requiredRoles={["admin", "superadmin", "manager"]}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips"
              element={
                <PrivateRoute requiredRoles={["admin", "superadmin", "manager"]}>
                  <Trips />
                </PrivateRoute>
              }
            />
            <Route
              path="/trip/:id"
              element={
                <PrivateRoute requiredRoles={["admin", "superadmin", "manager"]}>
                  <Trip />
                </PrivateRoute>
              }
            />
            <Route
              path="/create/trip"
              element={
                <PrivateRoute requiredRoles={["admin", "superadmin", "manager"]}>
                  <CreateTrip />
                </PrivateRoute>
              }
            />
            <Route
              path="/investments"
              element={
                <PrivateRoute requiredRoles={["admin", "superadmin", "manager"]}>
                  <Investments />
                </PrivateRoute>
              }
            />
            <Route
              path="/investment/:id"
              element={
                <PrivateRoute requiredRoles={["admin", "superadmin", "manager"]}>
                  <Investment />
                </PrivateRoute>
              }
            />
            <Route
              path="/create/investment"
              element={
                <PrivateRoute requiredRoles={["admin", "superadmin", "manager"]}>
                  <CreateInvestment />
                </PrivateRoute>
              }
            />
            <Route
              path="/logbook"
              element={
                <PrivateRoute requiredRoles={["admin", "superadmin", "manager"]}>
                  <Logbook />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute requiredRoles={["admin", "superadmin", "manager"]}>
                  <Users />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/:id"
              element={
                <PrivateRoute requiredRoles={["admin", "superadmin", "manager"]}>
                  <User />
                </PrivateRoute>
              }
            />

            {/* New Assets Routes */}
            <Route
              path="/assets"
              element={
                <PrivateRoute requiredRoles={["admin", "superadmin", "manager"]}>
                  <Assets />
                </PrivateRoute>
              }
            />
            <Route
              path="/asset/:id"
              element={
                <PrivateRoute requiredRoles={["admin", "superadmin", "manager"]}>
                  <Asset />
                </PrivateRoute>
              }
            />
            <Route
              path="/create/asset"
              element={
                <PrivateRoute requiredRoles={["admin", "superadmin", "manager"]}>
                  <CreateAsset />
                </PrivateRoute>
              }
            />

            {/* Protected Routes - Regular Users */}
            <Route
              path="/profile"
              element={
                <PrivateRoute requiredRoles={["user"]}>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </AdminProvider>
    </Router>
  );
}

export default App;
