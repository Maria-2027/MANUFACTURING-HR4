import React, { useState, useEffect } from "react";
import { FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt, FaSun, FaMoon, FaRegClipboard } from "react-icons/fa";
import { SyncLoader } from "react-spinners";
import layout from "./Assets/layout.jpg";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const ADMINGRIEVANCE = process.env.NODE_ENV === "development"
    ? "http://localhost:7688/EmComplaint"
    : "https://backend-hr4.jjm-manufacturing.com/Emcomplaint";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [activeTab, setActiveTab] = useState();
  const [darkMode, setDarkMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [analytics, setAnalytics] = useState({
    pending: 0,
    inReview: 0,
    resolved: 0,
    escalated: 0,
    averageResolutionTime: 0,
    commonComplaints: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Get user data from localStorage
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setUserRole(userData.role);
    }

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

  useEffect(() => {
    const calculateAnalytics = () => {
      const stats = {
        pending: 0,
        inReview: 0,
        resolved: 0,
        escalated: 0,
        resolutionTimes: [],
        complaintTypes: {}
      };

      // Calculate average resolution time
      const avgResolutionTime = stats.resolutionTimes.length 
        ? stats.resolutionTimes.reduce((a, b) => a + b, 0) / stats.resolutionTimes.length 
        : 0;

      // Sort common complaints
      const sortedComplaints = Object.entries(stats.complaintTypes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

      setAnalytics({
        ...stats,
        averageResolutionTime: Math.round(avgResolutionTime * 10) / 10,
        commonComplaints: sortedComplaints
      });
    };

    calculateAnalytics();
  }, []);

  const handleLogout = () => {
    try {
      // Clear all items from localStorage
      localStorage.clear();
      
      // Verify localStorage is empty
      if (localStorage.length === 0) {
        navigate('/', { replace: true });
      } else {
        console.error('Failed to clear localStorage');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
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
  const greetingTextClass = darkMode ? "text-white" : "text-gray-900";

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100"
      >
        <motion.div 
          className="flex flex-col items-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ 
            repeat: Infinity,
            duration: 2.5,
            ease: "easeInOut"
          }}
        >
          <SyncLoader
            cssOverride={{}}
            loading
            color="#000000"
            margin={12}
            size={15}
            speedMultiplier={0.5}
          />
        </motion.div>
      </motion.div>
    );
  }

  const renderAnalytics = () => (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Status Overview */}
      <motion.div
        className={`p-6 rounded-lg shadow-lg ${cardClasses}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-semibold mb-4">Grievance Status Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-yellow-100 rounded-lg">
            <p className="text-lg font-bold">{analytics.pending}</p>
            <p className="text-sm">Pending</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg">
            <p className="text-lg font-bold">{analytics.inReview}</p>
            <p className="text-sm">In Review</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg">
            <p className="text-lg font-bold">{analytics.resolved}</p>
            <p className="text-sm">Resolved</p>
          </div>
          <div className="p-4 bg-red-100 rounded-lg">
            <p className="text-lg font-bold">{analytics.escalated}</p>
            <p className="text-sm">Escalated</p>
          </div>
        </div>
      </motion.div>

      {/* Resolution Time */}
      <motion.div
        className={`p-6 rounded-lg shadow-lg ${cardClasses}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-semibold mb-4">Resolution Metrics</h3>
        <div className="text-center py-4">
          <p className="text-3xl font-bold text-blue-600">
            {analytics.averageResolutionTime}
          </p>
          <p className="text-sm text-gray-600">Average Days to Resolve</p>
        </div>
      </motion.div>

      {/* Common Complaints Chart */}
      <motion.div
        className={`p-6 rounded-lg shadow-lg ${cardClasses} md:col-span-2`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-semibold mb-4">Most Common Complaints</h3>
        <div className="h-64">
          <Bar
            data={{
              labels: analytics.commonComplaints.map(([type]) => type),
              datasets: [{
                label: 'Number of Complaints',
                data: analytics.commonComplaints.map(([, count]) => count),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }}
          />
        </div>
      </motion.div>
    </div>
  );

  return (
    <motion.div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`fixed top-0 left-0 h-screen w-72 shadow-lg ${sidebarClasses}`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo Section - Fixed */}
          <div className="flex-shrink-0">
            <Link to="/admin-dashboard">
              <img src={layout} alt="JJM Logo" className="w-32 h-32 mx-auto rounded-full shadow-md" />
            </Link>
            <h2 className="text-2xl font-bold text-center mb-6">JJM Admin Portal</h2>
          </div>

          {/* Navigation Links - Scrollable if needed */}
          <nav className="flex-grow overflow-y-auto">
            <ul className="space-y-5">
              <AnimatePresence>
                {[
                  {
                    key: "grievances",
                    to: "/admin-grievance",
                    icon: <FaExclamationCircle className="text-lg" />,
                    text: "Employee Grievances"
                  },
                  {
                    key: "suggestions",
                    to: "/admin-employee-suggestion",
                    icon: <FaRegCommentDots className="text-lg" />,
                    text: "Employee Suggestions"
                  },
                  {
                    key: "communication",
                    to: "/admin-communication",
                    icon: <FaEnvelope className="text-lg" />,
                    text: "Communication Hub"
                  },
                  {
                    key: "analytics",
                    to: "/admin-workflow",
                    icon: <FaChartBar className="text-lg" />,
                    text: "Workforce Analytics"
                  },
                  {
                    key: "auditlogs",
                    to: "/admin-audit-logs",
                    icon: <FaRegClipboard className="text-lg" />,
                    text: "Audit Logs"
                  }
                ].map((item, index) => (
                  <motion.li
                    key={item.key}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-3 rounded-md transition duration-200 ${
                      activeTab === item.text ? "bg-blue-200 text-blue-600" : buttonHoverClasses
                    }`}
                  >
                    <Link
                      to={item.to}
                      className="flex items-center space-x-3"
                      onClick={() => setActiveTab(item.text)}
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </Link>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </nav>

          {/* Logout Button - Fixed at bottom */}
          <div className="flex-shrink-0 mt-auto pt-4">
            <button
              onClick={handleLogout}
              className={`flex items-center justify-center space-x-4 text-lg font-semibold p-3 rounded-md cursor-pointer transition duration-200 ${buttonHoverClasses} w-full`}
            >
              <FaSignOutAlt className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content - Scrollable with margin for sidebar */}
      <motion.main
        className="ml-72 flex-1 min-h-screen p-10 overflow-y-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Dark Mode Toggle Button */}
        <motion.div 
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.3, ease: "easeInOut" }
          }}
          className="absolute top-5 right-5"
        >
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
        </motion.div>

        {/* Enhanced Greeting Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8,
            delay: 0.5,
            type: "spring",
            stiffness: 50,
            damping: 15
          }}
          className={`mt-8 p-8 rounded-xl shadow-lg ${cardClasses} backdrop-blur-sm bg-opacity-90`}
        >
          <h1 className={`text-4xl font-extrabold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>
            {greeting}, {userRole}
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
        </motion.div>

        {/* Enhanced Admin Cards */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
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
            <motion.div
              key={index}
              whileHover={{ 
                scale: 1.02,
                transition: { 
                  duration: 0.4,
                  ease: "easeInOut"
                }
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                delay: index * 0.2 + 0.8,
                ease: "easeOut"
              }}
              className={`p-6 rounded-lg shadow-lg flex flex-col items-center ${cardClasses}`}
            >
              <div className="text-4xl text-blue-600">{item.icon}</div>
              <h3 className="mt-4 text-xl font-semibold">
                <Link to={item.link} className="hover:text-blue-600">{item.title}</Link>
              </h3>
              <p className="text-center">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Analytics Section */}
        {renderAnalytics()}

      </motion.main>
    </motion.div>
  );
};

export default AdminDashboard;
