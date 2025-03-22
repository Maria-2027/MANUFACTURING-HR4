import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBullhorn, FaTimes, FaThumbsUp, FaComment } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PATCH_ANNOUNCE = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/integration/hr4-announcement"
  : "https://backend-hr4.jjm-manufacturing.com/api/integration/hr4-announcement";

const ADMINANNOUNCE = PATCH_ANNOUNCE; // Use the same endpoint for both operations

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const [userLikes, setUserLikes] = useState({}); // Track user-specific likes

  const getUser = () => {
    try {
      const userString = localStorage.getItem('userData') || localStorage.getItem('user');
      if (!userString) return null;
      
      const user = JSON.parse(userString);
      return {
        id: user._id, // Always use _id from MongoDB
        name: `${user.firstName} ${user.lastName}`, // Use proper name fields
        username: user.email // Use email as username
      };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(PATCH_ANNOUNCE);
        setAnnouncements(response.data);
        
        // Initialize the likes state from fetched announcements
        const initialLikes = {};
        const initialLikedBy = {};
        response.data.forEach(announcement => {
          initialLikes[announcement._id] = announcement.likes || 0;
          initialLikedBy[announcement._id] = announcement.likedBy || [];
        });
        setLikes(initialLikes);
        setUserLikes(initialLikedBy);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 30000);
    return () => clearInterval(interval);
  }, []);

  const timeAgo = (timestamp) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffInMs = now - postDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays > 0) return `${diffInDays} day(s) ago`;
    if (diffInHours > 0) return `${diffInHours} hour(s) ago`;
    if (diffInMinutes > 0) return `${diffInMinutes} minute(s) ago`;
    return 'Just now';
  };

  const handleLike = async (announcementId, event) => {
    event.stopPropagation(); // Add this to prevent event bubbling
    const user = getUser();
    if (!user) {
      alert('Please login to like announcements');
      return;
    }

    try {
      const announcement = announcements.find(a => a._id === announcementId);
      const isLiked = announcement.likedBy?.includes(user.id);
      const action = isLiked ? 'unlike' : 'like';

      // Only update the specific announcement
      const response = await axios.patch(`${PATCH_ANNOUNCE}/${announcementId}`, {
        action,
        userId: user.id,
        userName: user.name,
        title: announcement.title,     // Add these fields
        content: announcement.content  // for new announcement creation
      });

      if (response.data) {
        // Update only the specific announcement in state
        setAnnouncements(prevAnnouncements => 
          prevAnnouncements.map(ann => 
            ann._id === announcementId ? {
              ...ann,
              likes: response.data.likes,
              likedBy: response.data.likedBy || []
            } : ann
          )
        );
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleComment = async (announcementId, commentText) => {
    const user = getUser();
    if (!user) {
      alert('Please login to comment');
      return;
    }

    if (!commentText.trim()) return;
  
    try {
      const response = await axios.patch(`${ADMINANNOUNCE}/${announcementId}`, {
        action: 'comment',
        comment: {
          userId: user.id,
          userName: user.name,
          text: commentText,
          timestamp: new Date().toISOString()
        }
      });

      if (response.data) {
        setAnnouncements(prev => 
          prev.map(ann => 
            ann._id === announcementId ? response.data : ann
          )
        );
        setComments(prev => ({
          ...prev,
          [announcementId]: response.data.comments
        }));
        setShowCommentInput(prev => ({
          ...prev,
          [announcementId]: false
        }));
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
        <FaBullhorn className="text-yellow-500 mr-2" /> Announcements
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : announcements.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {announcements.map((announcement, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-gray-50 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedAnnouncement(announcement)}
            >
              <h3 className="font-semibold text-lg text-gray-900">{announcement.title}</h3>
              <p className="text-sm text-gray-600 mt-1 truncate">{announcement.content}</p>
              <p className="text-xs text-gray-500 mt-1">{timeAgo(announcement.createdAt)}</p>
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={(e) => handleLike(announcement._id, e)}
                      className={`flex items-center space-x-2 transition-colors ${
                        announcement.likedBy?.includes(getUser()?.id)
                          ? 'text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full'
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      <FaThumbsUp className={
                        announcement.likedBy?.includes(getUser()?.id)
                          ? 'transform scale-110'
                          : ''
                      } />
                      <span>
                        {announcement.likes || 0}
                        {announcement.likedBy?.includes(getUser()?.id) 
                          ? ' Liked'
                          : announcement.likes > 0 
                            ? ' Likes'
                            : ' Like'
                        }
                      </span>
                      {announcement.likes > 0 && (
                        <span className="text-xs text-gray-500">
                          {announcement.likedBy?.includes(getUser()?.id)
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
                    onClick={() => setSelectedAnnouncement(announcement)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Read More
                  </button>
                </div>

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
                    {(comments[announcement._id] || []).map((comment, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700">{comment.userName}</p>
                        <p className="text-gray-600">{comment.text}</p>
                        <p className="text-xs text-gray-500">{timeAgo(comment.timestamp)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-gray-500 text-center">No announcements available.</p>
      )}

      {/* Announcement Modal */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAnnouncement(null)}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg max-w-md relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="absolute top-3 right-3 text-gray-600" onClick={() => setSelectedAnnouncement(null)}>
                <FaTimes className="text-lg" />
              </button>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">{selectedAnnouncement.title}</h3>
              <p className="text-sm text-gray-600">{selectedAnnouncement.content}</p>
              <p className="text-xs text-gray-500 mt-2">{timeAgo(selectedAnnouncement.createdAt)}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Announcements;
