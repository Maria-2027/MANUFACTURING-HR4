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
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Funds Request Submitted: ', formData);
    setSubmitted(true);
    // Add logic to send request to backend (e.g. Axios POST request)
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-green-50 via-white to-green-50 rounded-lg shadow-xl">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
        Request Funds from Finance (Payable) to Employee Engagement
      </h1>

      {submitted ? (
        <div className="text-center">
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
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
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
              Amount Requested (in Peso)
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
