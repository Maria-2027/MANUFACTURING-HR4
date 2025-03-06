import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import layout from "./Assets/layout.jpg";
import { Link } from "react-router-dom";

const ADMINHR3 = process.env.NODE_ENV === "development"
    ? "http://localhost:7688/api/auth/employee-violation"
    : "https://backend-hr4.jjm-manufacturing.com/api/auth/employee-violation";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(ADMINHR3, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // If you're using token authentication
          }
        });
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Error fetching data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on component mount

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
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard Content</h1>
            {/* Add your main content here */}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
