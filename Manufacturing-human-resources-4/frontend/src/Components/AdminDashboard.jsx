import React, { useState, useEffect } from "react";
import { FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import layout from "./Assets/layout.jpg";  // Logo image
import { Link, useNavigate } from "react-router-dom";  // Add useNavigate

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [activeTab, setActiveTab] = useState();
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState("John Doe"); // Fixed initialization with a default value
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString());
      const hours = now.getHours();
      if (hours < 12) {
        setGreeting("Good Morning");
      } else if (hours < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // Define classes for dark and light modes
  const themeClasses = darkMode
    ? "bg-gray-900 text-white"
    : "bg-gradient-to-r from-gray-50 to-gray-200 text-gray-900";
  const sidebarClasses = darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const buttonHoverClasses = darkMode
    ? "hover:bg-gray-700 text-white"
    : "hover:bg-gray-100 text-gray-800";
  const cardClasses = darkMode
    ? "bg-gray-800 text-white hover:bg-gray-700"
    : "bg-white text-gray-900 hover:bg-gray-100";
  const greetingTextClass = darkMode ? "text-white" : "text-gray-900"; // Explicitly set greeting text color

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-gray-800 mb-4"></div>
          <p className="text-gray-800 text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${themeClasses}`}>
      {/* Sidebar */}
      <aside className={`w-72 shadow-lg p-6 flex flex-col relative ${sidebarClasses}`}>
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <Link to="/admin-dashboard">
            <img src={layout} alt="JJM Logo" className="w-32 h-32 rounded-full shadow-md" />
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">JJM Admin Portal</h2>

        {/* Sidebar Links */}
        <nav className="flex-grow">
          <ul className="space-y-5">
            <li
              className={`p-3 rounded-md transition duration-200 ${activeTab === "Employee Grievances" ? "bg-blue-200 text-blue-600" : buttonHoverClasses}`}
            >
              <Link
                to="/admin-grievance"
                className="flex items-center space-x-3"
                onClick={() => setActiveTab("Employee Grievances")}
              >
                <FaExclamationCircle className="text-lg" />
                <span>Employee Grievances</span>
              </Link>
            </li>

            <li
              className={`p-3 rounded-md transition duration-200 ${activeTab === "Employee Suggestions" ? "bg-blue-200 text-blue-600" : buttonHoverClasses}`}
            >
              <Link
                to="/admin-employee-suggestion"
                className="flex items-center space-x-3"
                onClick={() => setActiveTab("Employee Suggestions")}
              >
                <FaRegCommentDots className="text-lg" />
                <span>Employee Suggestions</span>
              </Link>
            </li>

            <li
              className={`p-3 rounded-md transition duration-200 ${activeTab === "Communication Hub" ? "bg-blue-200 text-blue-600" : buttonHoverClasses}`}
            >
              <Link
                to="/admin-communication"
                className="flex items-center space-x-3"
                onClick={() => setActiveTab("Communication Hub")}
              >
                <FaEnvelope className="text-lg" />
                <span>Communication Hub</span>
              </Link>
            </li>

            <li
              className={`p-3 rounded-md transition duration-200 ${activeTab === "Workforce Analytics" ? "bg-blue-200 text-blue-600" : buttonHoverClasses}`}
            >
              <Link
                to="/admin-workflow"
                className="flex items-center space-x-3"
                onClick={() => setActiveTab("Workforce Analytics")}
              >
                <FaChartBar className="text-lg" />
                <span>Workforce Analytics</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center space-x-4 text-lg font-semibold p-3 rounded-md cursor-pointer transition duration-200 ${buttonHoverClasses} w-full`}
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {/* Dark Mode Toggle Button */}
        <div className="absolute top-5 right-5">
          <button
            onClick={toggleDarkMode}
            className="bg-gray-200 p-2 rounded-full shadow-lg transition duration-200 hover:bg-gray-300"
          >
            {darkMode ? (
              <FaSun className="text-yellow-500 text-xl" />
            ) : (
              <FaMoon className="text-gray-800 text-xl" />
            )}
          </button>
        </div>

        {/* Greeting Section */}
        <div className={`p-6 rounded-xl shadow-md text-center transition hover:shadow-2xl duration-300 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>
          <h1 className={`text-4xl font-extrabold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>
            {greeting}, Admin
          </h1>
          <p className={`text-lg mt-2 ${
            darkMode ? "text-white" : "text-gray-700"
          }`}>
            Manage employee data, monitor grievances, and oversee company performance.
          </p>
          <p className={`mt-4 font-semibold ${
            darkMode ? "text-white" : "text-gray-700"
          }`}>
            Current Time: {currentTime}
          </p>
        </div>

        {/* Admin Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[{
            icon: <FaExclamationCircle />,
            title: "Employee Grievances",
            desc: "View and manage employee grievances and complaints.",
            link: "/admin-grievance"
          }, {
            icon: <FaRegCommentDots />,
            title: "Employee Suggestions",
            desc: "Review suggestions from employees to improve operations.",
            link: "/admin-employee-suggestion"
          }, {
            icon: <FaEnvelope />,
            title: "Communication Hub",
            desc: "Manage internal communication and messages.",
            link: "/admin-communication"
          }, {
            icon: <FaChartBar />,
            title: "Workforce Analytics",
            desc: "Analyze employee performance and trends.",
            link: "/admin-workforce-analytics"
          }].map((item, index) => (
            <div key={index} className={`p-6 rounded-lg shadow-lg flex flex-col items-center transform hover:scale-105 transition duration-300 ease-in-out ${cardClasses}`}>
              <div className="text-4xl text-blue-600">{item.icon}</div>
              <h3 className="mt-4 text-xl font-semibold">
                <Link to={item.link} className="hover:text-blue-600">{item.title}</Link>
              </h3>
              <p className="text-center">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
