import { useState } from "react";
import layout from "./Assets/layout.png";
import { MdOutlineScreenshotMonitor } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Link } from "react-router-dom"; // Import Link
import { IoFileTrayOutline, IoChatboxOutline, IoDocumentTextOutline } from "react-icons/io5"; // Adjusted import
import { RiFilePaper2Line } from "react-icons/ri";
import { FiBox } from "react-icons/fi";
import { FaWpforms } from "react-icons/fa";
import { HiRefresh } from "react-icons/hi";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpenGrievance, setIsDropdownOpenGrievance] = useState(false);
  const [isDropdownOpenEngagement, setIsDropdownOpenEngagement] = useState(false);
  const [isDropdownOpenCommunication, setIsDropdownOpenCommunication] = useState(false);
  const [isDropdownOpenAnalytics, setIsDropdownOpenAnalytics] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const toggleDropdownGrievance = () => {
    setIsDropdownOpenGrievance((prev) => !prev);
  };

  const toggleDropdownEngagement = () => {
    setIsDropdownOpenEngagement((prev) => !prev);
  };

  const toggleDropdownCommunication = () => {
    setIsDropdownOpenCommunication((prev) => !prev);
  };

  const toggleDropdownAnalytics = () => {
    setIsDropdownOpenAnalytics((prev) => !prev);
  };

  return (
    <div
      className={`flex flex-col h-screen bg-white text-black px-4 py-4 border-r-2 sticky top-0 max-md:hidden transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-72 lg:w-80"
      }`}
      aria-label="Sidebar"
    >
      {/* Toggle Button */}
      <div className="flex justify-end">
        <button
          onClick={toggleSidebar}
          className="mb-4 p-1 text-black border border-gray-300 rounded-md hover:bg-gray-200 transition duration-200 w-11"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer mb-8 justify-center"
        aria-label="Dashboard Logo"
      >
        <img src={layout} alt="Dashboard logo" className="w-10 h-10" />
        {!isCollapsed && <p className="text-xl font-bold">Dashboard</p>}
      </div>

      {/* Dashboard */}
      <div
        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 transition-all duration-300 p-2 rounded-md mb-4 cursor-pointer"
        aria-label="Dashboard"
      >
        <MdOutlineScreenshotMonitor className="w-5 h-5" />
        {!isCollapsed && <p className="text-sm font-semibold">Dashboard</p>}
      </div>

      {/* Grievance Section */}
      <div className="mb-2">
        <div
          className="flex gap-2 items-center cursor-pointer text-sm hover:text-blue-500 transition duration-200"
          onClick={toggleDropdownGrievance}
          aria-expanded={isDropdownOpenGrievance}
          aria-controls="grievance-dropdown"
          aria-label="Grievance Apps"
        >
          <BsBoxSeam className="w-5 h-5" />
          {!isCollapsed && <span>Grievance Management</span>}
          {!isCollapsed && (
            <div className="ml-auto">
              {isDropdownOpenGrievance ? (
                <IoIosArrowUp size={15} />
              ) : (
                <IoIosArrowDown size={15} />
              )}
            </div>
          )}
        </div>
        <ul
          id="grievance-dropdown"
          className={`pl-6 mt-1 space-y-1 overflow-hidden transition-max-height duration-500 ease-in-out ${
            isDropdownOpenGrievance ? "max-h-screen" : "max-h-0"
          }`}
        >
          {[
            { name: "Submission", link: "/submission" }, // Adjusted to use Link
            { name: "Tracking", link: "/tracking" },
            { name: "Investigation & Solution", link: "/investigation" },
            { name: "Feedback & Satisfaction", link: "/feedback" },
          ].map((item) => (
            <li key={item.name}>
              <Link
                to={item.link}
                className={`text-sm flex justify-between py-1 cursor-pointer hover:text-blue-500 transition ${
                  isCollapsed ? "hidden" : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Employee Engagement Section */}
      <div className="mb-2">
        <div
          className="flex gap-2 items-center cursor-pointer text-sm hover:text-blue-500 transition duration-200"
          onClick={toggleDropdownEngagement}
          aria-expanded={isDropdownOpenEngagement}
          aria-controls="engagement-dropdown"
          aria-label="Engagement Apps"
        >
          <BsBoxSeam className="w-5 h-5" />
          {!isCollapsed && <span>Employee Engagement</span>}
          {!isCollapsed && (
            <div className="ml-auto">
              {isDropdownOpenEngagement ? (
                <IoIosArrowUp size={15} />
              ) : (
                <IoIosArrowDown size={15} />
              )}
            </div>
          )}
        </div>
        <ul
          id="engagement-dropdown"
          className={`pl-6 mt-1 space-y-1 overflow-hidden transition-max-height duration-500 ease-in-out ${
            isDropdownOpenEngagement ? "max-h-screen" : "max-h-0"
          }`}
        >
          {[
            { name: "Submission", link: "/engagement-submission" },
            { name: "Payable (Finance)", link: "/payable" },
            { name: "Case Management", link: "/case-management" },
            { name: "Investigation & Solution", link: "/investigation" },
            { name: "Feedback & Satisfaction", link: "/feedback" },
          ].map((item) => (
            <li key={item.name}>
              <Link
                to={item.link}
                className={`text-sm flex justify-between py-1 cursor-pointer hover:text-blue-500 transition ${
                  isCollapsed ? "hidden" : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Employee Communication Section */}
      <div className="mb-2">
        <div
          className="flex gap-2 items-center cursor-pointer text-sm hover:text-blue-500 transition duration-200"
          onClick={toggleDropdownCommunication}
          aria-expanded={isDropdownOpenCommunication}
          aria-controls="communication-dropdown"
          aria-label="Communication Apps"
        >
          <BsBoxSeam className="w-5 h-5" />
          {!isCollapsed && <span>Employee Communication</span>}
          {!isCollapsed && (
            <div className="ml-auto">
              {isDropdownOpenCommunication ? (
                <IoIosArrowUp size={15} />
              ) : (
                <IoIosArrowDown size={15} />
              )}
            </div>
          )}
        </div>
        <ul
          id="communication-dropdown"
          className={`pl-6 mt-1 space-y-1 overflow-hidden transition-max-height duration-500 ease-in-out ${
            isDropdownOpenCommunication ? "max-h-screen" : "max-h-0"
          }`}
        >
          {[
            { name: "Communication Portal", link: "/communication-portal" },
            { name: "Feedback Channels", link: "/feedback-channels" },
          ].map((item) => (
            <li key={item.name}>
              <Link
                to={item.link}
                className={`text-sm flex justify-between py-1 cursor-pointer hover:text-blue-500 transition ${
                  isCollapsed ? "hidden" : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Analytics Section */}
      <div className="mb-2">
        <div
          className="flex gap-2 items-center cursor-pointer text-sm hover:text-blue-500 transition duration-200"
          onClick={toggleDropdownAnalytics}
          aria-expanded={isDropdownOpenAnalytics}
          aria-controls="analytics-dropdown"
          aria-label="Analytics Apps"
        >
          <BsBoxSeam className="w-5 h-5" />
          {!isCollapsed && <span>Analytics</span>}
          {!isCollapsed && (
            <div className="ml-auto">
              {isDropdownOpenAnalytics ? (
                <IoIosArrowUp size={15} />
              ) : (
                <IoIosArrowDown size={15} />
              )}
            </div>
          )}
        </div>
        <ul
          id="analytics-dropdown"
          className={`pl-6 mt-1 space-y-1 overflow-hidden transition-max-height duration-500 ease-in-out ${
            isDropdownOpenAnalytics ? "max-h-screen" : "max-h-0"
          }`}
        >
          {[
            { name: "Workforce Analytics", link: "/dashboard" },
            { name: "Engagement Analytics", link: "/engagement-analytics" },
          ].map((item) => (
            <li key={item.name}>
              <Link
                to={item.link}
                className={`text-sm flex justify-between py-1 cursor-pointer hover:text-blue-500 transition ${
                  isCollapsed ? "hidden" : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Other Sections */}
      <div className="flex gap-2 items-center cursor-pointer text-sm hover:text-blue-500 transition duration-200">
        <FaWpforms className="w-5 h-5" />
        {!isCollapsed && <span>Forms</span>}
      </div>
      <div className="flex gap-2 items-center cursor-pointer text-sm hover:text-blue-500 transition duration-200">
        <HiRefresh className="w-5 h-5" />
        {!isCollapsed && <span>Refresh</span>}
      </div>
    </div>
  );
};

export default Sidebar;
