import React from 'react';
import { useNavigate } from 'react-router-dom'; // If using React Router for navigation

const CommunicationPortal = () => {
  const navigate = useNavigate(); // Initialize useNavigate for navigation (if needed)

  // Example function to handle navigation to a different page
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-blue-50 via-white to-blue-50 min-h-screen">
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
