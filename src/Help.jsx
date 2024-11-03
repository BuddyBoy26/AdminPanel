import React, { useState } from 'react';
import {
  ChevronRight,
  Home,
  Users,
  Truck,
  Map,
  DollarSign,
  Book,
  BarChart2,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpSection = ({ title, icon, content, isOpen, toggle, link }) => (
  <div className="mb-6 bg-[#493939] rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
    <button
      onClick={toggle}
      className="w-full flex items-center justify-between p-4 text-left focus:outline-none hover:bg-[#3a2a2a]"
    >
      <div className="flex items-center">
        {icon}
        <h2 className="text-xl font-semibold text-white ml-3">{title}</h2>
      </div>
      <ChevronRight
        className={`w-5 h-5 text-white transform transition-transform duration-300 ${
          isOpen ? 'rotate-90' : ''
        }`}
      />
    </button>
    {isOpen && (
      <div className="p-4 bg-[#3a2a2a]">
        <p className="text-white text-lg italic mb-3 px-4">
          {title} allows you to access the following details:
        </p>
        <ul className="space-y-2">
          {content.map((item, index) => (
            <li key={index} className="flex items-start px-4 sm:px-10">
              <div className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-[#FF9321] mr-2"></div>
              <span className="text-white">{item}</span>
            </li>
          ))}
          <li className="mt-4 px-4 sm:px-10">
            <Link
              to={link}
              className="inline-flex items-center px-4 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white font-bold"
            >
              Go to {title} <ExternalLink className="ml-2 h-4 w-4 text-white" />
            </Link>
          </li>
        </ul>
      </div>
    )}
  </div>
);

const HelpPage = () => {
  const [openSection, setOpenSection] = useState(null);

  const sections = [
    {
      title: 'Dashboard',
      icon: <Home className="w-6 h-6 text-[#FF9321]" />,
      content: [
        'Overview of your Investors',
        'Current Investment Value',
        'Number of Assets',
        'Number of Trips',
        'Number of Investments',
        'Download Report, for the previous month',
        'Latest Updates',
        'Latest Logs',
        'To be Verified',
      ],
      link: '/dashboard',
    },
    {
      title: 'Users',
      icon: <Users className="w-6 h-6 text-[#FF9321]" />,
      content: [
        'View and edit user details',
        'Add users',
      ],
      link: '/users',
    },
    {
      title: 'Assets',
      icon: <Truck className="w-6 h-6 text-[#FF9321]" />,
      content: [
        'View and edit asset details',
        'Add assets',
      ],
      link: '/assets',
    },
    {
      title: 'Trips',
      icon: <Map className="w-6 h-6 text-[#FF9321]" />,
      content: [
        'View and edit trip details',
        'Add trips',
      ],
      link: '/trips',
    },
    {
      title: 'Investments',
      icon: <DollarSign className="w-6 h-6 text-[#FF9321]" />,
      content: [
        'View and edit investment details',
        'Add investments',
      ],
      link: '/investments',
    },
    {
      title: 'Logbook',
      icon: <Book className="w-6 h-6 text-[#FF9321]" />,
      content: [
        'Access detailed logs of all activities',
        'Filter logs by date, admin, action, or unit',
        'Export logs for reporting purposes',
        'Monitor system changes and updates',
      ],
      link: '/logbook',
    },
    {
      title: 'Reports',
      icon: <BarChart2 className="w-6 h-6 text-[#FF9321]" />,
      content: [
        'Generate comprehensive Overview reports',
        'Download reports in various formats',
      ],
      link: '/reports',
    },
  ];

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#FF9321]">
            Admin Panel Navigation Help
          </h1>
          <p className="mt-3 max-w-md mx-auto text-xl text-white">
            Welcome to the help section. Click on each card to know more.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <HelpSection
              key={index}
              {...section}
              isOpen={openSection === index}
              toggle={() =>
                setOpenSection(openSection === index ? null : index)
              }
            />
          ))}
        </div>

        <div className="mt-12 p-6 bg-[#493939] rounded-lg shadow-lg border border-[#FF9321]">
          <p className="text-lg text-white font-medium">
            By following this help, you should have an easy time managing your
            investments and keeping track of your assets, trips, users, logbook, and reports.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
