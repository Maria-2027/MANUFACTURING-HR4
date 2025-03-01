import React, { useState } from "react";
import { FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import layout from "./Assets/layout.jpg";  
import { Link } from "react-router-dom";  

const AdminWorkflow = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Workforce Analytics");
  const [activeButton, setActiveButton] = useState(""); // Track active button

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const themeClasses = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const sidebarClasses = darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const buttonHoverClasses = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const buttonActiveClasses = darkMode ? "bg-blue-600 text-white" : "bg-blue-200 text-blue-600"; // Active button styles

  // Sample employee data for the table
  const employees = [
    { id: 1, name: "John Doe", position: "Software Engineer", department: "IT", hireDate: "2020-02-15" },
    { id: 2, name: "Jane Smith", position: "HR Manager", department: "Human Resources", hireDate: "2018-06-12" },
    { id: 3, name: "Mark Johnson", position: "Operations Head", department: "Operations", hireDate: "2017-11-05" },
    { id: 4, name: "Emily Davis", position: "Marketing Lead", department: "Marketing", hireDate: "2019-01-09" },
  ];

  // Sample learning and development data
  const learningData = [
    { id: 1, title: "Leadership Training", description: "Enhance leadership skills for senior management", progress: 80 },
    { id: 2, title: "Project Management Fundamentals", description: "Basic skills for managing teams and projects", progress: 45 },
    { id: 3, title: "JavaScript for Beginners", description: "Learn the fundamentals of JavaScript programming", progress: 20 },
    { id: 4, title: "Advanced Marketing Strategies", description: "Learn advanced techniques for marketing", progress: 60 },
  ];

  return (
    <div className={`flex h-screen ${themeClasses}`}>
      {/* Sidebar */}
      <aside className={`w-72 shadow-lg p-6 flex flex-col relative h-screen overflow-y-auto ${sidebarClasses}`}>
        {/* Logo Section */}
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
              { title: "Workforce Analytics", icon: <FaChartBar className="text-lg" />, link: "/admin-workforce" },
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
      <div className="flex-grow flex flex-col items-center justify-center space-y-8">
        {/* New Buttons */}
        <button
          onClick={() => setActiveButton("Employee Records")}
          className={`p-4 rounded-lg shadow-md transition duration-200 ${activeButton === "Employee Records" ? buttonActiveClasses : "bg-gray-500 text-white"}`}
        >
          Employee Records
        </button>

        <button
          onClick={() => setActiveButton("Learning and Development")}
          className={`p-4 rounded-lg shadow-md transition duration-200 ${activeButton === "Learning and Development" ? buttonActiveClasses : "bg-gray-500 text-white"}`}
        >
          Learning and Development
        </button>

        {/* Conditionally Render Active Content */}
        {activeButton === "Employee Records" && (
          <div className="w-full bg-gray-200 p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Employee Records</h3>
            <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Employee ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Position</th>
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-left">Hire Date</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b">
                    <td className="px-4 py-2">{employee.id}</td>
                    <td className="px-4 py-2">{employee.name}</td>
                    <td className="px-4 py-2">{employee.position}</td>
                    <td className="px-4 py-2">{employee.department}</td>
                    <td className="px-4 py-2">{employee.hireDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeButton === "Learning and Development" && (
          <div className="w-full bg-gray-200 p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Learning and Development Content</h3>
            <ul>
              {learningData.map((course) => (
                <li key={course.id} className="flex justify-between p-4 border-b">
                  <span className="font-semibold">{course.title}</span>
                  <div className="flex items-center space-x-4">
                    <span>{course.progress}% Completed</span>
                    <div className="w-16 bg-gray-300 rounded-full">
                      <div
                        className="bg-blue-500 text-xs text-center text-white rounded-full"
                        style={{ width: `${course.progress}%` }}
                      >
                        &nbsp;
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Dark Mode Toggle Button (Positioned at top-right) */}
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
    </div>
  );
};

export default AdminWorkflow;
