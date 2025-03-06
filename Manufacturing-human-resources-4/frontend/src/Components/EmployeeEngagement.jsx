import React, { useState } from 'react';

const EMSUGGEST = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/auth/employee-suggestions"
  : "https://backend-hr4.jjm-manufacturing.com/api/auth/employee-suggestions";

const EmployeeSuggestionBox = ({ user }) => {
  const [fullName, setFullName] = useState(`${user?.firstname || ""} ${user?.lastname || ""}`.trim());
  const [suggestion, setSuggestion] = useState('');
  const [notification, setNotification] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const suggestionData = { fullName, suggestion };

    try {
      const response = await fetch(`${EMSUGGEST}/api/employee-suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(suggestionData),
      });

      const data = await response.json();
      if (response.ok) {
        setNotification('Suggestion submitted successfully!');
        setSuggestion('');
      } else {
        setNotification('Error: ' + data.error);
      }
    } catch (error) {
      setNotification('Server error, please try again.');
    }

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  return (
    <div className="flex justify-center items-center p-8">
      {/* Left Section: Employee Suggestion Box */}
      <div className="w-1/2 p-8 bg-white rounded-xl shadow-xl">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Employee Suggestion Box</h1>
        
        {notification && (
          <div className="p-4 mb-6 text-center text-white bg-green-600 rounded-lg shadow-xl">
            {notification}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300 ease-in-out shadow-md"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <textarea
              className="w-full p-5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300 ease-in-out shadow-md"
              rows="5"
              placeholder="Write your suggestion..."
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-4 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            Submit Suggestion
          </button>
        </form>
      </div>

      {/* Right Section: Description */}
      <div className="w-1/2 p-8 ml-8 text-gray-700">
        <h2 className="text-3xl font-semibold mb-4">What is the Employee Suggestion Box?</h2>
        <p className="text-lg mb-4">
          The Employee Suggestion Box is a platform where employees can share their ideas, feedback, and suggestions to improve workplace culture, processes, and overall employee experience at JJM Manufacturing. This is an important channel for ensuring every employee has a voice in shaping the company's future.
        </p>
        <p className="text-lg">
          Suggestions may include anything from workplace improvements, new processes, or ideas that could help the company grow and enhance productivity. All submissions are reviewed by the HR team to ensure that each suggestion is taken into consideration for potential implementation.
        </p>
      </div>
    </div>
  );
};

export default EmployeeSuggestionBox;
