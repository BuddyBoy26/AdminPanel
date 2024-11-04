import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./userAuth/Login";
import Signup from "./userAuth/Signup";
import Signedup from "./userAuth/Signedup";
import Profile from "./Profile";
import Logout from "./userAuth/Logout";
import NavBar from "./NavBar";
import Dashboard from "./Dashboard";

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
import CreateUser from "./CreateUser";
import CreateTrip from "./CreateTrip";
import CreateInvestment from "./CreateInvestment";

import { ThemeProvider } from './ThemeContext.jsx';
import CreateAsset from "./CreateAsset.jsx";
import VerifyUser from "./VerifyUser.jsx";
import EnterOtp from "./EnterOTP.jsx";
import OtpSuccess from "./OtpSuccess.jsx";

// <<<<<<< HEAD
// =======

// >>>>>>> b0ccbed (investment ready 2)
const App = () => {
  const [isUser, setIsUser] = useState(false);
  return (
    <>
      {/* <ThemeProvider> */}
        <BrowserRouter>
          <NavBar isUser={isUser} setIsUser={setIsUser} />
          <div className="w-full h-full bg-[#1f1f1f]">
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
              <Route
              path="/signedup"
              element={<Signedup isUser={isUser} setIsUser={setIsUser} />}
            />
              <Route path="/home" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
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

              <Route path="/create/user" element={<CreateUser />} />
              <Route path="/create/asset" element={<CreateAsset />} />
              <Route path="/create/trip" element={<CreateTrip />} />
              <Route path="/create/investment" element={<CreateInvestment />} />

              <Route path="/verify/user" element={<VerifyUser />} />
              <Route path="/otp" element={<EnterOtp />} />
              <Route path="/otp/success" element={<OtpSuccess />} />

            </Routes>
          </div>
        </BrowserRouter>
      {/* </ThemeProvider> */}
    </>
  );
};

export default App;
