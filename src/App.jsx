// src/App.jsx

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Importing Components
import Login from "./userAuth/Login.jsx";
import Signup from "./userAuth/Signup.jsx";
import Signedup from "./userAuth/Signedup.jsx";
import Profile from "./components/Profile.jsx";
import Logout from "./userAuth/Logout.jsx";
import NavBar from "./components/NavBar.jsx";
import Dashboard from "./components/Dashboard.jsx";

import Asset from "./Asset.jsx";
import Assets from "./Assets.jsx";

import Log from "./Log.jsx";
import Logbook from "./Logbook.jsx";

import CreateInvestment from "./components/CreateInvestment.jsx";

import CreateAsset from "./CreateAsset.jsx";

import Reports from "./Reports.jsx";
import Help from "./Help.jsx";
import VerifyUser from "./VerifyUser.jsx";
import EnterOtp from "./EnterOtp.jsx";
import OtpSuccess from "./OtpSuccess.jsx";

// Importing Axios Instance
import axios from "./api/axios.js";

// Importing PrivateRoute and ErrorBoundary
import PrivateRoute from "./components/PrivateRoute.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Importing ToastContainer for notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import AdminProvider
import { AdminProvider } from "./contexts/AdminContext.jsx";

const App = () => {
  return (
    <AdminProvider>
      <BrowserRouter>
        <ErrorBoundary>
          {/* Navigation Bar */}
          <NavBar />

          {/* Toast Container */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />

          {/* Main Content Area */}
          <div className="w-full h-full bg-[#1f1f1f]">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Navigate to="/dashboard" replace />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signedup" element={<Signedup />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/logout"
                element={
                  <PrivateRoute>
                    <Logout />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              <Route
                path="/user/:id"
                element={
                  <PrivateRoute>
                    <User />
                  </PrivateRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <PrivateRoute>
                    <Users />
                  </PrivateRoute>
                }
              />

              <Route
                path="/assets"
                element={
                  <PrivateRoute>
                    <Assets />
                  </PrivateRoute>
                }
              />
              <Route
                path="/asset/:id"
                element={
                  <PrivateRoute>
                    <Asset />
                  </PrivateRoute>
                }
              />

              <Route
                path="/trip/:id"
                element={
                  <PrivateRoute>
                    <Trip />
                  </PrivateRoute>
                }
              />
              <Route
                path="/trips"
                element={
                  <PrivateRoute>
                    <Trips />
                  </PrivateRoute>
                }
              />

              <Route
                path="/investment/:id"
                element={
                  <PrivateRoute>
                    <Investment />
                  </PrivateRoute>
                }
              />
              <Route
                path="/investments"
                element={
                  <PrivateRoute>
                    <Investments />
                  </PrivateRoute>
                }
              />

              <Route
                path="/log"
                element={
                  <PrivateRoute>
                    <Log />
                  </PrivateRoute>
                }
              />
              <Route
                path="/logbook"
                element={
                  <PrivateRoute>
                    <Logbook />
                  </PrivateRoute>
                }
              />

              <Route
                path="/help"
                element={
                  <PrivateRoute>
                    <Help />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <PrivateRoute>
                    <Reports />
                  </PrivateRoute>
                }
              />

              <Route
                path="/create/user"
                element={
                  <PrivateRoute>
                    <CreateUser />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create/asset"
                element={
                  <PrivateRoute>
                    <CreateAsset />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create/trip"
                element={
                  <PrivateRoute>
                    <CreateTrip />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create/investment"
                element={
                  <PrivateRoute>
                    <CreateInvestment />
                  </PrivateRoute>
                }
              />

              <Route
                path="/verify/user"
                element={
                  <PrivateRoute>
                    <VerifyUser />
                  </PrivateRoute>
                }
              />
              <Route
                path="/otp"
                element={
                  <PrivateRoute>
                    <EnterOtp />
                  </PrivateRoute>
                }
              />
              <Route
                path="/otp/success"
                element={
                  <PrivateRoute>
                    <OtpSuccess />
                  </PrivateRoute>
                }
              />

              {/* Fallback Route for 404 */}
              <Route
                path="*"
                element={
                  <div className="flex justify-center items-center min-h-screen bg-[#322323] text-white">
                    <h1 className="text-3xl">404 - Page Not Found</h1>
                  </div>
                }
              />
            </Routes>
          </div>
        </ErrorBoundary>
      </BrowserRouter>
    </AdminProvider>
  );
};

export default App;
