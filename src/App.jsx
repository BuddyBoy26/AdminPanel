// src/App.jsx

import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Importing Components
import Login from "./userAuth/Login.jsx";
import Signup from "./userAuth/Signup.jsx";
import Signedup from "./userAuth/Signedup.jsx";
import Profile from "./Profile.jsx";
import Logout from "./userAuth/Logout.jsx";
import NavBar from "./NavBar.jsx";
import Dashboard from "./Dashboard.jsx";

import Asset from "./Asset.jsx";
import Assets from "./Assets.jsx";

import User from "./User.jsx";
import Users from "./Users.jsx";

import Trip from "./Trip.jsx";
import Trips from "./Trips.jsx";

import Log from "./Log.jsx";
import Logbook from "./Logbook.jsx";

import Investment from "./Investment.jsx";
import Investments from "./Investments.jsx";

import Reports from "./Reports.jsx";
import Help from "./Help.jsx";
import CreateUser from "./CreateUser.jsx";
import CreateTrip from "./CreateTrip.jsx";
import CreateInvestment from "./CreateInvestment.jsx";

import CreateAsset from "./CreateAsset.jsx";
import VerifyUser from "./VerifyUser.jsx";
import EnterOtp from "./EnterOtp.jsx";
import OtpSuccess from "./OtpSuccess.jsx";

// Importing Axios Instance
import axios from "./api/axios.js"; // Corrected import path

// Importing PrivateRoute and ErrorBoundary
import PrivateRoute from "./components/PrivateRoute.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

const App = () => {
  // State to track if the user is authenticated
  const [isUser, setIsUser] = useState(false);
  // State to store admin data
  const [adminData, setAdminData] = useState(null);

  /**
   * useEffect Hook
   * Runs once on component mount to check for existing authentication tokens.
   * If tokens exist, sets the user as authenticated and stores admin data.
   */
  useEffect(() => {
    // Retrieve token and admin data from localStorage
    const token = localStorage.getItem("authToken");
    const admin = localStorage.getItem("adminData");

    if (token && admin) {
      // Optionally, verify the token's validity with the backend
      // For simplicity, we'll assume the token is valid if it exists
      setIsUser(true);
      setAdminData(JSON.parse(admin));
    }
  }, []);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        {/* Navigation Bar */}
        <NavBar isUser={isUser} setIsUser={setIsUser} />

        {/* Main Content Area */}
        <div className="w-full h-full bg-[#1f1f1f]">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                isUser ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login"
              element={<Login setIsUser={setIsUser} setAdminData={setAdminData} />}
            />
            <Route
              path="/signup"
              element={<Signup setIsUser={setIsUser} setAdminData={setAdminData} />}
            />
            <Route path="/signedup" element={<Signedup />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/home"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/logout"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <Logout setIsUser={setIsUser} setAdminData={setAdminData} />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <Profile />
                </PrivateRoute>
              }
            />

            <Route
              path="/user"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <User />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <Users />
                </PrivateRoute>
              }
            />

            <Route
              path="/assets"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <Assets />
                </PrivateRoute>
              }
            />
            <Route
              path="/asset"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <Asset />
                </PrivateRoute>
              }
            />

            <Route
              path="/trip"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <Trip />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <Trips />
                </PrivateRoute>
              }
            />

            <Route
              path="/log"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <Log />
                </PrivateRoute>
              }
            />
            <Route
              path="/logbook"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <Logbook />
                </PrivateRoute>
              }
            />

            <Route
              path="/investment"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <Investment />
                </PrivateRoute>
              }
            />
            <Route
              path="/investments"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <Investments />
                </PrivateRoute>
              }
            />

            <Route
              path="/help"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <Help />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <Reports />
                </PrivateRoute>
              }
            />

            <Route
              path="/create/user"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <CreateUser />
                </PrivateRoute>
              }
            />
            <Route
              path="/create/asset"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <CreateAsset />
                </PrivateRoute>
              }
            />
            <Route
              path="/create/trip"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <CreateTrip />
                </PrivateRoute>
              }
            />
            <Route
              path="/create/investment"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <CreateInvestment />
                </PrivateRoute>
              }
            />

            <Route
              path="/verify/user"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <VerifyUser />
                </PrivateRoute>
              }
            />
            <Route
              path="/otp"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <EnterOtp />
                </PrivateRoute>
              }
            />
            <Route
              path="/otp/success"
              element={
                <PrivateRoute isUser={isUser} adminData={adminData}>
                  <OtpSuccess />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
