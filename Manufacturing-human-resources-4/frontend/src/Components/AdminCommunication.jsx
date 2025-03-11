import React, { useState, useEffect } from "react";
import { FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt, FaSun, FaMoon, FaBullhorn } from "react-icons/fa";
import layout from "./Assets/layout.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ANNOUNCEMENT = process.env.NODE_ENV === "development"
 ? "http://localhost:7688/api/integration/hr4-announcement"
 : "https://backend-hr4.jjm-manufacturing.com/api/integration/hr4-announcement";

// Helper function to calculate the time difference
const timeAgo = (timestamp) => {
  const now = new Date();
  const postDate = new Date(timestamp);
  const diffInMs = now - postDate;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays > 0) {
    return `${diffInDays} day(s) ago`;
  }
  if (diffInHours > 0) {
    return `${diffInHours} hour(s) ago`;
  }
  if (diffInMinutes > 0) {
    return `${diffInMinutes} minute(s) ago`;
  }
  return "Just now"; // if it's less than a minute
};

const AdminCommunication = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Communication Hub");
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const handleLogout = () => {

    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(ANNOUNCEMENT);
        console.log("Fetched data from backend:", response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
          setAnnouncements(response.data);
        } else {
          console.log("No valid announcements found.");
          setAnnouncements([]);
        }
      } catch (error) {
        console.error("❌ Error fetching announcements:", error);
        setAnnouncements([]);
      } finally {
        setIsLoading(false); // Stop loading when the data is fetched
      }
    };

    fetchAnnouncements();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const themeClasses = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const sidebarClasses = darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const buttonHoverClasses = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const handleCloseModal = () => {
    setSelectedAnnouncement(null);
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

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Communication Hub</h1>

        {/* Announcements Section */}
        <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
          <h2 className="text-xl font-semibold flex items-center mb-4 text-yellow-500">
            <FaBullhorn className="mr-2" /> Announcements
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin border-t-4 border-blue-600 rounded-full w-12 h-12"></div>
              <p className="ml-4 text-lg text-gray-600">Loading...</p>
            </div>
          ) : announcements.length > 0 ? (
            <ul className="space-y-3">
              {announcements.map((announcement, index) => (
                <li
                  key={index}
                  className="p-5 border rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  onClick={() => handleAnnouncementClick(announcement)}
                >
                  <h3 className="font-semibold text-lg text-gray-900">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{announcement.content}</p>
                  <p className="text-xs text-gray-500 mt-2">{timeAgo(announcement.createdAt)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No announcements available.</p>
          )}
        </div>
      </main>

      {/* Dark Mode Toggle Button */}
      <div className="absolute top-5 right-5">
        <button
          onClick={toggleDarkMode}
          className="bg-gray-200 p-2 rounded-full shadow-lg transition duration-200 hover:bg-gray-300"
        >
          {darkMode ? <FaSun className="text-yellow-500 text-xl" /> : <FaMoon className="text-gray-800 text-xl" />}
        </button>
      </div>

      {/* Announcement Modal */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-lg text-gray-700"
            >
              X
            </button>
            <h3 className="text-2xl font-semibold mb-4">{selectedAnnouncement.title}</h3>
            <p className="text-sm text-gray-600">{selectedAnnouncement.content}</p>
            <p className="text-xs text-gray-500 mt-2">{timeAgo(selectedAnnouncement.createdAt)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCommunication;
