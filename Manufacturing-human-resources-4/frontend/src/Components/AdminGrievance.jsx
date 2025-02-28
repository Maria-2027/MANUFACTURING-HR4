import React, { useState, useEffect } from "react";
import { FaSearch,FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import layout from "./Assets/layout.jpg";  // Logo image
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const AdminDashboard = () => {
const [darkMode, setDarkMode] = useState(false);
const [activeTab, setActiveTab] = useState("Employee Grievances");
const [complaints, setComplaints] = useState([]); // State to store grievances
const [currentPage, setCurrentPage] = useState(1); // Track the current page
const [itemsPerPage] = useState(8); // Number of items per page (set to 8 columns)
const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" }); // Sorting configuration
const [searchTerm, setSearchTerm] = useState(""); // Search term

const navigate = useNavigate();  // Initialize useNavigate

useEffect(() => {
    // Fetch grievances from the backend API with pagination and sorting
    axios
    .get(`http://localhost:7688/EmComplaint?page=${currentPage}&limit=${itemsPerPage}&sort=${sortConfig.key}&order=${sortConfig.direction}`)
    .then((response) => setComplaints(response.data))
    .catch((err) => console.log(err));
}, [currentPage, itemsPerPage, sortConfig]); // Run when page, itemsPerPage, or sortConfig changes

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
    const complaintName = complaint.FullName ? complaint.FullName.toLowerCase() : "";
    const complaintDescription = complaint.ComplaintDescription ? complaint.ComplaintDescription.toLowerCase() : "";

    return (
    complaintName.includes(searchTerm.toLowerCase()) ||
    complaintDescription.includes(searchTerm.toLowerCase())
    );
});

// Sorting logic: Sorting by date first and then other fields if needed
const sortedComplaints = filteredComplaints.sort((a, b) => {
    if (sortConfig.key === "date") {
    // Convert date strings to Date objects for comparison
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    } else {
    // For other fields like "FullName" and "ComplaintDescription"
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
    }
});

// Pagination logic
const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);

const handleLogoClick = (e) => {
    e.preventDefault();
    console.log("Logo clicked");
    navigate("/admin-dashboard"); // Use navigate to go to admin-dashboard
};

return (
    <div className={`flex h-screen ${themeClasses}`}>
    {/* Sidebar */}
    <aside className={`w-72 shadow-lg p-6 flex flex-col relative ${sidebarClasses}`}>
        <div className="flex justify-center mb-6" onClick={handleLogoClick}>
        <img src={layout} alt="JJM Logo" className="w-32 h-32 rounded-full cursor-pointer" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-8">JJM Admin Portal</h2>

        {/* Sidebar Links */}
        <nav className="flex-grow">
<ul className="space-y-4"> {/* Reduced space between items */}
    {[{ title: "Employee Grievances", icon: <FaExclamationCircle className="text-lg" />, link: "/admin-grievance" },
    { title: "Employee Suggestions", icon: <FaRegCommentDots className="text-lg" />, link: "/admin-employee-suggestion" },
    { title: "Communication Hub", icon: <FaEnvelope className="text-lg" />, link: "/admin-communication" },
    { title: "Workforce Analytics", icon: <FaChartBar className="text-lg" />, link: "/admin-analytics" },
    ].map((item, index) => (
    <li
        key={index}
        className={`flex items-center space-x-3 text-base font-medium p-2 rounded-md cursor-pointer transition duration-200 ${activeTab === item.title ? "bg-blue-200 text-blue-600" : buttonHoverClasses}`}
        onClick={() => setActiveTab(item.title)}
    >
        {item.icon}
        <span>{item.title}</span>
    </li>
    ))}
</ul>
</nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
        <button
            onClick={() => console.log("Logged out")}
            className={`flex items-center justify-center space-x-4 text-lg font-semibold p-3 rounded-md cursor-pointer transition duration-200 ${buttonHoverClasses} w-full`}
        >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
        </button>
        </div>
    </aside>

    {/* Grievance Table */}
    <main className="flex-grow p-6 overflow-auto">
        <div className="mb-4">
        <h3 className="text-xl font-semibold">Employee Grievances</h3>
        

    <div className="relative mb-6">
    <input
    type="text"
    placeholder="Search Grievances"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full max-w-md p-4 pl-12 pr-4 bg-white border-2 border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
     />
    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>

        
        <table className="min-w-full mt-6 table-auto border-collapse">
            <thead>
            <tr className="border-b">
                <th className="py-2 px-4 text-left cursor-pointer" onClick={() => handleSort("FullName")}>
                Full Name
                {sortConfig.key === "FullName" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th className="py-2 px-4 text-left cursor-pointer" onClick={() => handleSort("ComplaintDescription")}>
                Complaint Description
                {sortConfig.key === "ComplaintDescription" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th className="py-2 px-4 text-left cursor-pointer" onClick={() => handleSort("date")}>
                Date
                {sortConfig.key === "date" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th className="py-2 px-4 text-left">File</th>
            </tr>
            </thead>
            <tbody>
            {sortedComplaints.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((complaint, index) => (
                <tr key={index} className="border-b">
                <td className="py-2 px-4">{complaint.FullName}</td>
                <td className="py-2 px-4">{complaint.ComplaintDescription}</td>
                <td className="py-2 px-4">{new Date(complaint.date).toLocaleDateString()}</td>
                <td className="py-2 px-4">
                    {complaint.File ? (
                    <a
                        href={complaint.File} // Link to view the file
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                        download // Allow file to be downloaded
                    >
                        {complaint.File ? "Click to View or Download" : "No File Available"}
                    </a>
                    ) : (
                    <span>No File</span>
                    )}
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between">
            <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-blue-500 text-white p-2 rounded"
            >
            Previous
            </button>
            <span className="self-center">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-blue-500 text-white p-2 rounded"
            >
            Next
            </button>
        </div>
        </div>
    </main>

    {/* Dark Mode Toggle Button */}
    <div className="absolute top-5 right-5">
        <button
        onClick={toggleDarkMode}
        className="bg-gray-200 p-2 rounded-full shadow-lg transition duration-200 hover:bg-gray-300"
        >
        {darkMode ? (
            <FaSun className={`${themeToggleClasses} text-xl`} />
        ) : (
            <FaMoon className={`${themeToggleClasses} text-xl`} />
        )}
        </button>
    </div>
    </div>

    
);
};

export default AdminDashboard;
