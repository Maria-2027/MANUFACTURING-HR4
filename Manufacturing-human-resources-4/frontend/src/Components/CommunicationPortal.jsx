import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // If using React Router for navigation

const CommunicationPortal = () => {
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const [loading, setLoading] = useState(true); // State to manage loading

  // Simulate a loading time of 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds
    }, 2000); // Adjust the loading time as needed

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, []);

  // Example function to handle navigation to a different page
  const handleNavigation = (path) => {
    setLoading(true); // Set loading to true before navigating
    navigate(path); // Navigate to the new path
  };

  if (loading) {
    // Show loading spinner while loading
    return (
      <div className="container mx-auto p-8 bg-gray-200 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          {/* Loading Spinner */}
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-gray-600 mb-4"></div>
          <p className="text-gray-600 text-xl">Loading, please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 bg-gray-200">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 tracking-wide">Communication Portal</h1>
        <p className="text-xl text-gray-500 font-medium">
          Manage communication effectively and stay updated with the latest news
        </p>
      </div>

      {/* Announcements and Message Center Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition-shadow duration-500 transform hover:-translate-y-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">📢 Announcements</h2>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            Stay informed with company-wide updates and important announcements.
          </p>
          <button
            onClick={() => handleNavigation('/announcements')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300 w-full"
          >
            Go to Announcements
          </button>
        </div>

        {/* Message Center Section */}
        <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition-shadow duration-500 transform hover:-translate-y-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">💬 Message Center</h2>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            Send and receive messages from team members in real-time.
          </p>
          <button
            onClick={() => handleNavigation('/message-center')}
            className="bg-green-500 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300 w-full"
          >
            Go to Message Center
          </button>
        </div>
      </div>

      {/* Additional Footer */}
      <div className="mt-16 text-center">
        <p className="text-gray-500 text-lg">
          Need assistance? <span
            className="text-blue-600 cursor-pointer hover:underline font-medium"
            onClick={() => handleNavigation('/help')}
          >
            Visit our Help Center
          </span>
        </p>
      </div>
    </div>
  );
};

export default CommunicationPortal;
