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

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(PATCH_ANNOUNCE);
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
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

  const handleLike = async (announcementId) => {
    try {
      const currentLikes = likes[announcementId] || 0;
      const newLikeCount = currentLikes + 1;
  
      await axios.patch(`${ADMINANNOUNCE}/${announcementId}`, {
        likes: newLikeCount
      });
  
      setLikes(prev => ({
        ...prev,
        [announcementId]: newLikeCount
      }));
  
      setAnnouncements(prev => 
        prev.map(ann => 
          ann._id === announcementId 
            ? {...ann, likes: newLikeCount} 
            : ann
        )
      );
    } catch (error) {
      console.error('Error liking announcement:', error);
    }
  };

  const handleComment = async (announcementId, commentText) => {
    if (!commentText.trim()) return;
  
    try {
      const newComment = {
        userName: "Anonymous", // Palitan ito kung may user authentication ka
        text: commentText,
        timestamp: new Date().toISOString()
      };
  
      // Update local state muna
      setComments(prev => ({
        ...prev,
        [announcementId]: [...(prev[announcementId] || []), newComment]
      }));
  
      await axios.patch(`${ADMINANNOUNCE}/${announcementId}`, {
        $push: { comments: newComment } // Para hindi ma-overwrite, depende sa DB schema mo
      });
  
      setShowCommentInput(prev => ({
        ...prev,
        [announcementId]: false
      }));
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  // Poll for updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(ADMINANNOUNCE);
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
      } catch (error) {
        console.error('Error updating data:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(announcement._id);
                      }}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <FaThumbsUp />
                      <span>{announcement.likes || 0} Agree</span>
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
