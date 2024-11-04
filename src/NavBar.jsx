// import React, { useState, useEffect } from "react";
// import { Link as RouteLink } from "react-router-dom";
// import { buttonVariants } from "./ui/button";
// import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";

// const NavBar = ({ isUser, setIsUser }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showLogoutMessage, setShowLogoutMessage] = useState(false);
//   const user = {
//     username: "John Doe",
//     avatar: "user.jpg",
//   };

//   const largeTextButtonStyle = "text-lg !important";

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const handleClick = () => {
//     setIsDropdownOpen(false);
//     setIsMobileMenuOpen(false);
//     setIsUser(false);
//     setShowLogoutMessage(true);
//   };
//   useEffect(() => {
//     if (showLogoutMessage) {
//       const timer = setTimeout(() => {
//         setShowLogoutMessage(false);
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [showLogoutMessage]);

//   const LogoutMessage = () => (
//     <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
//       You have successfully logged out
//     </div>
//   );

//   return (
//     <>
//       <nav className="sticky z-40 h-16 inset-x-0 top-0 w-full border-b bg-white transition-all">
//         <div className="flex items-center h-full px-4 justify-between w-full">
//           <RouteLink to="/" className="flex z-40 font-semibold items-center">
//             <img className="h-14" src="logo_2.png" alt="Logo" />
//           </RouteLink>
//           <div className="lg:hidden">
//             <button onClick={toggleMobileMenu} className="p-2">
//               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//           <div className="hidden lg:flex h-full items-center space-x-4 justify-end w-full">
//             {isUser ? (
//               <>
//                 <RouteLink
//                   to="/"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-white hover:border-black`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Dashboard
//                 </RouteLink>
                
//                 <RouteLink
//                   to="/users"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-white hover:border-black`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Users
//                 </RouteLink>

//                 <RouteLink
//                   to="/assets"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-white hover:border-black`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Assets
//                 </RouteLink>
//                 <RouteLink
//                   to="/trips"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-white hover:border-black`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Trips
//                 </RouteLink>

//                 <RouteLink
//                   to="/reports"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-white hover:border-black`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Reports
//                 </RouteLink>

//                 <RouteLink
//                   to="/logbook"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-white hover:border-black`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Logbook
//                 </RouteLink>

//                 <RouteLink
//                   to="/investments"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-white hover:border-black`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Investments
//                 </RouteLink>

//                 <RouteLink
//                   to="/help"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-white hover:border-black`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Help
//                 </RouteLink>

//                 <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

//                 <div className="relative">
//                   <button
//                     onClick={toggleDropdown}
//                     className={`${buttonVariants({
//                       size: "lg",
//                     })} hidden sm:flex items-center gap-1 bg-gray-200 ${largeTextButtonStyle} border border-white hover:border-black`}
//                     style={{ fontSize: "1.125rem" }}
//                   >
//                     {user.username}
//                     <ChevronDown
//                       className={`ml-1 h-4 w-4 transition-transform ${
//                         isDropdownOpen ? "rotate-180" : ""
//                       }`}
//                     />
//                   </button>
//                   {isDropdownOpen && (
//                     <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
//                       <div
//                         className="py-1"
//                         role="menu"
//                         aria-orientation="vertical"
//                         aria-labelledby="options-menu"
//                       >
//                         <RouteLink
//                           to="/profile"
//                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           role="menuitem"
//                           onClick={() => {
//                             setIsDropdownOpen(false);
//                           }}
//                         >
//                           Go to Profile
//                         </RouteLink>
//                         <RouteLink
//                           to="/login"
//                           className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
//                           role="menuitem"
//                           onClick={handleClick}
//                         >
//                           Logout
//                         </RouteLink>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <>
//                 <RouteLink
//                   to="/contact"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-white hover:border-black`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Contact Us
//                 </RouteLink>
//                 <div className="h-8 w-px bg-zinc-200 hidden sm:block" />
//                 <RouteLink
//                   to="/signup"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "outline",
//                   })} ${largeTextButtonStyle} border-black text-black bg-white hover:bg-gray-200`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Sign up
//                 </RouteLink>
//                 <RouteLink
//                   to="/login"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "default",
//                   })} ${largeTextButtonStyle} border-black  bg-gray-700 text-white hover:bg-gray-300 hover:text-black`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Login
//                 </RouteLink>
//               </>
//             )}
//           </div>
//         </div>
//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="lg:hidden bg-white w-full absolute top-16 left-0 border-b">
//             <div className="flex flex-col p-4 space-y-2">
//               {isUser ? (
//                 <>
//                   <RouteLink
//                     to="/"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Dashboard
//                   </RouteLink>

