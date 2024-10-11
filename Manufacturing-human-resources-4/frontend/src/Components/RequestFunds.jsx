import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RequestFunds = () => {
  const [formData, setFormData] = useState({
    requesterName: '',
    amount: '',
    reason: '',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true); // Initialize loading state to true
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    console.log('Funds Request Submitted: ', formData);

    // Simulate a network request
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay
    setSubmitted(true);
    setLoading(false); // End loading
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  // Simulate loading for a brief moment
  setTimeout(() => {
    setLoading(false); // Change loading state after 2 seconds
  }, 2000); // Adjust the loading time as needed

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      {loading ? (
        <div className="container mx-auto p-8 bg-gray-200 min-h-screen flex items-center justify-center w-full">
          <div className="flex flex-col items-center">
            {/* Loading Spinner */}
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-gray-600 mb-4"></div>
            <p className="text-gray-600 text-xl">Loading...</p>
          </div>
        </div>
      ) : submitted ? (
        <div className="text-center w-full max-w-lg mx-auto">
          <div className="bg-green-100 text-green-700 font-semibold p-4 rounded-lg mb-6">
            Your request has been submitted successfully.
          </div>
          <button
            onClick={handleBackClick}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Back
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg mx-auto">
          <div className="mb-6">
            <label className="block text-gray-700 font-bold text-lg mb-2" htmlFor="requesterName">
              Requester Name
            </label>
            <input
              type="text"
              id="requesterName"
              name="requesterName"
              value={formData.requesterName}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold text-lg mb-2" htmlFor="amount">
              Amount Requested
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="Enter amount in Peso"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold text-lg mb-2" htmlFor="reason">
              Reason for Request
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="Enter the reason for this fund request"
              rows="5"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold text-lg mb-2" htmlFor="date">
              Date of Request
            </label>
            <input
              type="text"
              id="date"
              name="date"
              value={formData.date}
              readOnly
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold text-lg mb-2" htmlFor="time">
              Time of Request
            </label>
            <input
              type="text"
              id="time"
              name="time"
              value={formData.time}
              readOnly
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Submit Request
            </button>

            <button
              type="button"
              onClick={handleBackClick}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RequestFunds;
