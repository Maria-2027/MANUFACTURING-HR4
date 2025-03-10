import React, { useState, useEffect } from "react";
import { FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import layout from "./Assets/layout.jpg";

const EMPLOYEERECORDS = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/integration/get-time-tracking"
  : "https://backend-hr4.jjm-manufacturing.com/api/integration/get-time-tracking";

const LEARNINGRECORDS = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/integration/trainings"
  : "https://backend-hr4.jjm-manufacturing.com/api/integration/trainings";

const AdminHr2Learning = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [activeButton, setActiveButton] = useState("Learning and Development"); // Changed default
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("Workforce Analytics");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [learningData, setLearningData] = useState([]);
  const [learningLoading, setLearningLoading] = useState(false);
  const [learningError, setLearningError] = useState(null);
  const [learningCurrentPage, setLearningCurrentPage] = useState(1);
  const learningRowsPerPage = 5;

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
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setEmployees(data);
          setError(null);
        })
        .catch((error) => {
          setError(`Error: ${error.message}`);
          setEmployees([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [activeButton]);

  useEffect(() => {
    // Load learning data immediately without checking activeButton
    setLearningLoading(true);
    setLearningError(null);

    axios.get(LEARNINGRECORDS)
      .then((response) => {
        const trainingArray = Array.isArray(response.data.data) ? response.data.data : [];
        setLearningData(trainingArray);
        setLearningError(null);
      })
      .catch((error) => {
        setLearningError(`Error: ${error.response?.data?.message || error.message}`);
        setLearningData([]);
      })
      .finally(() => {
        setLearningLoading(false);
      });
  }, []); // Remove activeButton dependency

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = employees.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(employees.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const learningIndexOfLastRow = learningCurrentPage * learningRowsPerPage;
  const learningIndexOfFirstRow = learningIndexOfLastRow - learningRowsPerPage;
  const currentLearningRows = learningData.slice(learningIndexOfFirstRow, learningIndexOfLastRow);
  const learningTotalPages = Math.ceil(learningData.length / learningRowsPerPage);

  const handleLearningPageChange = (pageNumber) => {
    setLearningCurrentPage(pageNumber);
  };

  const buttonHoverClasses = darkMode 
    ? "hover:bg-gray-700 hover:text-white" 
    : "hover:bg-gray-100 hover:text-gray-900";

  const sidebarClasses = darkMode 
    ? "bg-gray-800 text-white border-r border-gray-700" 
    : "bg-white text-gray-900 border-r border-gray-200";

  const navItemClasses = (isActive) => `
    flex items-center space-x-3 px-4 py-3 rounded-lg
    transition-all duration-200 ease-in-out
    ${isActive 
      ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600') 
      : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}
  `;

  const handleEmployeeRecords = () => {
    setActiveButton("Employee Records");
    navigate('/admin-workflow');
  };

  const handleLearningDevelopment = () => {
    setActiveButton("Learning and Development");
    navigate('/admin-hr2-learning');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const buttonClasses = (isActive) => `
    p-4 rounded-lg shadow-md transition duration-200
    ${isActive
      ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-600')
      : 'bg-gray-500 text-white hover:bg-gray-600'}
  `;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className={`w-72 shadow-lg p-6 flex flex-col fixed h-screen ${sidebarClasses}`}>
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

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <button
              onClick={handleEmployeeRecords}
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

          {activeButton === "Employee Records" && (
            <div className="bg-gray-200 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Employee Records</h3>
              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading && !error && (
                <table className="min-w-full bg-white rounded-lg shadow-md">
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
                      <tr key={employee.id || index} className="border-b">
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

          {activeButton === "Learning and Development" && (
            <div className="bg-gray-200 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Learning and Development Records</h3>
              {learningLoading && <p>Loading...</p>}
              {learningError && <p className="text-red-500">{learningError}</p>}
              {!learningLoading && !learningError && (
                <>
                  <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Duration</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Cost</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Training Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Audience</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Updated</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Completion</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentLearningRows.map((training, index) => (
                          <tr key={training._id || `training-${index}`} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 truncate max-w-[100px]">
                              {training._id}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 truncate max-w-[160px]">
                              {training.trainingType}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {training.timeDuration}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {training.cost}
                            </td>
                            <td className="px-4 py-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap
                                ${training.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                training.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'}`}>
                                {training.status}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {new Date(training.trainingDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 truncate max-w-[160px]">
                              {training.targetAudience}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {new Date(training.updatedAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {training.completionDate ? new Date(training.completionDate).toLocaleDateString() : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-center items-center space-x-2 mt-4">
                    <button
                      onClick={() => handleLearningPageChange(learningCurrentPage - 1)}
                      disabled={learningCurrentPage === 1}
                      className={`px-4 py-2 rounded ${
                        learningCurrentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      Previous
                    </button>
                    <span className="text-sm">
                      Page {learningCurrentPage} of {learningTotalPages}
                    </span>
                    <button
                      onClick={() => handleLearningPageChange(learningCurrentPage + 1)}
                      disabled={learningCurrentPage === learningTotalPages}
                      className={`px-4 py-2 rounded ${
                        learningCurrentPage === learningTotalPages ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminHr2Learning;
