// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/NavBar.jsx";

// Import Context Providers
import { AdminProvider } from "./contexts/AdminContext.jsx";
//import { UserProvider } from "./contexts/UserContext.jsx";

// Import Components
import Login from "./userAuth/Login.jsx";
import Signup from "./userAuth/Signup.jsx";
import Signedup from "./userAuth/Signedup.jsx";
import CreateUser from "./userAuth/CreateUser.jsx";
import Trips from "./components/Trips.jsx";
import Trip from "./components/Trip.jsx";
import CreateTrip from "./components/CreateTrip.jsx";
import Investments from "./components/Investments.jsx";
import Investment from "./components/Investment.jsx";
import CreateInvestment from "./components/CreateInvestment.jsx"; // Assume you have this component
import Profile from "./components/Profile.jsx"; // Import Profile component
import Logbook from "./components/Logbook.jsx"; // Import Logbook component
import Dashboard from "./components/Dashboard.jsx";

// Import Private Routes
import PrivateRoute from "./components/PrivateRoute.jsx";
//import UserPrivateRoute from "./components/UserPrivateRoute.jsx";

// Import Navigation Components (Assuming you have an AdminSidebar)
//import AdminSidebar from "./components/AdminSidebar.jsx";

function App() {
  return (
    <>
      <Router>
            <AdminProvider>
    <NavBar/>
            <ToastContainer />
            <div className="flex">
              {/* Assuming you have a sidebar for admin navigation */}
      
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signedup" element={<Signedup />} />
                {/* Protected Admin Routes */}
                <Route
                  path="/create/user"
                  element={
                    <PrivateRoute>
                      <CreateUser />
                    </PrivateRoute>
                  }
                />
                       <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
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
                  path="/trip/:id"
                  element={
                    <PrivateRoute>
                      <Trip />
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
                  path="/investments"
                  element={
                    <PrivateRoute>
                      <Investments />
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
                  path="/create/investment"
                  element={
                    <PrivateRoute>
                      <CreateInvestment />
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
                {/* Protected User Routes */}
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                {/* Fallback Route */}
                <Route path="*" element={<Login />} />
              </Routes>
            </div>
      </AdminProvider>
          </Router>
      </>

  );
}

export default App;
