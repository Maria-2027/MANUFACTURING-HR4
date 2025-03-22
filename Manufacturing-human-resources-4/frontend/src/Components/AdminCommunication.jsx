import React, { useState, useEffect } from "react";
import { FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt, FaSun, FaMoon, FaBullhorn, FaBookmark, FaEye, FaThumbsUp, FaComment } from "react-icons/fa";
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
  
  // Check if the date is valid
  if (isNaN(postDate.getTime())) {
    return "Invalid date";
  }

  const diffInMs = now - postDate;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // If more than 7 days old, show the actual date
  if (diffInDays > 7) {
    return postDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  // If more than 1 day old
  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  // If more than 1 hour old
  if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  // If more than 1 minute old
  if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  // If less than a minute old
  return "Just now";
};

const AdminCommunication = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Communication Hub");
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});

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

  // Add polling for real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(ANNOUNCEMENT);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setAnnouncements(response.data);
          
          // Update likes and comments from the response
          const newLikes = {};
          const newComments = {};
          response.data.forEach(announcement => {
            newLikes[announcement._id] = announcement.likes || 0;
            newComments[announcement._id] = announcement.comments || [];
          });
          setLikes(newLikes);
          setComments(newComments);
        }
      } catch (error) {
        console.error('Error updating data:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
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

  const handleLike = async (announcementId) => {
    try {
      // Update locally first
      setLikes(prev => ({
        ...prev,
        [announcementId]: (prev[announcementId] || 0) + 1
      }));

      // Update in backend
      await axios.patch(`${ANNOUNCEMENT}/${announcementId}`, {
        likes: (likes[announcementId] || 0) + 1
      });
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleComment = async (announcementId, comment) => {
    if (!comment.trim()) return;
    
    try {
      const newComment = {
        text: comment,
        timestamp: new Date().toISOString()
      };

      // Update locally first
      const updatedComments = [
        ...(comments[announcementId] || []),
        newComment
      ];

      setComments(prev => ({
        ...prev,
        [announcementId]: updatedComments
      }));

      // Update in backend
      await axios.patch(`${ANNOUNCEMENT}/${announcementId}`, {
        comments: updatedComments
      });

      setShowCommentInput(prev => ({
        ...prev,
        [announcementId]: false
      }));
    } catch (error) {
      console.error('Error posting comment:', error);
    }
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
      <main className="flex-1 p-6 overflow-auto bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Company Announcements</h1>
            <div className="text-sm text-gray-500">
              Showing {announcements.length} announcements
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin border-t-4 border-blue-600 rounded-full w-12 h-12"></div>
            </div>
          ) : announcements.length > 0 ? (
            <div className="space-y-6">
              {announcements.map((announcement, index) => (
                <div key={index} 
                     className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all duration-200">
                  {/* Header */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                          <FaBullhorn className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{announcement.title}</h3>
                          <div className="text-sm text-gray-500">
                            Posted {timeAgo(announcement.date)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-50 rounded-full" title="Save">
                          <FaBookmark className="text-gray-400 hover:text-blue-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5" onClick={() => handleAnnouncementClick(announcement)}>
                    <p className="text-gray-600 leading-relaxed">
                      {announcement.content.length > 200 
                        ? `${announcement.content.substring(0, 200)}...` 
                        : announcement.content}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => handleLike(announcement._id)}
                          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <FaThumbsUp />
                          <span>{likes[announcement._id] || 0} Agree</span>
                        </button>
                        <button 
                          onClick={() => setShowCommentInput(prev => ({
                            ...prev,
                            [announcement._id]: !prev[announcement._id]
                          }))}
                          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <FaComment />
                          <span>{(comments[announcement._id] || []).length} Comments</span>
                        </button>
                      </div>
                      <button 
                        onClick={() => handleAnnouncementClick(announcement)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Read More
                      </button>
                    </div>

                    {/* Comment Section */}
                    {showCommentInput[announcement._id] && (
                      <div className="mt-3 space-y-3">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleComment(announcement._id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                          />
                          <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            onClick={(e) => {
                              const input = e.target.previousSibling;
                              handleComment(announcement._id, input.value);
                              input.value = '';
                            }}
                          >
                            Comment
                          </button>
                        </div>
                        {/* Display Comments */}
                        {(comments[announcement._id] || []).map((comment, i) => (
                          <div key={i} className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-600">{comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <FaBullhorn className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No announcements available.</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50" 
             onClick={handleCloseModal}>
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl" 
               onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <FaBullhorn className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedAnnouncement.title}</h3>
                    <p className="text-sm text-gray-500">Posted {timeAgo(selectedAnnouncement.date)}</p>
                  </div>
                </div>
                <button onClick={handleCloseModal} 
                        className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full">
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {selectedAnnouncement.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dark Mode Toggle */}
      <div className="absolute top-5 right-5">
        <button
          onClick={toggleDarkMode}
          className="bg-gray-200 p-2 rounded-full shadow-lg transition duration-200 hover:bg-gray-300"
        >
          {darkMode ? <FaSun className="text-yellow-500 text-xl" /> : <FaMoon className="text-gray-800 text-xl" />}
        </button>
      </div>
    </div>
  );
};

export default AdminCommunication;
