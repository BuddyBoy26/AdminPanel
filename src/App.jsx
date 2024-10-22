import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./userAuth/Login";
import Signup from "./userAuth/Signup";
import Profile from "./Profile";
import Assets from "./Assets";
import Contract from "./Contract";
import Logout from "./userAuth/Logout";
import Asset from "./Asset";
import Investment from "./Investment";
import NavBar from "./NavBar";
// <<<<<<< Updated upstream
// import Trips from "./Trips";
// =======
// >>>>>>> Stashed changes

import ContactForm from "./Contact";
import GuidePage from "./Guide";
import Trips from "./Trips";
import { useState } from "react";
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
                  <Investment />
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
            <Route path="/home" element={<Investment />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/contract" element={<Contract />} />
            <Route path="/asset" element={<Asset />} />
            {/* <<<<<<< Updated upstream
            <Route path="/trips" element={<Trips />} />
            <Route path="/contact" element={<ContactForm />} />
=======
        
            
>>>>>>> Stashed changes */}

            <Route path="/trips" element={<Trips />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/guide" element={<GuidePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
