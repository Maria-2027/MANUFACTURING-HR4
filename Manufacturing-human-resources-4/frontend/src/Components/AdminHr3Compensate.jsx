import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import layout from "./Assets/layout.jpg";
import { Link } from "react-router-dom";

const ADMINHR3 = process.env.NODE_ENV === "development"
    ? "http://localhost:7688/api/integration/get-employee-violation"
    : "https://backend-hr4.jjm-manufacturing.com/api/integration/get-employee-violation";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState();
  const [data, setData] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(ADMINHR3, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        console.log("API Response:", response.data); // Debugging line
        
        setData(Array.isArray(response.data.employeeViolations) ? response.data.employeeViolations : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Error fetching data: ' + err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  ; // Empty dependency array means this runs once on component mount

  const handleLogout = () => {
    console.log("Logged out");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 h-screen shadow-lg bg-white text-gray-900 fixed left-0">
        <div className="h-full flex flex-col p-6 overflow-y-auto">
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <Link to="/admin-dashboard">
              <img src={layout} alt="JJM Logo" className="w-32 h-32 rounded-full shadow-md" />
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">JJM Admin Portal</h2>

          {/* Sidebar Links */}
          <nav className="flex-grow mb-8">
            <ul className="space-y-5">
              <li className={`p-3 rounded-md transition duration-200 ${activeTab === "Employee Grievances" ? "bg-blue-200 text-blue-600" : "hover:bg-gray-100 text-gray-800"}`}>
                <Link
                  to="/admin-grievance"
                  className="flex items-center space-x-3"
                  onClick={() => setActiveTab("Employee Grievances")}
                >
                  <FaExclamationCircle className="text-lg" />
                  <span>Employee Grievances</span>
                </Link>
              </li>

              <li className={`p-3 rounded-md transition duration-200 ${activeTab === "Employee Suggestions" ? "bg-blue-200 text-blue-600" : "hover:bg-gray-100 text-gray-800"}`}>
                <Link
                  to="/admin-employee-suggestion"
                  className="flex items-center space-x-3"
                  onClick={() => setActiveTab("Employee Suggestions")}
                >
                  <FaRegCommentDots className="text-lg" />
                  <span>Employee Suggestions</span>
                </Link>
              </li>

              <li className={`p-3 rounded-md transition duration-200 ${activeTab === "Communication Hub" ? "bg-blue-200 text-blue-600" : "hover:bg-gray-100 text-gray-800"}`}>
                <Link
                  to="/admin-communication"
                  className="flex items-center space-x-3"
                  onClick={() => setActiveTab("Communication Hub")}
                >
                  <FaEnvelope className="text-lg" />
                  <span>Communication Hub</span>
                </Link>
              </li>

              <li className={`p-3 rounded-md transition duration-200 ${activeTab === "Workforce Analytics" ? "bg-blue-200 text-blue-600" : "hover:bg-gray-100 text-gray-800"}`}>
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
          <div className="mt-auto pb-4">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-4 text-lg font-semibold p-3 rounded-md cursor-pointer transition duration-200 hover:bg-gray-100 text-gray-800 w-full"
            >
              <FaSignOutAlt className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">
        {loading ? (
          <div className="flex justify-center items-center h-full">Loading...</div>
        ) : error ? (
          <div className="text-red-500 p-4">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-center p-4">No violations found</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">Employee Violations</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2">Employee Name</th>
                    <th className="px-4 py-2">Violation Type</th>
                    <th className="px-4 py-2">Penalty Level</th>
                    <th className="px-4 py-2">Action</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((violation) => (
                    <tr key={violation._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">
                        {violation.userId.firstName} {violation.userId.lastName}
                      </td>
                      <td className="px-4 py-2">{violation.penaltyLevel.violationType}</td>
                      <td className="px-4 py-2">{violation.penaltyLevel.penaltyLevel}</td>
                      <td className="px-4 py-2">{violation.penaltyLevel.action}</td>
                      <td className="px-4 py-2">
                        {new Date(violation.violationDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          violation.status === 'active' ? 'bg-red-100 text-red-800' : 
                          violation.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {violation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
