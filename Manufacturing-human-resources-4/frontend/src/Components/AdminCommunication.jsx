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
  const [userLikes, setUserLikes] = useState({}); // Add this state
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogout = () => {

    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(ANNOUNCEMENT);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setAnnouncements(response.data);
          
          // Update likes and comments from the response
          const newLikes = {};
          const newComments = {};
          const newUserLikes = {};
          
          response.data.forEach(announcement => {
            newLikes[announcement._id] = announcement.likes || 0;
            newComments[announcement._id] = announcement.comments || [];
            newUserLikes[announcement._id] = announcement.likedBy || [];
          });
          
          setLikes(newLikes);
          setComments(newComments);
          setUserLikes(newUserLikes);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchAnnouncements();

    // Poll every 30 seconds instead of 5 seconds
    const interval = setInterval(fetchAnnouncements, 30000);

    return () => clearInterval(interval);
  }, []); // Remove dependencies array

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const userRole = localStorage.getItem('userRole');
      
      if (isAuthenticated === 'true' && userRole === 'Admin') {
        setCurrentUser({
          id: 'admin-user',
          name: 'Admin User',
          username: 'admin',
          isAdmin: true
        });
      }
    };

    checkAuth();
  }, []);

  const getUser = () => currentUser;

  const handleLike = async (announcementId, event) => {
    event.stopPropagation();
    
    if (!currentUser) {
      alert('Please login as admin to like announcements');
      return;
    }

    try {
      const announcement = announcements.find(a => a._id === announcementId);
      const isLiked = announcement.likedBy?.includes(currentUser.id);
      const action = isLiked ? 'unlike' : 'like';

      // Optimistically update UI
      setAnnouncements(prevAnnouncements => 
        prevAnnouncements.map(ann => {
          if (ann._id === announcementId) {
            return {
              ...ann,
              likes: (ann.likes || 0) + (isLiked ? -1 : 1),
              likedBy: isLiked 
                ? (ann.likedBy || []).filter(id => id !== currentUser.id)
                : [...(ann.likedBy || []), currentUser.id]
            };
          }
          return ann;
        })
      );

      const response = await axios.patch(`${ANNOUNCEMENT}/${announcementId}`, {
        action,
        userId: currentUser.id,
        userName: currentUser.name,
        title: announcement.title,
        content: announcement.content
      });

      if (response.data) {
        // Update the specific announcement with server response
        setAnnouncements(prevAnnouncements => 
          prevAnnouncements.map(ann => 
            ann._id === announcementId ? {
              ...ann,
              likes: response.data.likes,
              likedBy: response.data.likedBy || []
            } : ann
          )
        );

        // Update likes state
        setLikes(prev => ({
          ...prev,
          [announcementId]: response.data.likes
        }));

        // Update userLikes state
        setUserLikes(prev => ({
          ...prev,
          [announcementId]: response.data.likedBy || []
        }));
      }
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert optimistic update on error
      const originalAnnouncement = announcements.find(a => a._id === announcementId);
      setAnnouncements(prevAnnouncements => 
        prevAnnouncements.map(ann => 
          ann._id === announcementId ? originalAnnouncement : ann
        )
      );
    }
  };

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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(announcement._id, e);
                          }}
                          className={`flex items-center space-x-2 transition-colors ${
                            announcement.likedBy?.includes(currentUser?.id)
                              ? 'text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full'
                              : 'text-gray-600 hover:text-blue-600'
                          }`}
                        >
                          <FaThumbsUp className={
                            announcement.likedBy?.includes(currentUser?.id)
                              ? 'transform scale-110'
                              : ''
                          } />
                          <span>
                            {announcement.likes || 0}
                            {announcement.likedBy?.includes(currentUser?.id) 
                              ? ' Liked'
                              : announcement.likes > 0 
                                ? ' Likes'
                                : ' Like'
                            }
                          </span>
                          {announcement.likes > 0 && (
                            <span className="text-xs text-gray-500">
                              {announcement.likedBy?.includes(currentUser?.id)
                                ? announcement.likes > 1
                                  ? ` (You and ${announcement.likes - 1} other${announcement.likes > 2 ? 's' : ''})`
                                  : ' (You liked this)'
                                : ` (${announcement.likes} like${announcement.likes > 1 ? 's' : ''})`
                              }
                            </span>
                          )}
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