//                   <RouteLink
//                     to="/users"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Users
//                   </RouteLink>

//                   <RouteLink
//                     to="/assets"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Assets
//                   </RouteLink>
//                   <RouteLink
//                     to="/trips"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Trips
//                   </RouteLink>
//                   <RouteLink
//                     to="/reports"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Reports
//                   </RouteLink>
//                   <RouteLink
//                     to="/logbook"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Logbook
//                   </RouteLink>
//                   <RouteLink
//                     to="/investments"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Investments
//                   </RouteLink>
//                   <RouteLink
//                     to="/help"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Help
//                   </RouteLink>
//                   <RouteLink
//                     to="/profile"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Profile
//                   </RouteLink>
//                   <RouteLink
//                     to="/login"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left text-red-500`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Logout
//                   </RouteLink>
//                 </>
//               ) : (
//                 <>
//                   <RouteLink
//                     to="/contact"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Contact Us
//                   </RouteLink>
//                   <RouteLink
//                     to="/signup"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "outline",
//                     })} ${largeTextButtonStyle} border-black text-black bg-white hover:bg-gray-200 w-full`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Sign up
//                   </RouteLink>
//                   <RouteLink
//                     to="/login"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "default",
//                     })} ${largeTextButtonStyle} border-black  bg-gray-700 text-white hover:bg-gray-300 hover:text-black w-full`}
//                     onClick={handleClick}
//                   >
//                     Login
//                   </RouteLink>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </nav>
//       {showLogoutMessage && <LogoutMessage />}
//     </>
//   );
// };

// export default NavBar;


// import React, { useState, useEffect } from "react";
// import { Link as RouteLink } from "react-router-dom";
// import { buttonVariants } from "./ui/button";
// import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";

// const NavBar = ({ isUser, setIsUser }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showLogoutMessage, setShowLogoutMessage] = useState(false);
//   const user = {
//     username: "John Doe",
//     avatar: "user.jpg",
//   };

//   const largeTextButtonStyle = "text-lg !important";

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const handleClick = () => {
//     setIsDropdownOpen(false);
//     setIsMobileMenuOpen(false);
//     setIsUser(false);
//     setShowLogoutMessage(true);
//   };
//   useEffect(() => {
//     if (showLogoutMessage) {
//       const timer = setTimeout(() => {
//         setShowLogoutMessage(false);
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [showLogoutMessage]);

//   const LogoutMessage = () => (
//     <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
//       You have successfully logged out
//     </div>
//   );

//   return (
//     <>
//       <nav className="sticky z-40 h-16 inset-x-0 top-0 w-full bg-custom-darker transition-all">
//         <div className="flex items-center h-full px-4 justify-between w-full">
//           <RouteLink to="/" className="flex z-40 font-semibold items-center">
//             <img className="h-14" src="logo_2.png" alt="Logo" />
//           </RouteLink>
//           <div className="lg:hidden">
//             <button onClick={toggleMobileMenu} className="p-2">
//               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//           <div className="hidden lg:flex h-full items-center space-x-4 justify-end w-full">
//             {isUser ? (
//               <>
//                 <RouteLink
//                   to="/"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-[#151515] hover:border-white text-white`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Dashboard
//                 </RouteLink>
                
//                 <RouteLink
//                   to="/users"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-[#151515] hover:border-white text-white`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Users
//                 </RouteLink>

//                 <RouteLink
//                   to="/assets"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-[#151515] hover:border-white text-white`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Assets
//                 </RouteLink>
//                 <RouteLink
//                   to="/trips"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-[#151515] hover:border-white text-white`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Trips
//                 </RouteLink>

