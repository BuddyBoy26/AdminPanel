// src/components/NavBar.jsx

import React, { useState, useEffect, useContext } from "react";
import { Link as RouteLink, useNavigate } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { AdminContext } from "../contexts/AdminContext.jsx"; // Updated to AdminContext

const NavBar = () => {
  const { admin, token, logout } = useContext(AdminContext); // Use AdminContext
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
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
      You have successfully logged out
    </div>
  );

  return (
    <>
      <nav className="sticky z-40 h-16 inset-x-0 top-0 w-full bg-[#201010] transition-all">
        <div className="flex items-center h-full px-4 justify-between w-full">
          <RouteLink to="/" className="flex z-40 font-semibold items-center">
            <img className="h-14" src="/logo_2.png" alt="Logo" /> {/* Corrected path */}
          </RouteLink>
          <div className="lg:hidden">
            <button onClick={toggleMobileMenu} className="p-2 text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <div className="hidden lg:flex h-full items-center space-x-4 justify-end w-full">
            {token && admin ? ( // Check for admin authentication
              <>
                {/* Authenticated Admin Links */}
                <RouteLink
                  to="/dashboard"
                  className={`${buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })} text-lg border border-[#201010] hover:border-[#FF9321] text-[#FF9321]`}
                >
                  Dashboard
                </RouteLink>

                <RouteLink
                  to="/users"
                  className={`${buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })} text-lg border border-[#201010] hover:border-[#FF9321] text-[#FF9321]`}
                >
                  Users
                </RouteLink>

                {/* New Investment Link */}
                <RouteLink
                  to="/investments"
                  className={`${buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })} text-lg border border-[#201010] hover:border-[#FF9321] text-[#FF9321]`}
                >
                  Investments
                </RouteLink>

                {/* ... other links ... */}

                <div className="h-8 w-px bg-[#6B5A5A] hidden sm:block" />

                {/* Admin Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className={`${buttonVariants({
                      size: "lg",
                    })} hidden sm:flex items-center gap-1 bg-[#4A3A3A] text-lg border border-[#6B5A5A] hover:border-[#FF9321] text-[#FF9321] active:border-[#FF9321]`}
                  >
                    {admin?.name || "Admin"}
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
                  className={`${buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })} text-lg border border-[#201010] hover:border-[#FF9321] text-[#FF9321]`}
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
              {token && admin ? (
                <>
                  {/* Authenticated Admin Mobile Links */}
                  <RouteLink
                    to="/dashboard"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} text-lg w-full text-left text-[#FF9321]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </RouteLink>
                  <RouteLink
                    to="/users"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} text-lg w-full text-left text-[#FF9321]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Users
                  </RouteLink>

                  {/* New Investment Link in Mobile Menu */}
                  <RouteLink
                    to="/investments"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} text-lg w-full text-left text-[#FF9321]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Investments
                  </RouteLink>

                  {/* ... other links ... */}

                  <RouteLink
                    to="/profile"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} text-lg w-full text-left text-[#FF9321]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Go to Profile
                  </RouteLink>

                  <button
                    onClick={handleLogout}
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} text-lg w-full text-left text-red-500`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Unauthenticated Admin Mobile Links */}
                  <RouteLink
                    to="/login"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} text-lg w-full text-left text-[#FF9321]`}
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
