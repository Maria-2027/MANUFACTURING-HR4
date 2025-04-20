import React, { useState, useEffect } from "react";
import { FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt, FaSun, FaMoon, FaRegClipboard, FaUserCircle, FaMedal } from "react-icons/fa";
import { SyncLoader } from "react-spinners";
import layout from "./Assets/layout.jpg";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';

const ADMINGRIEVANCE = process.env.NODE_ENV === "development"
    ? "http://localhost:7688/EmComplaint"
    : "https://backend-hr4.jjm-manufacturing.com/Emcomplaint";

const TOPEMPLOYEE = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/integration/top-employee"
  : "https://backend-hr4.jjm-manufacturing.com/api/integration/top-employee";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
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
  const [topEmployees, setTopEmployees] = useState({
    monthlyTopEmployee: null,
    weeklyTopEmployee: null
  });
  const [dateRanges, setDateRanges] = useState({
    monthly: { start: null, end: null },
    weekly: { start: null, end: null }
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [employeeStats, setEmployeeStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [runnersUp, setRunnersUp] = useState({
    second: null,
    third: null
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

  const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        if (error.code === 'ECONNRESET' || error.name === 'TypeError') {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
          continue;
        }
        throw error;
      }
    }
  };

  const fetchTopEmployees = async () => {
    try {
      const today = new Date();
      
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(today);
      weekEnd.setDate(weekStart.getDate() + 6);

      setDateRanges({
        monthly: { start: monthStart, end: monthEnd },
        weekly: { start: weekStart, end: weekEnd }
      });

      const formatDate = (date) => date.toISOString().split('T')[0];

      const fetchData = async (startDate, endDate) => {
        try {
          const response = await fetchWithRetry(
            `${TOPEMPLOYEE}?startDate=${startDate}&endDate=${endDate}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
              },
              timeout: 5000
            }
          );
          const data = await response.json();
          return data;
        } catch (error) {
          console.error(`Failed to fetch data: ${error.message}`);
          return null;
        }
      };

      const monthlyData = await fetchData(
        formatDate(monthStart),
        formatDate(monthEnd)
      );

      const weeklyData = await fetchData(
        formatDate(weekStart),
        formatDate(weekEnd)
      );

      const processEmployeeData = (data) => {
        if (!data || data.message) return null;

        const [firstName, ...lastNameParts] = data.employee_fullname.split(' ');
        const lastName = lastNameParts.join(' ');

        return {
          name: data.employee_fullname,
          employee_firstname: firstName,
          employee_lastname: lastName,
          position: data.position || 'N/A',
          totalHours: data.totalHours || 0,
          minutes_late: data.minutes_late || 0,
          taskCompletionRate: data.taskCompletionRate || 0.8,
          specialProjects: data.specialProjects || 0.7,
          collaborationScore: data.collaborationScore || 0.85,
          peerFeedback: data.peerFeedback || 0.9
        };
      };

      const monthlyEmployee = processEmployeeData(monthlyData);
      const weeklyEmployee = processEmployeeData(weeklyData);

      setTopEmployees({
        monthlyTopEmployee: monthlyEmployee ? {
          ...monthlyEmployee,
          aiScore: calculateScore(monthlyEmployee),
          tags: ['Top Performer', 'Monthly Star']
        } : null,
        weeklyTopEmployee: weeklyEmployee ? {
          ...weeklyEmployee,
          aiScore: calculateScore(weeklyEmployee),
          tags: ['Weekly Champion', 'Outstanding']
        } : null
      });

    } catch (error) {
      console.error('Error in fetchTopEmployees:', error);
      setTopEmployees({ monthlyTopEmployee: null, weeklyTopEmployee: null });
    }
  };

  const calculateScore = (employee) => {
    if (!employee) return 0;
    
    const weights = {
      attendance: 0.2,
      performance: 0.3,
      initiative: 0.2,
      teamwork: 0.15,
      feedback: 0.15
    };

    const attendanceScore = (employee.totalHours || 0) / 160;
    const punctualityScore = 1 - ((employee.minutes_late || 0) / 60);
    const attendanceFinal = (attendanceScore + punctualityScore) / 2;

    const performanceScore = employee.taskCompletionRate || 0.8;
    const initiativeScore = employee.specialProjects || 0.7;
    const teamworkScore = employee.collaborationScore || 0.85;
    const feedbackScore = employee.peerFeedback || 0.9;

    const finalScore = (
      (attendanceFinal * weights.attendance) +
      (performanceScore * weights.performance) +
      (initiativeScore * weights.initiative) +
      (teamworkScore * weights.teamwork) +
      (feedbackScore * weights.feedback)
    ) * 100;

    return finalScore.toFixed(2);
  };

  useEffect(() => {
    fetchTopEmployees();
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

      {/* Common Complaints Chart */}
      <motion.div
        className={`p-6 rounded-lg shadow-lg ${cardClasses}`}
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
              },
              plugins: {
                legend: {
                  position: 'top',
                }
              }
            }}
          />
        </div>
      </motion.div>
    </div>
  );

  const renderTopEmployees = () => (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Top Performing Employees</h2>
      
      {/* Monthly Top Employee */}
      <div className={`p-6 rounded-lg shadow-lg mb-6 ${cardClasses}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-blue-600">Employee of the Month</h3>
          {dateRanges.monthly.start && (
            <p className="text-sm opacity-75">
              {formatDate(dateRanges.monthly.start)} - {formatDate(dateRanges.monthly.end)}
            </p>
          )}
        </div>
        
        {topEmployees.monthlyTopEmployee ? (
          <div className="flex items-center space-x-6">
            <div className="w-32 h-32 flex items-center justify-center text-gray-400">
              <FaUserCircle className="w-full h-full" />
            </div>
            <div>
              <h4 className="text-lg font-bold">{topEmployees.monthlyTopEmployee.name}</h4>
              <p className="opacity-75 mb-2">{topEmployees.monthlyTopEmployee.position}</p>
              <p className="text-green-600 font-semibold">
                Performance Score: {topEmployees.monthlyTopEmployee.aiScore}
              </p>
              <div className="flex gap-2 mt-2">
                {topEmployees.monthlyTopEmployee.tags?.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center py-4">Loading monthly top employee...</p>
        )}
      </div>

      {/* Weekly Top Employee */}
      <div className={`p-6 rounded-lg shadow-lg ${cardClasses}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-blue-600">Employee of the Week</h3>
          {dateRanges.weekly.start && (
            <p className="text-sm opacity-75">
              {formatDate(dateRanges.weekly.start)} - {formatDate(dateRanges.weekly.end)}
            </p>
          )}
        </div>
        
        {topEmployees.weeklyTopEmployee ? (
          <div className="flex items-center space-x-6">
            <div className="w-32 h-32 flex items-center justify-center text-gray-400">
              <FaUserCircle className="w-full h-full" />
            </div>
            <div>
              <h4 className="text-lg font-bold">{topEmployees.weeklyTopEmployee.name}</h4>
              <p className="opacity-75 mb-2">{topEmployees.weeklyTopEmployee.position}</p>
              <p className="text-green-600 font-semibold">
                Performance Score: {topEmployees.weeklyTopEmployee.aiScore}
              </p>
              <div className="flex gap-2 mt-2">
                {topEmployees.weeklyTopEmployee.tags?.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center py-4">Loading weekly top employee...</p>
        )}
      </div>
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

        {/* Analytics Section */}
        {renderAnalytics()}

        {/* Top Employees Section */}
        {renderTopEmployees()}

      </motion.main>
    </motion.div>
  );
};

export default AdminDashboard;
