import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./userAuth/Login";
import Signup from "./userAuth/Signup";
import Profile from "./Profile";
import Logout from "./userAuth/Logout";
import NavBar from "./NavBar";
import Dashboard from "./Dashboard";
import GuidePage from "./Guide";

import Asset from "./Asset";
import Assets from "./Assets";

import User from "./User"
import Users from "./Users"

import Trip from "./Trip";
import Trips from "./Trips";

import Log from "./Log";
import Logbook from "./Logbook";

import Investment from "./Investment";
import Investments from "./Investments";

import Reports from "./Reports";
import Help from "./Help";


// <<<<<<< HEAD
// =======

// >>>>>>> b0ccbed (investment ready 2)
const App = () => {
  const [isUser, setIsUser] = useState(false);
  return (
    <>
      <BrowserRouter>
        <NavBar isUser={isUser} setIsUser={setIsUser} />
        <div className="w-full h-full bg-[#EBEBEB]">
          <Routes>
            <Route
              path="/"
              element={
                isUser ? (
                  <Dashboard />
                ) : (
                  <Login isUser={isUser} setIsUser={setIsUser} />
                )
              }
            />
            <Route
              path="/login"
              element={<Login isUser={isUser} setIsUser={setIsUser} />}
            />
            <Route
              path="/signup"
              element={<Signup isUser={isUser} setIsUser={setIsUser} />}
            />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/user" element={<User />} />
            <Route path="/users" element={<Users />} />

            <Route path="/assets" element={<Assets />} />
            <Route path="/asset" element={<Asset />} />
            
            <Route path="/trip" element={<Trip />} />
            <Route path="/trips" element={<Trips />} />

            <Route path="/log" element={<Log />} />
            <Route path="/logbook" element={<Logbook />} />

            <Route path="/investment" element={<Investment />} />
            <Route path="/investments" element={<Investments />} />

            <Route path="/help" element={<Help />} />
            <Route path="/reports" element={<Reports />} />

          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
