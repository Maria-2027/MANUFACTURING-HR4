import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBullhorn, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ADMINANNOUNCE = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/integration/hr4-announcement"
  : "https://backend-hr4.jjm-manufacturing.com/api/integration/hr4-announcement";
const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${ADMINANNOUNCE}/api/integration/hr4-announcement`);
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