//                 <RouteLink
//                   to="/reports"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-[#151515] hover:border-white text-white`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Reports
//                 </RouteLink>

//                 <RouteLink
//                   to="/logbook"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-[#151515] hover:border-white text-white`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Logbook
//                 </RouteLink>

//                 <RouteLink
//                   to="/investments"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-[#151515] hover:border-white text-white`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Investments
//                 </RouteLink>

//                 <RouteLink
//                   to="/help"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-[#151515] hover:border-white text-white`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Help
//                 </RouteLink>

//                 <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

//                 <div className="relative">
//                   <button
//                     onClick={toggleDropdown}
//                     className={`${buttonVariants({
//                       size: "lg",
//                     })} hidden sm:flex items-center gap-1 bg-[#303030] ${largeTextButtonStyle} border border-[#151515] hover:border-white text-white`}
//                     style={{ fontSize: "1.125rem" }}
//                   >
//                     {user.username}
//                     <ChevronDown
//                       className={`ml-1 h-4 w-4 transition-transform ${
//                         isDropdownOpen ? "rotate-180" : ""
//                       }`}
//                     />
//                   </button>
//                   {isDropdownOpen && (
//                     <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#101010] ring-1 ring-black ring-opacity-5">
//                       <div
//                         className="py-1"
//                         role="menu"
//                         aria-orientation="vertical"
//                         aria-labelledby="options-menu"
//                       >
//                         <RouteLink
//                           to="/profile"
//                           className="block px-4 py-2 text-sm text-white hover:bg-gray-100 bg-[#101010] hover:text-[#202020]"
//                           role="menuitem"
//                           onClick={() => {
//                             setIsDropdownOpen(false);
//                           }}
//                         >
//                           Go to Profile
//                         </RouteLink>
//                         <RouteLink
//                           to="/login"
//                           className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 bg-[#101010]"
//                           role="menuitem"
//                           onClick={handleClick}
//                         >
//                           Logout
//                         </RouteLink>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <>
//                 <RouteLink
//                   to="/contact"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "ghost",
//                   })} ${largeTextButtonStyle} border border-[#151515] hover:border-white text-white`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Contact Us
//                 </RouteLink>
//                 <div className="h-8 w-px bg-zinc-200 hidden sm:block" />
//                 <RouteLink
//                   to="/signup"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "outline",
//                   })} ${largeTextButtonStyle} border-black text-black bg-white hover:bg-[#151515]  hover:border-white hover:text-white `}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Sign up
//                 </RouteLink>
//                 <RouteLink
//                   to="/login"
//                   className={`${buttonVariants({
//                     size: "sm",
//                     variant: "default",
//                   })} ${largeTextButtonStyle} border-black  bg-[#404040] text-white hover:bg-[#ffffff] hover:border-white hover:text-black`}
//                   style={{ fontSize: "1.125rem" }}
//                 >
//                   Login
//                 </RouteLink>
//               </>
//             )}
//           </div>
//         </div>
//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="lg:hidden bg-[#1f1f1f] w-full absolute top-16 left-0 border-b">
//             <div className="flex flex-col p-4 space-y-2">
//               {isUser ? (
//                 <>
//                   <RouteLink
//                     to="/"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Dashboard
//                   </RouteLink>

//                   <RouteLink
//                     to="/users"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Users
//                   </RouteLink>

//                   <RouteLink
//                     to="/assets"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Assets
//                   </RouteLink>
//                   <RouteLink
//                     to="/trips"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Trips
//                   </RouteLink>
//                   <RouteLink
//                     to="/reports"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Reports
//                   </RouteLink>
//                   <RouteLink
//                     to="/logbook"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Logbook
//                   </RouteLink>
//                   <RouteLink
//                     to="/investments"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Investments
//                   </RouteLink>
//                   <RouteLink
//                     to="/help"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Help
//                   </RouteLink>
//                   <RouteLink
//                     to="/profile"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Profile
//                   </RouteLink>
//                   <RouteLink
//                     to="/login"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left text-red-500`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Logout
//                   </RouteLink>
//                 </>
//               ) : (
//                 <>
//                   <RouteLink
//                     to="/contact"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "ghost",
//                     })} ${largeTextButtonStyle} w-full text-left`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Contact Us
//                   </RouteLink>
//                   <RouteLink
//                     to="/signup"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "outline",
//                     })} ${largeTextButtonStyle} border-black text-black bg-white hover:bg-gray-200 w-full`}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Sign up
//                   </RouteLink>
//                   <RouteLink
//                     to="/login"
//                     className={`${buttonVariants({
//                       size: "sm",
//                       variant: "default",
//                     })} ${largeTextButtonStyle} border-black  bg-gray-700 text-white hover:bg-gray-300 hover:text-black w-full`}
//                     onClick={handleClick}
//                   >
//                     Login
//                   </RouteLink>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </nav>
//       {showLogoutMessage && <LogoutMessage />}
//     </>
//   );
// };

// export default NavBar;


import React, { useState, useEffect , useContext} from "react";
import { Link as RouteLink } from "react-router-dom";
import { buttonVariants } from "./ui/button";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";

const NavBar = ({ isUser, setIsUser }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const user = {
    username: "John Doe",
    avatar: "user.jpg",
  };

  const largeTextButtonStyle = "text-lg !important";

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleClick = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsUser(false);
    setShowLogoutMessage(true);
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
            <img className="h-14" src="../public/logo_2.png" alt="Logo" />
          </RouteLink>
          <div className="lg:hidden">
            <button onClick={toggleMobileMenu} className="p-2 text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <div className="hidden lg:flex h-full items-center space-x-4 justify-end w-full">
            {isUser ? (
              <>
                <RouteLink
                  to="/"
                  className={`${buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })} ${largeTextButtonStyle} border border-[#201010] hover:border-[#FF9321] text-[#FF9321]`}
                  style={{ fontSize: "1.125rem" }}
                >
                  Dashboard
                </RouteLink>
                
                <RouteLink
                  to="/users"
                  className={`${buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })} ${largeTextButtonStyle} border border-[#201010] hover:border-[#FF9321] text-[#FF9321]`}
                  style={{ fontSize: "1.125rem" }}
                >
                  Users
                </RouteLink>

                <RouteLink
                  to="/assets"
                  className={`${buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })} ${largeTextButtonStyle} border border-[#201010] hover:border-[#FF9321] text-[#FF9321]`}
                  style={{ fontSize: "1.125rem" }}
                >
                  Assets
                </RouteLink>

                <RouteLink
                  to="/trips"
                  className={`${buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })} ${largeTextButtonStyle} border border-[#201010] hover:border-[#FF9321] text-[#FF9321]`}
                  style={{ fontSize: "1.125rem" }}
                >
                  Trips
                </RouteLink>

                <RouteLink
                  to="/investments"
                  className={`${buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })} ${largeTextButtonStyle} border border-[#201010] hover:border-[#FF9321] text-[#FF9321]`}
                  style={{ fontSize: "1.125rem" }}
                >
                  Investments
                </RouteLink>

                <RouteLink
                  to="/logbook"
                  className={`${buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })} ${largeTextButtonStyle} border border-[#201010] hover:border-[#FF9321] text-[#FF9321]`}
                  style={{ fontSize: "1.125rem" }}
                >
                  Logbook
                </RouteLink>

                <RouteLink
                  to="/reports"
                  className={`${buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })} ${largeTextButtonStyle} border border-[#201010] hover:border-[#FF9321] text-[#FF9321]`}
                  style={{ fontSize: "1.125rem" }}
                >
                  Reports
                </RouteLink>

                <RouteLink
                  to="/help"
                  className={`${buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })} ${largeTextButtonStyle} border border-[#201010] hover:border-[#FF9321] text-[#FF9321]`}
                  style={{ fontSize: "1.125rem" }}
                >
                  Help
                </RouteLink>

                <div className="h-8 w-px bg-[#6B5A5A] hidden sm:block" />

                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className={`${buttonVariants({
                      size: "lg",
                    })} hidden sm:flex items-center gap-1 bg-[#4A3A3A] ${largeTextButtonStyle} border border-[#6B5A5A] hover:border-[#FF9321] text-[#FF9321] active:border-[#FF9321]`}
                    style={{ fontSize: "1.125rem" }}
                  >
                    {user.username}
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
                        <RouteLink
                          to="/login"
                          className="block px-4 py-2 text-sm text-red-500 hover:bg-[#2B1B1B] bg-[#201010]"
                          role="menuitem"
                          onClick={handleClick}
                        >
                          Logout
                        </RouteLink>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <RouteLink
                  to="/contact"
                  className={`${buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })} ${largeTextButtonStyle} border border-[#6B5A5A] hover:border-[#FF9321] text-[#FF9321]`}
                  style={{ fontSize: "1.125rem" }}
                >
                  Contact Us
                </RouteLink>
                <div className="h-8 w-px bg-[#6B5A5A] hidden sm:block" />
                <RouteLink
                  to="/signup"
                  className={`${buttonVariants({
                    size: "sm",
                    variant: "outline",
                  })} ${largeTextButtonStyle} border-[#6B5A5A] text-[#201010] bg-[#FF9321] hover:bg-[#5A4A4A] hover:border-[#FF9321] hover:text-[#FF9321]`}
                  style={{ fontSize: "1.125rem" }}
                >
                  Sign up
                </RouteLink>
                <RouteLink
                  to="/login"
                  className={`${buttonVariants({
                    size: "sm",
                    variant: "default",
                  })} ${largeTextButtonStyle} border-[#6B5A5A] bg-[#5A4A4A] text-[#FF9321] hover:bg-[#FF9321] hover:text-[#201010]`}
                  style={{ fontSize: "1.125rem" }}
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
              {isUser ? (
                <>
                  <RouteLink
                    to="/"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} ${largeTextButtonStyle} w-full text-left text-[#FF9321]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </RouteLink>
                  <RouteLink
                    to="/users"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} ${largeTextButtonStyle} w-full text-left text-[#FF9321]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Users
                  </RouteLink>

                  <RouteLink
                    to="/assets"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} ${largeTextButtonStyle} w-full text-left text-[#FF9321]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Assets
                  </RouteLink>

                  <RouteLink
                    to="/trips"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} ${largeTextButtonStyle} w-full text-left text-[#FF9321]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Trips
                  </RouteLink>

                  <RouteLink
                    to="/investments"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} ${largeTextButtonStyle} w-full text-left text-[#FF9321]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Investments
                  </RouteLink>

                  <RouteLink
                    to="/logbook"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} ${largeTextButtonStyle} w-full text-left text-[#FF9321]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Logbook
                  </RouteLink>

                  <RouteLink
                    to="/reports"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} ${largeTextButtonStyle} w-full text-left text-[#FF9321]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Reports
                  </RouteLink>

                  <RouteLink
                    to="/help"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} ${largeTextButtonStyle} w-full text-left text-[#FF9321]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Help
                  </RouteLink>

                  <RouteLink
                    to="/profile"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} ${largeTextButtonStyle} w-full text-left text-[#FF9321]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Go to Profile
                  </RouteLink>

                  <RouteLink
                    to="/login"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} ${largeTextButtonStyle} w-full text-left text-red-500`}
                    role="menuitem"
                    onClick={handleClick}
                  >
                    Logout
                  </RouteLink>

                </>
              ) : (
                <>
                  <RouteLink
                    to="/contact"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })} ${largeTextButtonStyle} w-full text-left text-[#FF9321]`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact Us
                  </RouteLink>
                  <RouteLink
                    to="/signup"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "outline",
                    })} ${largeTextButtonStyle} border-[#6B5A5A] text-[#201010] bg-[#FF9321] hover:bg-[#5A4A4A] w-full`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up
                  </RouteLink>
                  <RouteLink
                    to="/login"
                    className={`${buttonVariants({
                      size: "sm",
                      variant: "default",
                    })} ${largeTextButtonStyle} border-[#6B5A5A] bg-[#5A4A4A] text-[#FF9321] hover:bg-[#FF9321] hover:text-[#201010] w-full`}
                    onClick={handleClick}
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
