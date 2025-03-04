import { useState } from "react";
import layout from "./Assets/layout.jpg";
import { BsBoxSeam } from "react-icons/bs";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaWpforms } from "react-icons/fa";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FiBox } from "react-icons/fi";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpenGrievance, setIsDropdownOpenGrievance] = useState(false);
  const [isDropdownOpenEngagement, setIsDropdownOpenEngagement] = useState(false);
  const [isDropdownOpenCommunication, setIsDropdownOpenCommunication] = useState(false);
  const [isDropdownOpenAnalytics, setIsDropdownOpenAnalytics] = useState(false);
  
  // Manage active item selection
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const toggleDropdownGrievance = () => {
    setIsDropdownOpenGrievance((prev) => !prev);
    setActiveDropdown(activeDropdown === 'grievance' ? null : 'grievance');
  };

  const toggleDropdownEngagement = () => {
    setIsDropdownOpenEngagement((prev) => !prev);
    setActiveDropdown(activeDropdown === 'engagement' ? null : 'engagement');
  };

  const toggleDropdownCommunication = () => {
    setIsDropdownOpenCommunication((prev) => !prev);
    setActiveDropdown(activeDropdown === 'communication' ? null : 'communication');
  };

  const toggleDropdownAnalytics = () => {
    setIsDropdownOpenAnalytics((prev) => !prev);
    setActiveDropdown(activeDropdown === 'analytics' ? null : 'analytics');
  };

  return (
    <div
      className={`flex flex-col h-screen text-black px-4 py-6 border-r-2 sticky top-0 max-md:hidden transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-72 lg:w-80"
      } shadow-lg rounded-xl`}
      aria-label="Sidebar"
    >
      {/* Toggle Button */}
      <div className="flex justify-end">
        <button
          onClick={toggleSidebar}
          className="mb-4 p-2 text-black border border-gray-300 rounded-full hover:bg-gray-300 transition duration-300 transform hover:scale-110"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Link to="/Dashboard" className="flex items-center gap-2 cursor-pointer" aria-label="Dashboard Logo">
          <img src={layout} alt="Dashboard logo" className="w-12 h-12 rounded-full shadow-lg" />
          {!isCollapsed && <p className="text-2xl font-semibold">Dashboard</p>}
        </Link>
      </div>

      {/* Grievance Section */}
      <div className="mb-4">
        <div
          className="flex gap-3 items-center cursor-pointer text-sm hover:text-blue-200 transition duration-300"
          onClick={toggleDropdownGrievance}
          aria-expanded={isDropdownOpenGrievance}
          aria-controls="grievance-dropdown"
          aria-label="Grievance Apps"
        >
          <BsBoxSeam className="w-5 h-5 text-blue-300" />
          {!isCollapsed && <span className="font-semibold text-lg">Grievance Management</span>}
          {!isCollapsed && (
            <div className="ml-auto">
              {isDropdownOpenGrievance ? (
                <IoIosArrowUp size={18} />
              ) : (
                <IoIosArrowDown size={18} />
              )}
            </div>
          )}
        </div>
        <ul
          id="grievance-dropdown"
          className={`pl-6 mt-2 space-y-1 overflow-hidden transition-all duration-500 ease-in-out transform ${
            isDropdownOpenGrievance ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {[{ name: "Employee Complaint", link: "/EmComplaint" }].map((item) => (
            <li key={item.name}>
              <Link
                to={item.link}
                className={`text-sm flex justify-between py-2 px-4 rounded-md transition-all duration-200 ${
                  activeDropdown === 'grievance'
                    ? 'bg-blue-700 text-white scale-105'
                    : 'hover:bg-blue-500 hover:scale-105'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Employee Engagement Section */}
      <div className="mb-4">
        <div
          className="flex gap-3 items-center cursor-pointer text-sm hover:text-green-200 transition duration-300"
          onClick={toggleDropdownEngagement}
          aria-expanded={isDropdownOpenEngagement}
          aria-controls="engagement-dropdown"
          aria-label="Engagement Apps"
        >
          <FaWpforms className="w-5 h-5 text-green-300" />
          {!isCollapsed && <span className="font-semibold text-lg">Employee Engagement</span>}
          {!isCollapsed && (
            <div className="ml-auto">
              {isDropdownOpenEngagement ? (
                <IoIosArrowUp size={18} />
              ) : (
                <IoIosArrowDown size={18} />
              )}
            </div>
          )}
        </div>
        <ul
          id="engagement-dropdown"
          className={`pl-6 mt-2 space-y-1 overflow-hidden transition-all duration-500 ease-in-out transform ${
            isDropdownOpenEngagement ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {[{ name: "Employee Suggestion Box", link: "/EmployeeEngagement" },
          ].map((item) => (
            <li key={item.name}>
              <Link
                to={item.link}
                className={`text-sm flex justify-between py-2 px-4 rounded-md transition-all duration-200 ${
                  activeDropdown === 'engagement'
                    ? 'bg-green-700 text-white scale-105'
                    : 'hover:bg-green-500 hover:scale-105'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Employee Communication Section */}
      <div className="mb-4">
        <div
          className="flex gap-3 items-center cursor-pointer text-sm hover:text-purple-200 transition duration-300"
          onClick={toggleDropdownCommunication}
          aria-expanded={isDropdownOpenCommunication}
          aria-controls="communication-dropdown"
          aria-label="Communication Apps"
        >
          <IoChatboxEllipsesOutline className="w-5 h-5 text-purple-300" />
          {!isCollapsed && <span className="font-semibold text-lg">Employee Communication</span>}
          {!isCollapsed && (
            <div className="ml-auto">
              {isDropdownOpenCommunication ? (
                <IoIosArrowUp size={18} />
              ) : (
                <IoIosArrowDown size={18} />
              )}
            </div>
          )}
        </div>
        <ul
          id="communication-dropdown"
          className={`pl-6 mt-2 space-y-1 overflow-hidden transition-all duration-500 ease-in-out transform ${
            isDropdownOpenCommunication ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {[{ name: "Communication Portal", link: "/communicationportal" }].map((item) => (
            <li key={item.name}>
              <Link
                to={item.link}
                className={`text-sm flex justify-between py-2 px-4 rounded-md transition-all duration-200 ${
                  activeDropdown === 'communication'
                    ? 'bg-purple-700 text-white scale-105'
                    : 'hover:bg-purple-500 hover:scale-105'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Analytics Section */}
     
        
        

    </div>
  );
};

export default Sidebar;
