import React, { useState, useEffect } from "react";
import { FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import { SyncLoader } from "react-spinners";
import layout from "./Assets/layout.jpg";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

const ADMINGRIEVANCE = process.env.NODE_ENV === "development"
    ? "http://localhost:7688/EmComplaint"
    : "https://backend-hr4.jjm-manufacturing.com/Emcomplaint";


const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [activeTab, setActiveTab] = useState();
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState("John Doe"); // Fixed initialization with a default value
  const [complaintStats, setComplaintStats] = useState({
    labels: [],
    counts: []
  });
  const [dateFilter, setDateFilter] = useState('today'); // 'today', 'week', 'month'
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
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
    // Fetch complaints data
    axios.get(ADMINGRIEVANCE)
      .then(response => {
        const counts = {};
        const now = new Date();
        const filterDate = new Date();

        // Set filter date based on selection
        switch(dateFilter) {
          case 'yesterday':
            filterDate.setDate(now.getDate() - 1);
            filterDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            filterDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            filterDate.setMonth(now.getMonth() - 1);
            break;
          default: // today
            filterDate.setHours(0, 0, 0, 0);
        }

        response.data.forEach(complaint => {
          const complaintDate = new Date(complaint.date);
          if (complaintDate >= filterDate && complaint.ComplaintType && complaint.ComplaintType !== 'Unspecified') {
            counts[complaint.ComplaintType] = (counts[complaint.ComplaintType] || 0) + 1;
          }
        });

        setComplaintStats({
          labels: Object.keys(counts),
          counts: Object.values(counts)
        });
      })
      .catch(error => console.error('Error fetching complaints:', error));
  }, [dateFilter]); // Add dateFilter to dependency array

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

  // Register ChartJS components
  ChartJS.register(ArcElement, Tooltip, Legend);

  const chartData = {
    labels: complaintStats.labels,
    datasets: [
      {
        data: complaintStats.counts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 10,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: `Complaint Statistics (${
          dateFilter === 'today' ? 'Today' :
          dateFilter === 'yesterday' ? 'Yesterday' :
          dateFilter === 'week' ? 'Last 7 Days' :
          'Last 30 Days'
        })`,
        font: {
          size: 14,
          weight: 'bold'
        },
        padding: 15
      }
    }
  };

  // Define classes for dark and light modesss
  const themeClasses = darkMode // Fixed typo in darkModess
    ? "bg-gray-900 text-white"
    : "bg-gradient-to-r from-gray-50 to-gray-200 text-gray-900";
  const sidebarClasses = darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const buttonHoverClasses = darkMode
    ? "hover:bg-gray-700 text-white"
    : "hover:bg-gray-100 text-gray-800";
  const cardClasses = darkMode
    ? "bg-gray-800 text-white hover:bg-gray-700"
    : "bg-white text-gray-900 hover:bg-gray-100";
  const greetingTextClass = darkMode ? "text-white" : "text-gray-900"; // Explicitly set greeting text color

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={`flex h-screen ${themeClasses}`}
    >
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`w-72 shadow-lg p-6 flex flex-col relative ${sidebarClasses}`}
      >
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <Link to="/admin-dashboard">
            <img src={layout} alt="JJM Logo" className="w-32 h-32 rounded-full shadow-md" />
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">JJM Admin Portal</h2>

        {/* Sidebar Links */}
        <nav className="flex-grow">
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

        {/* Logout Button */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center space-x-4 text-lg font-semibold p-3 rounded-md cursor-pointer transition duration-200 ${buttonHoverClasses} w-full`}
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 p-10"
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
            {greeting}, Admin
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

        {/* Complaints Chart with date filter */}
        <div 
          className={`mt-8 p-6 rounded-xl shadow-lg ${cardClasses} backdrop-blur-sm bg-opacity-90`}
          style={{ 
            width: '450px',
            height: '300px',
            marginLeft: '20px'
          }}
        >
          <div className="mb-4 flex items-center gap-4">
            <label className="font-medium text-sm">Show complaints for: </label>
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="p-2 rounded border bg-white text-gray-800 text-sm"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
          
          <div style={{ height: '230px' }}>
            <Pie 
              data={chartData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: `Complaint Statistics (${
                      dateFilter === 'today' ? 'Today' :
                      dateFilter === 'yesterday' ? 'Yesterday' :
                      dateFilter === 'week' ? 'Last 7 Days' :
                      'Last 30 Days'
                    })`
                  }
                }
              }}
            />
          </div>
        </div>

      </motion.main>
    </motion.div>
  );
};

export default AdminDashboard;
