import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EMSUGGEST = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/auth/employee-suggestions"
  : "https://backend-hr4.jjm-manufacturing.com/api/auth/employee-suggestions";

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development'
    ? 'http://localhost:7688'
    : 'https://backend-hr4.jjm-manufacturing.com',
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json'
  }
});

const EmployeeSuggestionBox = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(() => {
    const storedData = localStorage.getItem("userData");
    return storedData ? JSON.parse(storedData).firstName : "";
  });
  const [lastName, setLastName] = useState(() => {
    const storedData = localStorage.getItem("userData");
    return storedData ? JSON.parse(storedData).lastName : "";
  });
  const [suggestion, setSuggestion] = useState('');
  const [notification, setNotification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('');

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/auth/testLog');
      if (response.data) {
        const userData = response.data.data;
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        localStorage.setItem("userData", JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      if (error.response?.status === 401) {
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const suggestionData = {
      fullName: `${firstName} ${lastName}`,
      suggestion,
      category
    };

    try {
      const response = await fetch(EMSUGGEST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(suggestionData),
      });

      const data = await response.json();
      if (response.ok) {
        setShowModal(true);
        setSuggestion('');
      } else {
        setNotification('Error: ' + data.error);
      }
    } catch (error) {
      setNotification('Server error, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestionCategories = [
    { value: '', label: 'Select a category' },
    { value: 'work-tools', label: 'Work Tools & Equipment' },
    { value: 'training-development', label: 'Training & Development' },
    { value: 'communication', label: 'Communication Improvement' },
    { value: 'workplace-comfort', label: 'Workplace Comfort & Safety' },
    { value: 'employee-activities', label: 'Employee Activities & Events' },
    { value: 'team-building', label: 'Team Building Ideas' },
    { value: 'work-efficiency', label: 'Work Efficiency Ideas' },
    { value: 'other', label: 'Other Suggestions' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center p-8 relative"
    >
      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Suggestion Submitted Successfully!</h3>
                <p className="text-sm text-gray-500 mb-6">Thank you for your valuable input.</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-1/2 p-8 bg-white rounded-xl shadow-xl"
      >
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold text-blue-600 mb-6"
        >
          Employee Suggestion Box
        </motion.h1>
        
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 mb-6 text-center text-white bg-green-600 rounded-lg shadow-xl"
            >
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-lg font-medium text-gray-700 mb-2">Your Name</label>
            <div className="w-full p-4 border-2 border-gray-300 rounded-xl bg-gray-50 text-gray-700 shadow-inner">
              {`${firstName} ${lastName}` || 'Loading...'}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <label className="block text-lg font-medium text-gray-700 mb-2">Suggestion Category</label>
            <select
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300 ease-in-out shadow-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {suggestionCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </motion.div>

          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <textarea
              className="w-full p-5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300 ease-in-out shadow-md"
              rows="5"
              placeholder="Write your suggestion..."
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              required
            ></textarea>
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-500 text-white py-4 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg relative"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </div>
            ) : (
              'Submit Suggestion'
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Right Section: Description */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-1/2 p-8 ml-8 text-gray-700"
      >
        <h2 className="text-3xl font-semibold mb-4">Share Your Ideas</h2>
        <p className="text-lg mb-4">
          Your voice matters! This is your platform to share ideas that could make our 
          workplace better. Whether it's about improving your work tools, suggesting new 
          training programs, or ideas for team activities - we want to hear from you.
        </p>
        <p className="text-lg">
          Great suggestions could be anything from requesting better equipment for your work, 
          proposing new team-building activities, or sharing ideas that could make your 
          daily tasks easier and more efficient. Help us create a better workplace together!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default EmployeeSuggestionBox;
