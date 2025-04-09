import React, { useState, useEffect } from "react";
import { FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt, FaSun, FaMoon, FaBullhorn, FaBookmark, FaEye, FaThumbsUp, FaComment, FaRegClipboard } from "react-icons/fa";
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

// Add this loading skeleton component at the top, after imports
const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((n) => (
      <div key={n} className="bg-white rounded-lg p-5 animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"/>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"/>
            <div className="h-3 bg-gray-200 rounded w-1/2"/>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded"/>
          <div className="h-3 bg-gray-200 rounded w-5/6"/>
        </div>
      </div>
    ))}
  </div>
);

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
  const [shouldPoll, setShouldPoll] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [newComment, setNewComment] = useState('');

  // Add these new state declarations
  const modalRef = React.useRef(null);
  const [modalScrollPosition, setModalScrollPosition] = useState(0);

  // Add this function to preserve scroll position
  const preserveModalScroll = () => {
    if (modalRef.current) {
      setModalScrollPosition(modalRef.current.scrollTop);
    }
  };

  // Add effect to restore scroll position
  useEffect(() => {
    if (modalRef.current && modalScrollPosition > 0) {
      modalRef.current.scrollTop = modalScrollPosition;
    }
  }, [modalScrollPosition, selectedAnnouncement?.comments]);

  const handleLogout = () => {

    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    let isMounted = true;
    let pollingInterval;

    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(ANNOUNCEMENT);
        
        if (!isMounted) return;

        setAnnouncements(response.data);
        
        // Initialize states from fetched announcements
        const initialLikes = {};
        const initialLikedBy = {};
        response.data.forEach(announcement => {
          initialLikes[announcement._id] = announcement.likes || 0;
          initialLikedBy[announcement._id] = announcement.likedBy || [];
        });
        setLikes(initialLikes);
        setUserLikes(initialLikedBy);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setShouldPoll(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const user = getUser();
      if (user) {
        setCurrentUser(user);
      }
    };

    checkAuth();
  }, []);

  const getUser = () => {
    try {
      const userString = localStorage.getItem('userData') || localStorage.getItem('user');
      if (!userString) return null;
      
      const user = JSON.parse(userString);
      return {
        id: user._id || user.id, // Handle both _id and id cases
        name: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}`
          : user.name || 'Admin User',
        username: user.email || user.username,
        isAdmin: user.userRole === 'Admin' || user.userRole === 'Superadmin'
      };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

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

  const handleReplySubmit = (e, announcementId, commentId) => {
    e.preventDefault();
    if (replyText.trim()) {
      handleComment(announcementId, replyText, commentId);
    }
  };

  const handleComment = async (announcementId, commentText, parentCommentId = null) => {
    if (!currentUser) {
      alert('Please login as admin to comment');
      return;
    }

    if (!commentText.trim()) return;

    try {
      const announcement = announcements.find(a => a._id === announcementId);
      if (!announcement) return;

      // Preserve scroll position before update
      if (modalRef.current) {
        setModalScrollPosition(modalRef.current.scrollTop);
      }

      const response = await axios.patch(`${ANNOUNCEMENT}/${announcementId}`, {
        action: 'comment',
        userId: currentUser.id,
        userName: currentUser.name,
        comment: {
          text: commentText,
          timestamp: new Date().toISOString(),
          parentId: parentCommentId,
        },
        title: announcement.title,
        content: announcement.content,
        date: announcement.date
      });

      if (response.data) {
        setAnnouncements(prev => 
          prev.map(ann => 
            ann._id === announcementId ? response.data : ann
          )
        );

        if (selectedAnnouncement?._id === announcementId) {
          setSelectedAnnouncement(response.data);
        }

        // Reset global states
        setNewComment('');
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
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

  const getCommentCount = (announcement) => {
    return announcement.comments?.reduce((total, comment) => 
      total + (comment.parentId ? 0 : 1) + 
      announcement.comments.filter(reply => reply.parentId === comment._id).length
    , 0) || 0;
  };

  const MemoizedAnnouncement = React.memo(({ announcement }) => (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all duration-200">
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
              <span>{getCommentCount(announcement)} Comments</span>
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
            {announcement.comments
              ?.filter(c => !c.parentId)
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((comment, i) => (
                <div key={i} className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700">{comment.userName}</p>
                    <p className="text-gray-600">{comment.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">{timeAgo(comment.timestamp)}</p>
                      <button
                        onClick={() => setReplyingTo(comment._id)}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        Reply
                      </button>
                    </div>
                  </div>

                  {/* Show Replies */}
                  {announcement.comments
                    .filter(reply => reply.parentId === comment._id)
                    .map((reply, j) => (
                      <div key={j} className="ml-8 bg-gray-50 p-3 rounded-lg border-l-2 border-blue-200">
                        <p className="text-sm font-semibold text-gray-700">{reply.userName}</p>
                        <p className="text-xs text-gray-500 mb-1">Replied to {comment.userName}</p>
                        <p className="text-gray-600">{reply.text}</p>
                        <p className="text-xs text-gray-500 mt-2">{timeAgo(reply.timestamp)}</p>
                      </div>
                    ))}

                  {/* Reply Input */}
                  {replyingTo === comment._id && (
                    <ReplyInput comment={comment} announcement={announcement} />
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  ));

  const ReplyInput = React.memo(({ comment, announcement }) => {
    const [localReplyText, setLocalReplyText] = useState('');
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if (localReplyText.trim()) {
        handleComment(announcement._id, localReplyText, comment._id);
        setLocalReplyText('');
      }
    };

    return (
      <div className="ml-8">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <p className="text-sm text-gray-500">Replying to {comment.userName}</p>
          <div className="flex space-x-2">
            <input
              type="text"
              value={localReplyText}
              onChange={(e) => setLocalReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Reply
            </button>
            <button
              type="button"
              className="px-3 py-2 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setReplyingTo(null);
                setLocalReplyText('');
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  });

  return (
    <div className={`flex h-screen ${themeClasses}`}>
      {/* Sidebar */}
                 <aside className={`w-72 shadow-lg p-6 flex flex-col relative h-screen overflow-y-auto ${sidebarClasses}`}>
                   <div className="flex justify-center mb-6">
                     <img 
                       src={layout} 
                       alt="JJM Logo" 
                       className="w-32 h-32 rounded-full cursor-pointer hover:opacity-80 transition-opacity" 
                       onClick={() => navigate('/admin-dashboard')}
                     />
                   </div>
                   <h2 className="text-2xl font-bold text-center mb-8">JJM Admin Portal</h2>
           
                   <nav className="flex-grow">
                     <ul className="space-y-4">
                       {[{ title: "Employee Grievances", icon: <FaExclamationCircle className="text-lg" />, link: "/admin-grievance" },
                         { title: "Employee Suggestions", icon: <FaRegCommentDots className="text-lg" />, link: "/admin-employee-suggestion" },
                         { title: "Communication Hub", icon: <FaEnvelope className="text-lg" />, link: "/admin-communication" },
                         { title: "Workforce Analytics", icon: <FaChartBar className="text-lg" />, link: "/admin-workflow" },
                         { title: "Audit Logs", icon: <FaRegClipboard className="text-lg" />, link: "/admin-audit-logs" }]
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
            <LoadingSkeleton />
          ) : announcements.length > 0 ? (
            <div className="space-y-6">
              {announcements.map((announcement, index) => (
                <MemoizedAnnouncement 
                  key={announcement._id || index} 
                  announcement={announcement}
                />
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
          <div 
            ref={modalRef}
            className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl" 
            onClick={e => e.stopPropagation()}
            onScroll={preserveModalScroll}
          >
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
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed mb-6">
                {selectedAnnouncement.content}
              </p>

              {/* Comments Section */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold mb-4">Comments</h4>
                
                {/* New Comment Input */}
                <div className="mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newComment.trim()) {
                          handleComment(selectedAnnouncement._id, newComment);
                        }
                      }}
                    />
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      onClick={() => {
                        if (newComment.trim()) {
                          handleComment(selectedAnnouncement._id, newComment);
                        }
                      }}
                    >
                      Comment
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {selectedAnnouncement.comments
                    ?.filter(c => !c.parentId)
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((comment, i) => (
                      <div key={i} className="space-y-3">
                        {/* Main Comment */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-gray-700">{comment.userName}</p>
                          <p className="text-gray-600">{comment.text}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500">{timeAgo(comment.timestamp)}</p>
                            <button
                              onClick={() => setReplyingTo(comment._id)}
                              className="text-sm text-blue-500 hover:text-blue-600"
                            >
                              Reply
                            </button>
                          </div>
                        </div>

                        {/* Replies */}
                        <div className="ml-8 space-y-3">
                          {selectedAnnouncement.comments
                            .filter(reply => reply.parentId === comment._id)
                            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                            .map((reply, j) => (
                              <div key={j} className="bg-gray-50 p-3 rounded-lg border-l-2 border-blue-200">
                                <div className="flex flex-col">
                                  <p className="text-sm font-semibold text-gray-700">{reply.userName}</p>
                                  <p className="text-xs text-gray-500 mb-1">Replied to {comment.userName}</p>
                                  <p className="text-gray-600">{reply.text}</p>
                                  <p className="text-xs text-gray-500 mt-2">{timeAgo(reply.timestamp)}</p>
                                </div>
                              </div>
                            ))}
                        </div>

                        {/* Reply Input */}
                        {replyingTo === comment._id && (
                          <ReplyInput comment={comment} announcement={selectedAnnouncement} />
                        )}
                      </div>
                    ))}
                </div>
              </div>
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

export default React.memo(AdminCommunication);
