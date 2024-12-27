// src/components/NavBar.jsx

import React, { useState, useEffect, useContext } from "react";
import { Link as RouteLink, useNavigate } from "react-router-dom";
import { AdminContext } from "../contexts/AdminContext.jsx";
import { toast } from "react-toastify";
import { Menu, X, ChevronDown } from "lucide-react";

const NavBar = () => {
  const { admin, logout } = useContext(AdminContext);
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setShowLogoutMessage(true);
    navigate("/login");
    toast.info("You have successfully logged out.");
  };

  useEffect(() => {
    if (showLogoutMessage) {
      const timer = setTimeout(() => {
        setShowLogoutMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLogoutMessage]);

  const LogoutMessage = () => (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50">
      You have successfully logged out
    </div>
  );

  return (
    <>
      <nav className="sticky z-40 h-16 inset-x-0 top-0 w-full bg-[#201010] transition-all">
        <div className="flex items-center h-full px-4 justify-between w-full">
          <RouteLink to="/" className="flex z-40 font-semibold items-center">
            <img className="h-14" src="/logo_2.png" alt="Logo" /> {/* Ensure the logo path is correct */}
          </RouteLink>
          <div className="lg:hidden">
            <button onClick={toggleMobileMenu} className="p-2 text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <div className="hidden lg:flex h-full items-center space-x-4 justify-end w-full">
            {admin ? (
              <>
                {/* Authenticated Admin Links */}
                <RouteLink
                  to="/dashboard"
                  className={`text-lg border border-[#201010] hover:border-[#FF9321] text-[#FF9321] px-3 py-2 rounded-md`}
                >
                  Dashboard
                </RouteLink>

                <RouteLink
                  to="/users"
                  className={`text-lg border border-[#201010] hover:border-[#FF9321] text-[#FF9321] px-3 py-2 rounded-md`}
                >
                  Users
                </RouteLink>

                <RouteLink
                  to="/investments"
                  className={`text-lg border border-[#201010] hover:border-[#FF9321] text-[#FF9321] px-3 py-2 rounded-md`}
                >
                  Investments
                </RouteLink>

                {/* Trips Link */}
                <RouteLink
                  to="/trips"
                  className={`text-lg border border-[#201010] hover:border-[#FF9321] text-[#FF9321] px-3 py-2 rounded-md`}
                >
                  Trips
                </RouteLink>

                {/* Assets Link */}
                <RouteLink
                  to="/assets"
                  className={`text-lg border border-[#201010] hover:border-[#FF9321] text-[#FF9321] px-3 py-2 rounded-md`}
                >
                  Assets
                </RouteLink>

                <RouteLink
                  to="/logbook"
                  className={`text-lg border border-[#201010] hover:border-[#FF9321] text-[#FF9321] px-3 py-2 rounded-md`}
                >
                  Logbook
                </RouteLink>

                <RouteLink
                  to="/reports"
                  className={`text-lg border border-[#201010] hover:border-[#FF9321] text-[#FF9321] px-3 py-2 rounded-md`}
                >
                  Reports
                </RouteLink>

                <RouteLink
                  to="/admins"
                  className={`text-lg border border-[#201010] hover:border-[#FF9321] text-[#FF9321] px-3 py-2 rounded-md`}
                >
                  Admins
                </RouteLink>

                <div className="h-8 w-px bg-[#6B5A5A] hidden sm:block" />

                {/* Admin Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className={`hidden sm:flex items-center gap-1 bg-[#4A3A3A] text-lg border border-[#6B5A5A] hover:border-[#FF9321] text-[#FF9321] active:border-[#FF9321] px-3 py-2 rounded-md`}
                  >
                    {admin.name || "Admin"}
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md border border-[#FF9321] shadow-lg bg-[#201010] ring-1 ring-black ring-opacity-5">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <RouteLink
                          to="/profile"
                          className="block px-4 py-2 text-sm text-[#FF9321] hover:bg-[#2B1B1B] bg-[#201010] hover:text-[#FF9321]"
                          role="menuitem"
                          onClick={() => {
                            setIsDropdownOpen(false);
                          }}
                        >
                          Go to Profile
                        </RouteLink>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-[#2B1B1B] bg-[#201010]"
                          role="menuitem"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Unauthenticated Admin Links */}
                <RouteLink
                  to="/login"
                  className={`text-lg border border-[#201010] hover:border-[#FF9321] text-[#FF9321] px-3 py-2 rounded-md`}
                >
                  Login
                </RouteLink>
              </>
            )}
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#201010] w-full absolute top-16 left-0 border-b border-[#6B5A5A]">
            <div className="flex flex-col p-4 space-y-2">
              {admin ? (
                <>
                  {/* Authenticated Admin Mobile Links */}
                  <RouteLink
                    to="/dashboard"
                    className={`text-lg w-full text-left text-[#FF9321] px-3 py-2 rounded-md hover:bg-[#634040]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </RouteLink>
                  <RouteLink
                    to="/users"
                    className={`text-lg w-full text-left text-[#FF9321] px-3 py-2 rounded-md hover:bg-[#634040]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Users
                  </RouteLink>
                  <RouteLink
                    to="/investments"
                    className={`text-lg w-full text-left text-[#FF9321] px-3 py-2 rounded-md hover:bg-[#634040]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Investments
                  </RouteLink>

                  {/* Trips Link */}
                  <RouteLink
                    to="/trips"
                    className={`text-lg w-full text-left text-[#FF9321] px-3 py-2 rounded-md hover:bg-[#634040]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Trips
                  </RouteLink>

                  {/* Assets Link */}
                  <RouteLink
                    to="/assets"
                    className={`text-lg w-full text-left text-[#FF9321] px-3 py-2 rounded-md hover:bg-[#634040]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Assets
                  </RouteLink>

                  {/* Add more admin links as needed */}
                  <RouteLink
                    to="/profile"
                    className={`text-lg w-full text-left text-[#FF9321] px-3 py-2 rounded-md hover:bg-[#634040]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Go to Profile
                  </RouteLink>
                  <button
                    onClick={handleLogout}
                    className={`text-lg w-full text-left text-red-500 px-3 py-2 rounded-md hover:bg-[#634040]`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Unauthenticated Admin Mobile Links */}
                  <RouteLink
                    to="/login"
                    className={`text-lg w-full text-left text-[#FF9321] px-3 py-2 rounded-md hover:bg-[#634040]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </RouteLink>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      {showLogoutMessage && <LogoutMessage />}
    </>
  );
};

export default NavBar;
