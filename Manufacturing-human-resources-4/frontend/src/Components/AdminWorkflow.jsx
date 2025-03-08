import React, { useState, useEffect } from "react";
import { FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt, FaSun, FaMoon, FaBook } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";  // Add useNavigate
import layout from "./Assets/layout.jpg";  

const EMPLOYEERECORDS = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/integration/get-time-tracking"
  : "https://backend-hr4.jjm-manufacturing.com/api/integration/get-time-tracking";

const AdminWorkflow = () => {
  const navigate = useNavigate(); // Add this
  const [darkMode, setDarkMode] = useState(false);
  const [activeButton, setActiveButton] = useState(""); // Track active button
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("Workforce Analytics");
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null);      // Add error state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Changed from 8 to 5

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (activeButton === "Employee Records") {
        setLoading(true);
        setError(null);

        fetch(EMPLOYEERECORDS)
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

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = employees.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(employees.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const themeClasses = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const sidebarClasses = darkMode 
    ? "bg-gray-800 text-white border-r border-gray-700" 
    : "bg-white text-gray-900 border-r border-gray-200";

  const buttonClasses = (isActive) => `
    p-4 rounded-lg shadow-md transition duration-200
    ${isActive 
      ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-600')
      : 'bg-gray-500 text-white hover:bg-gray-600'}
  `;

  const navItemClasses = (isActive) => `
    flex items-center space-x-3 px-4 py-3 rounded-lg
    transition-all duration-200 ease-in-out
    ${isActive 
      ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600') 
      : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}
  `;

  const handleLearningDevelopment = () => {
    setActiveButton("Learning and Development");
    navigate('/admin-hr2-learning');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Fixed Sidebar */}
      <aside className={`fixed left-0 h-screen w-72 flex flex-col ${sidebarClasses}`}>
        {/* Logo Container */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-4">
            <img 
              src={layout} 
              alt="JJM Logo" 
              className="w-24 h-24 rounded-full shadow-lg transition-transform hover:scale-105" 
            />
          </div>
          <h2 className="text-xl font-bold text-center">JJM Admin Portal</h2>
        </div>

        {/* Navigation - with limited height and scrolling */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-4 space-y-2">
            {[ 
              { 
                title: "Employee Grievances", 
                icon: <FaExclamationCircle className="text-xl" />, 
                link: "/admin-grievance" 
              },
              { 
                title: "Employee Suggestions", 
                icon: <FaRegCommentDots className="text-xl" />, 
                link: "/admin-employee-suggestion" 
              },
              { 
                title: "Communication Hub", 
                icon: <FaEnvelope className="text-xl" />, 
                link: "/admin-communication" 
              },
              { 
                title: "Workforce Analytics", 
                icon: <FaChartBar className="text-xl" />, 
                link: "/admin-workflow" 
              },
            ].map((item) => (
              <li key={item.title}>
                <Link 
                  to={item.link} 
                  className={navItemClasses(activeTab === item.title)}
                  onClick={() => setActiveTab(item.title)}
                >
                  <span className="p-2 rounded-lg">{item.icon}</span>
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer - always visible at bottom */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-inherit">
          <button
            onClick={() => console.log("Logged out")}
            className={`
              flex items-center justify-center w-full
              px-4 py-3 rounded-lg
              transition-all duration-200 ease-in-out
              ${darkMode 
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}
            `}
          >
            <FaSignOutAlt className="text-xl mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content - with offset and scrolling */}
      <main className="flex-1 ml-72 overflow-x-hidden overflow-y-auto">
        <div className="p-8 space-y-4">
          <div className="flex space-x-4"> 
            <button
              onClick={() => setActiveButton("Employee Records")}
              className={buttonClasses(activeButton === "Employee Records")}
            >
              Employee Records
            </button>

            <button
              onClick={handleLearningDevelopment}
              className={buttonClasses(activeButton === "Learning and Development")}
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
                  <>
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                          <table className="min-w-full table-auto bg-white rounded-lg shadow-md mb-4">
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
                              {currentRows.map((employee, index) => (
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
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center items-center space-x-2 mt-4">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                      >
                        Previous
                      </button>
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminWorkflow;