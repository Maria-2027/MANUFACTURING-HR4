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
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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

  const handleTopEmployee = () => {
    try {
      setActiveButton("Top Employee");
      navigate('/admin-top-employee', { replace: true });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const calculateMetrics = (employee) => {
    // Convert values to numbers and provide defaults if undefined
    const totalHours = parseFloat(employee.total_hours) || 0;
    const overtimeHours = parseFloat(employee.overtime_hours) || 0;
    const minutesLate = parseFloat(employee.minutes_late) || 0;

    // Calculate with validated numbers
    const attendanceScore = Math.min(((totalHours / 8) * 100), 100);
    const punctualityScore = Math.max(100 - (minutesLate * 2), 0);
    const engagementScore = Math.min(((overtimeHours + 8) / 10) * 100, 100);

    return {
      attendance: attendanceScore.toFixed(1),
      punctuality: punctualityScore.toFixed(1),
      grievances: 0,
      engagement: engagementScore.toFixed(1)
    };
  };

  const handleRowClick = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
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
            <button
              onClick={handleTopEmployee}
              className={buttonClasses(activeButton === "Top Employee")}
            >
              Top Employee
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
                                <th className="px-4 py-2 text-left">Full Name</th>
                                <th className="px-4 py-2 text-left">Total Hours</th>
                                <th className="px-4 py-2 text-left">Overtime Hours</th>
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-left">Approved At</th>
                                <th className="px-4 py-2 text-left">Tardy Minutes</th>
                              </tr>
                            </thead>
                            <tbody>
                            {currentRows.map((employee, index) => (
                                <tr 
                                  key={employee.id || `employee-${index}`} 
                                  className="border-b hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleRowClick(employee)}
                                >
                                <td className="px-4 py-2">{employee.employee_id}</td>
                                <td className="px-4 py-2">{employee.employee_fullname}</td>
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

        {showModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Employee Metrics</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <h4 className="text-xl mb-4">
                Employee: {selectedEmployee.employee_fullname}
              </h4>
              
              <div className="space-y-4">
                <h5 className="text-lg font-semibold">📊 Score Breakdown:</h5>
                {(() => {
                  const metrics = calculateMetrics(selectedEmployee);
                  return (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Attendance:</span>
                        <span className="font-semibold">{metrics.attendance}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Punctuality:</span>
                        <span className="font-semibold">{metrics.punctuality}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Grievances:</span>
                        <span className="font-semibold">{metrics.grievances}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Engagement Score:</span>
                        <span className="font-semibold">{metrics.engagement}%</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminWorkflow;
