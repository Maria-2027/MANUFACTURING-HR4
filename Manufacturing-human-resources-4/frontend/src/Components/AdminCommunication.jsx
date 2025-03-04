import React, { useState, useEffect } from "react";
import { FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt, FaSun, FaMoon, FaBullhorn } from "react-icons/fa";
import layout from "./Assets/layout.jpg";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminCommunication = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Communication Hub");
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get("http://localhost:5173/admin/hr4-announcement", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setAnnouncements([]);
      }
    };

    fetchAnnouncements();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const themeClasses = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const sidebarClasses = darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const buttonHoverClasses = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";

  return (
    <div className={`flex h-screen ${themeClasses}`}>
      {/* Sidebar */}
      <aside className={`w-72 shadow-lg p-6 flex flex-col relative h-screen overflow-y-auto ${sidebarClasses}`}>
        <div className="flex justify-center mb-6">
          <img src={layout} alt="JJM Logo" className="w-32 h-32 rounded-full" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-8">JJM Admin Portal</h2>

        {/* Sidebar Links */}
        <nav className="flex-grow">
          <ul className="space-y-4">
            {[
              { title: "Employee Grievances", icon: <FaExclamationCircle className="text-lg" />, link: "/admin-grievance" },
              { title: "Employee Suggestions", icon: <FaRegCommentDots className="text-lg" />, link: "/admin-employee-suggestion" },
              { title: "Communication Hub", icon: <FaEnvelope className="text-lg" />, link: "/admin-communication" },
              { title: "Workforce Analytics", icon: <FaChartBar className="text-lg" />, link: "/admin-workflow" },
            ].map((item, index) => (
              <li
                key={index}
                className={`flex items-center space-x-3 text-md font-semibold p-3 rounded-md cursor-pointer transition duration-200 ${
                  activeTab === item.title ? "bg-blue-200 text-blue-600" : buttonHoverClasses
                }`}
                onClick={() => setActiveTab(item.title)}
              >
                <Link to={item.link} className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <button
            onClick={() => console.log("Logged out")}
            className={`flex items-center justify-center space-x-4 text-lg font-semibold p-3 rounded-md cursor-pointer transition duration-200 ${buttonHoverClasses} w-full`}
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Communication Hub</h1>

        {/* Announcements Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold flex items-center mb-4">
            <FaBullhorn className="mr-2 text-yellow-500" /> Announcements
          </h2>
          {announcements.length > 0 ? (
            <ul className="space-y-3">
              {announcements.map((announcement, index) => (
                <li key={index} className="p-3 border rounded-md shadow-sm hover:bg-gray-100">
                  <h3 className="font-semibold">{announcement.title}</h3>
                  <p className="text-sm text-gray-600">{announcement.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No announcements available.</p>
          )}
        </div>
      </main>

      {/* Dark Mode Toggle Button */}
      <div className="absolute top-5 right-5">
        <button
          onClick={toggleDarkMode}
          className="bg-gray-200 p-2 rounded-full shadow-lg transition duration-200 hover:bg-gray-300"
        >
          {darkMode ? <FaSun className="text-yellow-500 text-xl" /> : <FaMoon className="text-gray-800 text-xl" />}
        </button>
      </div>
    </div>
  );
};

export default AdminCommunication;
