import React, { useState, useEffect } from "react";
import { FaSearch, FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import layout from "./Assets/layout.jpg"; // Logo image
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Add Link import
import AdminHr3Compensate from "./AdminHr3Compensate";
import { motion, AnimatePresence } from "framer-motion";

const ADMINGRIEVANCE = process.env.NODE_ENV === "development"
    ? "http://localhost:7688/EmComplaint"
    : "https://backend-hr4.jjm-manufacturing.com/Emcomplaint";

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Employee Grievances");
  const [complaints, setComplaints] = useState([]); // State to store grievances
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [itemsPerPage] = useState(8); // Number of items per page (set to 8 columns)
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" }); // Sorting configuration
  const [searchTerm, setSearchTerm] = useState(""); // Search term

  const navigate = useNavigate(); // Initialize useNavigate

  const handleCompensationClick = () => {
    navigate('/admin-compensate'); // Update this line to navigate to AdminHr3Compensate
  };

  useEffect(() => {
    axios
      .get(ADMINGRIEVANCE)
      .then((response) => {
        console.log('API Response:', response.data); // For debugging
        setComplaints(response.data);
      })
      .catch((err) => console.log(err));
  }, [currentPage, itemsPerPage, sortConfig]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const themeClasses = darkMode
    ? "bg-gray-900 text-white"
    : "bg-gradient-to-r from-gray-50 to-gray-200 text-gray-900";
  const sidebarClasses = darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const buttonHoverClasses = darkMode
    ? "hover:bg-gray-700 text-white"
    : "hover:bg-gray-100 text-gray-800";

  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const themeToggleClasses = darkMode ? "text-yellow-500" : "text-gray-800";

  // Search filtering
  const filteredComplaints = complaints.filter((complaint) => {
    const firstName = complaint.employee?.firstName || complaint.firstName || "";
    const lastName = complaint.employee?.lastName || complaint.lastName || "";
    const complaintType = complaint.ComplaintType || ""; // Fixed: Changed from complaintType to ComplaintType
    const complaintDescription = complaint.ComplaintDescription || "";
    
    return (
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaintType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaintDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sorting logic
  const sortedComplaints = filteredComplaints.sort((a, b) => {
    if (sortConfig.key === "date") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortConfig.key === "firstName" || sortConfig.key === "lastName" || sortConfig.key === "ComplaintType") {
      const valueA = a[sortConfig.key] || '';
      const valueB = b[sortConfig.key] || '';
      return sortConfig.direction === "asc" 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);

  const handleLogoClick = (e) => {
    e.preventDefault();
    console.log("Logo clicked");
    navigate("/admin-dashboard"); // Use navigate to go to admin-dashboard
  };

  const FileDisplay = ({ fileUrl }) => {
    if (!fileUrl) return <span className="text-gray-500">No File</span>;
  
    const isImage = fileUrl.match(/\.(jpeg|jpg|gif|png)$/i);
    const isPDF = fileUrl.toLowerCase().includes('.pdf');
  
    if (isImage) {
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 underline flex items-center gap-2"
        >
          <img src={fileUrl} alt="Attachment" className="w-10 h-10 object-cover rounded" />
          View Image
        </a>
      );
    }
  
    if (isPDF) {
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 underline flex items-center gap-2"
        >
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a2 2 0 00-2 2v8l-3.146-3.146a.5.5 0 01.708-.708L8 11.793l3.438-3.437a.5.5 0 01.708.708L9 12.207V4a1 1 0 012 0v8.793l2.146-2.147a.5.5 0 01.708.708L10.707 14.5a1 1 0 01-1.414 0L6.146 11.354a.5.5 0 01.708-.708L9 13.293V4a2 2 0 00-2-2z"/>
          </svg>
          View PDF
        </a>
      );
    }
  
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700 underline"
      >
        View File
      </a>
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className={`flex h-screen ${themeClasses}`}>
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

      {/* Animated main content */}
      <motion.main 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow p-6 overflow-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold"
          >
            Employee Grievances
          </motion.h3>

          <div className="flex items-center justify-between mb-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative flex-1 max-w-md"
            >
              <input
                type="text"
                placeholder="Search Grievances"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 pl-12 pr-4 bg-white border-2 border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleCompensationClick}
              className="ml-4 p-4 bg-blue-100 rounded-lg shadow-md hover:bg-blue-200 cursor-pointer transition-colors duration-200"
            >
              <span className="font-semibold text-blue-800">Active Content: Compensation & Sanctions</span>
            </motion.div>
          </div>

          <motion.table
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="min-w-full mt-6 table-auto border-collapse"
          >
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left cursor-pointer" onClick={() => handleSort("firstName")}>
                  First Name
                  {sortConfig.key === "firstName" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th className="py-2 px-4 text-left cursor-pointer" onClick={() => handleSort("lastName")}>
                  Last Name
                  {sortConfig.key === "lastName" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th
                  className="py-2 px-4 text-left cursor-pointer"
                  onClick={() => handleSort("ComplaintDescription")}
                >
                  Complaint Description
                  {sortConfig.key === "ComplaintDescription" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th className="py-2 px-4 text-left cursor-pointer" onClick={() => handleSort("complaintType")}>
                  Complaint Type
                  {sortConfig.key === "complaintType" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th className="py-2 px-4 text-left cursor-pointer" onClick={() => handleSort("date")}>
                  Date
                  {sortConfig.key === "date" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th className="py-2 px-4 text-left">File</th>
              </tr>
            </thead>
            <AnimatePresence>
              <tbody>
                {sortedComplaints
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((complaint, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-2 px-4">
                        {complaint.firstName || 'N/A'}
                      </td>
                      <td className="py-2 px-4">
                        {complaint.lastName || 'N/A'}
                      </td>
                      <td className="py-2 px-4">{complaint.ComplaintDescription || 'N/A'}</td>
                      <td className="py-2 px-4">{complaint.ComplaintType || 'N/A'}</td> {/* Fixed: Changed from complaintType to ComplaintType */}
                      <td className="py-2 px-4">
                        {complaint.date ? new Date(complaint.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-2 px-4">
                        <FileDisplay fileUrl={complaint.File} />
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </AnimatePresence>
          </motion.table>

          {/* Animated pagination controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4 flex justify-between"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Previous
            </motion.button>
            <span className="self-center">{`Page ${currentPage} of ${totalPages}`}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Next
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.main>

      {/* Animated dark mode toggle */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="absolute top-5 right-5"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className="bg-gray-200 p-2 rounded-full shadow-lg transition duration-200 hover:bg-gray-300"
        >
          {darkMode ? (
            <FaSun className={`${themeToggleClasses} text-xl`} />
          ) : (
            <FaMoon className={`${themeToggleClasses} text-xl`} />
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;