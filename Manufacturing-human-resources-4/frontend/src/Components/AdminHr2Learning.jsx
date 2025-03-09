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
  const [activeButton, setActiveButton] = useState("");
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
    if (activeButton === "Learning and Development") {
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
    }
  }, [activeButton]);

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

  const handleLearningDevelopment = () => {
    setActiveButton("Learning and Development");
    navigate('/admin-hr2-learning');
  };

  const buttonClasses = (isActive) => `
    p-4 rounded-lg shadow-md transition duration-200
    ${isActive
      ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-600')
      : 'bg-gray-500 text-white hover:bg-gray-600'}
  `;

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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-4 space-y-2">
            {[ 
              { title: "Employee Grievances", icon: <FaExclamationCircle className="text-xl" />, link: "/admin-grievance" },
              { title: "Employee Suggestions", icon: <FaRegCommentDots className="text-xl" />, link: "/admin-employee-suggestion" },
              { title: "Communication Hub", icon: <FaEnvelope className="text-xl" />, link: "/admin-communication" },
              { title: "Workforce Analytics", icon: <FaChartBar className="text-xl" />, link: "/admin-workflow" },
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

        {/* Footer */}
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

      {/* Main Content */}
      <main className="flex-1 ml-72 overflow-x-hidden overflow-y-auto pt-8">
        <div className="px-8 space-y-4">
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
              <div className="flex-1 bg-gray-200 p-8 rounded-lg shadow-lg">
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
        </div>
      </main>
    </div>
  );
};

export default AdminHr2Learning;
