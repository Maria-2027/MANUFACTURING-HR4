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
  const [activeButton, setActiveButton] = useState("Employee Records"); // Changed initial state
  const [employees, setEmployees] = useState([]); // Ensure it's initialized as an empty array
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

        fetch(EMPLOYEERECORDS, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add any required authentication headers here
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched data:', data); // Add this for debugging
                const employeeArray = Array.isArray(data) ? data : (data.data || []);
                setEmployees(employeeArray);
                setError(null);
            })
            .catch((error) => {
                console.error("Error fetching employee records:", error);
                setError(`Error fetching data: ${error.message}`);
                setEmployees([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }
  }, [activeButton]);

  // Add new useEffect for initial data fetch
  useEffect(() => {
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
            // Ensure data is an array
            const employeeArray = Array.isArray(data) ? data : [];
            setEmployees(employeeArray);
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
  }, []); // Empty dependency array means this runs once on mount

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

  const buttonHoverClasses = darkMode 
    ? "hover:bg-gray-700" 
    : "hover:bg-gray-100";

  const handleLearningDevelopment = () => {
    setActiveButton("Learning and Development");
    navigate('/admin-hr2-learning');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
            <aside className={`w-72 shadow-lg p-6 flex flex-col relative h-screen overflow-y-auto ${sidebarClasses}`}>
              <div className="flex justify-center mb-6">
                <img src={layout} alt="JJM Logo" className="w-32 h-32 rounded-full" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-8">JJM Admin Portal</h2>
      
              <nav className="flex-grow">
                <ul className="space-y-4">
                  {[{ title: "Employee Grievances", icon: <FaExclamationCircle className="text-lg" />, link: "/admin-grievance" },
                    { title: "Employee Suggestions", icon: <FaRegCommentDots className="text-lg" />, link: "/admin-employee-suggestion" },
                    { title: "Communication Hub", icon: <FaEnvelope className="text-lg" />, link: "/admin-communication" },
                    { title: "Workforce Analytics", icon: <FaChartBar className="text-lg" />, link: "/admin-workflow" }]
                    .map((item, index) => (
                      <li key={index} className={`p-3 rounded-md transition duration-200 ${activeTab === item.title ? "bg-blue-200 text-blue-600" : buttonHoverClasses}`}>
                        <Link to={item.link} className="flex items-center space-x-3" onClick={() => setActiveTab(item.title)}>
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </nav>
      
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
      

      {/* Main Content - with offset and scrolling */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="p-4">
          <div className="flex space-x-4 mb-4"> 
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

          <div className="flex w-full">
            {activeButton === "Employee Records" && (
              <div className="w-full bg-gray-200 p-4 rounded-lg shadow-lg">
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
                                <tr key={employee.id || `employee-${index}`} className="border-b"><td className="px-4 py-2">{employee.employee_id}</td><td className="px-4 py-2">{employee.employee_firstname}</td><td className="px-4 py-2">{employee.employee_lastname}</td><td className="px-4 py-2">{employee.total_hours}</td><td className="px-4 py-2">{employee.overtime_hours}</td><td className="px-4 py-2">{employee.status}</td><td className="px-4 py-2">{employee.approved_at}</td><td className="px-4 py-2">{employee.minutes_late}</td></tr>
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