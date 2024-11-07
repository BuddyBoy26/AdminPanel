import React, { useState } from 'react';
import { ChevronRight, Home, Map, Truck, User, DollarSign, FileText, HelpCircle, PhoneCall, LogIn, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const GuideSection = ({ title, icon, content, isOpen, toggle, link }) => (
  <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
    <button
      onClick={toggle}
      className="w-full flex items-center justify-between p-4 text-left focus:outline-none hover:bg-gray-50"
    >
      <div className="flex items-center">
        {icon}
        <h2 className="text-xl font-semibold ml-3">{title}</h2>
      </div>
      <ChevronRight className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
    </button>
    {isOpen && (
      <div className="p-4 bg-gray-50">
        <p className="text-gray-700 text-lg italic mb-3 px-4"> {title} allows you to access the following details:</p>
        <ul className="space-y-2">
          {content.map((item, index) => (
            <li key={index} className="flex items-start px-10">
              <div className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-blue-500 mr-2 "></div>
              <span>{item}</span>
            </li>
          ))}
          <li className="mt-4 px-4">
            <Link
              to={link}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 my-5"
            >
              Go to {title} <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </li>
        </ul>
      </div>
    )}
  </div>
);

const GuidePage = () => {
  const [openSection, setOpenSection] = useState(null);

  const sections = [
    {
      title: "Dashboard",
      icon: <Home className="w-6 h-6 text-blue-500" />,
      content: [
        "Initial Investment",
        "Current Investment Value",
        "Number of Assets",
        "Ticket Size",
        "Agreed ROI and Lock-In Period",
        "View Contract button",
        "Latest Updates",
        "Number of Trips So Far",
        "Currently Active Trucks"
      ],
      link: "/dashboard"
    },
    {
      title: "Trips",
      icon: <Map className="w-6 h-6 text-green-500" />,
      content: [
        "Trip History: value, origin, destination, start date, end date, and calculations for each trip"
      ],
      link: "/trips"
    },
    {
      title: "Assets",
      icon: <Truck className="w-6 h-6 text-yellow-500" />,
      content: [
        "List of your assets",
        "Links to view more details about each asset"
      ],
      link: "/assets"
    },
    {
      title: "Profile",
      icon: <User className="w-6 h-6 text-purple-500" />,
      content: [
        "Personal and investment details"
      ],
      link: "/profile"
    },
    {
      title: "Guide",
      icon: <HelpCircle className="w-6 h-6 text-teal-500" />,
      content: [
        "You're currently reading the guide",
        "Return here anytime for help navigating the website"
      ],
      link: "/guide"
    },
    {
      title: "Contact",
      icon: <PhoneCall className="w-6 h-6 text-pink-500" />,
      content: [
        "Customer support details"
      ],
      link: "/contact"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Website Navigation Guide
          </h1>
          <p className="mt-3 max-w-md mx-auto text-xl text-gray-600 sm:text-2xl md:mt-5 md:max-w-3xl">
            Welcome to our investment tracking platform. This guide will help you navigate through the various sections of the website.
          </p>
        </div>
        
        <div className="space-y-6">
          {sections.map((section, index) => (
            <GuideSection
              key={index}
              {...section}
              isOpen={openSection === index}
              toggle={() => setOpenSection(openSection === index ? null : index)}
            />
          ))}
        </div>
        
        <div className="mt-12 p-6 bg-white rounded-lg shadow-lg border border-blue-200">
          <p className="text-lg text-black font-medium">
            By following this guide, you should have an easy time managing your investments and keeping track of your assets. Happy investing!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;