import React, { useState, useEffect } from "react";
import { FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt, FaSun, FaMoon, FaBook } from "react-icons/fa";
import layout from "./Assets/layout.jpg";  
import { Link } from "react-router-dom";  

const EMPLOYEERECORDS = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/integration/get-time-tracking"
  : "https://backend-hr4.jjm-manufacturing.com/api/integration/get-time-tracking";

const AdminWorkflow = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeButton, setActiveButton] = useState(""); // Track active button
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("Workforce Analytics");
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null);      // Add error state

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (activeButton === "Employee Records") {
        setLoading(true);
        setError(null);

        fetch(`${EMPLOYEERECORDS}/api/integration/get-time-tracking`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                setEmployees(data);
                setError(null);
            })
            .catch((error) => {
                console.error("Error fetching employee records:", error);
                setError(`Error: ${error.message}`);
                setEmployees([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }
  }, [activeButton]);

  const themeClasses = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const sidebarClasses = darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const buttonHoverClasses = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const buttonActiveClasses = darkMode ? "bg-blue-600 text-white" : "bg-blue-200 text-blue-600";

  return (
    <div className={`flex h-screen ${themeClasses}`}>
      {/* Sidebar */}
      <aside className={`w-72 shadow-lg p-6 flex flex-col relative h-screen overflow-y-auto ${sidebarClasses}`}>
        <div className="flex justify-center mb-6">
          <img src={layout} alt="JJM Logo" className="w-32 h-32 rounded-full" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-8">JJM Admin Portal</h2>

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

      <div className="flex-grow flex flex-col items-start justify-start p-8 space-y-4">
        <div className="flex space-x-4"> 
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
        </div>

        <div className="flex space-x-8 w-full">
          {activeButton === "Employee Records" && (
            <div className="flex-1 bg-gray-200 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Employee Records</h3>
              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">Error: {error}</p>}
              {!loading && !error && (
                <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Employee ID</th>
                      <th className="px-4 py-2 text-left">First Name</th>
                      <th className="px-4 py-2 text-left">Last Name</th>
                      <th className="px-4 py-2 text-left">Total Hours</th>
                      <th className="px-4 py-2 text-left">Overtime Hours</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Approved At</th>
                      <th className="px-4 py-2 text-left">Tardy Minutes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee, index) => (
                      <tr key={employee.id || `employee-${index}`} className="border-b">
                        <td className="px-4 py-2">{employee.employee_id}</td>
                        <td className="px-4 py-2">{employee.employee_firstname}</td>
                        <td className="px-4 py-2">{employee.employee_lastname}</td>
                        <td className="px-4 py-2">{employee.total_hours}</td>
                        <td className="px-4 py-2">{employee.overtime_hours}</td>
                        <td className="px-4 py-2">{employee.status}</td>
                        <td className="px-4 py-2">{employee.approved_at}</td>
                        <td className="px-4 py-2">{employee.minutes_late}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminWorkflow;